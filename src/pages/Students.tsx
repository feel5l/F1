import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, query, where, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Student, Class } from '../types';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Search, Download, Upload, FileSpreadsheet } from 'lucide-react';
import Papa from 'papaparse';
import { buildClassKey, buildPreview, normalizeText, type CsvRow, type ImportPreview } from '../lib/importCsv';

export default function Students() {
  const { isAdmin } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');

  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [importFileName, setImportFileName] = useState('');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    classId: '',
    className: '',
    guardianName: '',
    guardianPhone: '',
    parentEmail: '',
    isActive: true,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const studentSnap = await getDocs(collection(db, 'students'));
      setStudents(studentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student)));

      const classSnap = await getDocs(collection(db, 'classes'));
      setClasses(classSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Class)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportToCSV = () => {
    const headers = ["المعرف", "الاسم الكامل", "الفصل", "اسم ولي الأمر", "هاتف ولي الأمر", "الحالة"];
    const rows = students.map(s => {
      const className = classes.find(c => c.id === s.classId)?.name || s.className || 'غير محدد';
      const status = s.isActive ? 'نشط' : 'غير نشط';
      return [
        s.id,
        s.fullName,
        className,
        s.guardianName || '-',
        s.guardianPhone || '-',
        status
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers, ...rows].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `قائمة_الطلاب_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadImportTemplate = () => {
    const header =
      'class_name,grade_level,teacher_email,student_full_name,guardian_name,guardian_phone,parent_email,is_active\n';
    const blob = new Blob(["\uFEFF" + header], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ghiyabi_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenDialog = (student: Student | null = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        fullName: student.fullName,
        classId: student.classId,
        className: student.className || '',
        guardianName: student.guardianName,
        guardianPhone: student.guardianPhone,
        parentEmail: student.parentEmail || '',
        isActive: student.isActive,
      });
    } else {
      setEditingStudent(null);
      setFormData({
        fullName: '',
        classId: '',
        className: '',
        guardianName: '',
        guardianPhone: '',
        parentEmail: '',
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!isAdmin) {
      toast.error('لا تملك صلاحية تنفيذ هذه العملية');
      return;
    }

    if (!formData.fullName || !formData.classId) {
      toast.error('يرجى إكمال البيانات الأساسية');
      return;
    }

    const selectedClass = classes.find(c => c.id === formData.classId);
    const dataToSave = {
      ...formData,
      className: selectedClass?.name || formData.className
    };

    try {
      if (editingStudent) {
        await updateDoc(doc(db, 'students', editingStudent.id), dataToSave);
        toast.success('تم تحديث بيانات الطالب');
      } else {
        await addDoc(collection(db, 'students'), dataToSave);
        toast.success('تم إضافة الطالب بنجاح');
      }
      setIsDialogOpen(false);
      fetchData();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'students');
    }
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      toast.error('لا تملك صلاحية تنفيذ هذه العملية');
      return;
    }

    if (!confirm('هل أنت متأكد من حذف هذا الطالب؟')) return;
    try {
      await deleteDoc(doc(db, 'students', id));
      toast.success('تم حذف الطالب');
      fetchData();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'students');
    }
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!isAdmin) {
      toast.error('لا تملك صلاحية تنفيذ هذه العملية');
      event.target.value = '';
      return;
    }
    if (!file) return;

    setImportLoading(true);
    setImportPreview(null);
    setImportFileName(file.name);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const rows = (results.data as CsvRow[]) || [];
          const preview = buildPreview(rows);
          setImportPreview(preview);

          if (preview.studentsDiscovered === 0) {
            toast.error('لم يتم العثور على صفوف صالحة للاستيراد');
          } else if (preview.rejectedRows > 0) {
            toast.message(`تم تجهيز المعاينة. يوجد ${preview.rejectedRows} صف/صفوف مرفوضة.`);
          } else {
            toast.success('تم تجهيز المعاينة بنجاح');
          }
        } catch (err) {
          console.error(err);
          toast.error('حدث خطأ أثناء تجهيز المعاينة');
        } finally {
          setImportLoading(false);
          // Reset file input
          event.target.value = '';
        }
      },
      error: (error) => {
        console.error(error);
        toast.error('فشل في قراءة ملف CSV');
        setImportLoading(false);
      }
    });
  };

  const applyImport = async () => {
    if (!isAdmin) {
      toast.error('لا تملك صلاحية تنفيذ هذه العملية');
      return;
    }
    if (!importPreview) return;
    if (importPreview.studentsDiscovered === 0) {
      toast.error('لا توجد صفوف صالحة للتطبيق');
      return;
    }

    setImportLoading(true);
    try {
      // -------- 1) Upsert classes (by logical key) --------
      const classSnap = await getDocs(collection(db, 'classes'));
      const existingClasses = classSnap.docs.map(d => ({ id: d.id, ...d.data() } as Class));

      const classKeyToId = new Map<string, string>();
      const classKeyToName = new Map<string, string>();
      for (const c of existingClasses) {
        const key = buildClassKey(normalizeText(c.gradeLevel), normalizeText(c.name));
        classKeyToId.set(key, c.id);
        classKeyToName.set(key, c.name);
      }

      for (const c of importPreview.classes) {
        if (!classKeyToId.has(c.key)) {
          const ref = await addDoc(collection(db, 'classes'), {
            name: c.className,
            gradeLevel: c.gradeLevel,
            teacherEmail: c.teacherEmail || '',
          });
          classKeyToId.set(c.key, ref.id);
          classKeyToName.set(c.key, c.className);
        } else if (c.teacherEmail) {
          const id = classKeyToId.get(c.key)!;
          await updateDoc(doc(db, 'classes', id), {
            teacherEmail: c.teacherEmail,
          });
        }
      }

      // -------- 2) Upsert students (by classId + fullName) --------
      const studentSnap = await getDocs(collection(db, 'students'));
      const existingStudents = studentSnap.docs.map(d => ({ id: d.id, ...d.data() } as Student));
      const studentKeyToId = new Map<string, string>();
      for (const s of existingStudents) {
        const key = `${s.classId}__${normalizeText(s.fullName)}`;
        studentKeyToId.set(key, s.id);
      }

      let created = 0;
      let updated = 0;

      for (const s of importPreview.students) {
        const classId = classKeyToId.get(s.classKey);
        if (!classId) continue;

        const className = classKeyToName.get(s.classKey) || s.classKey.split('__')[1] || '';
        const studentKey = `${classId}__${normalizeText(s.studentFullName)}`;
        const existingId = studentKeyToId.get(studentKey);

        const patch: Partial<Student> = {
          classId,
          className,
          fullName: s.studentFullName,
        };

        // update-only-non-empty
        if (s.guardianName) patch.guardianName = s.guardianName;
        if (s.guardianPhone) patch.guardianPhone = s.guardianPhone;
        if (s.parentEmail) patch.parentEmail = s.parentEmail;
        if (typeof s.isActive === 'boolean') patch.isActive = s.isActive;

        if (existingId) {
          await updateDoc(doc(db, 'students', existingId), patch);
          updated++;
        } else {
          await addDoc(collection(db, 'students'), {
            guardianName: '',
            guardianPhone: '',
            isActive: true,
            ...patch,
          });
          created++;
        }
      }

      toast.success(`تم تطبيق الاستيراد: ${created} طالب جديد، ${updated} تحديث`);
      setIsImportDialogOpen(false);
      setImportPreview(null);
      setImportFileName('');
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ أثناء تطبيق الاستيراد');
    } finally {
      setImportLoading(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(search.toLowerCase());
    const matchesClass = classFilter === 'all' || s.classId === classFilter;
    return matchesSearch && matchesClass;
  });

  const colCount = isAdmin ? 6 : 5;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">إدارة الطلاب</h1>
          <p className="text-muted-foreground">عرض وتعديل قائمة الطلاب في المدرسة</p>
        </div>
        {isAdmin ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsImportDialogOpen(true)}
              className="gap-2 border-primary text-primary hover:bg-primary/5"
            >
              <Upload className="w-4 h-4" />
              استيراد CSV شامل
            </Button>
            <Button variant="outline" onClick={exportToCSV} className="gap-2">
              <Download className="w-4 h-4" />
              تصدير الطلاب (CSV)
            </Button>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              إضافة طالب جديد
            </Button>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">صلاحيات القراءة فقط</div>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-1 w-full">
              <Label>بحث بالاسم</Label>
              <div className="relative">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن طالب..."
                  className="pr-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-[200px] space-y-1">
              <Label>تصفية حسب الفصل</Label>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الفصول</SelectItem>
                  {classes.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم الكامل</TableHead>
                  <TableHead>الفصل</TableHead>
                  <TableHead>اسم ولي الأمر</TableHead>
                  <TableHead>هاتف ولي الأمر</TableHead>
                  <TableHead className="w-[100px]">الحالة</TableHead>
                  {isAdmin && <TableHead className="text-left">إجراءات</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={colCount} className="text-center py-10">جاري التحميل...</TableCell></TableRow>
                ) : filteredStudents.length === 0 ? (
                  <TableRow><TableCell colSpan={colCount} className="text-center py-10">لا يوجد طلاب مطابقين</TableCell></TableRow>
                ) : filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.fullName}</TableCell>
                    <TableCell>{classes.find(c => c.id === student.classId)?.name || student.className || 'غير محدد'}</TableCell>
                    <TableCell>{student.guardianName || '-'}</TableCell>
                    <TableCell>{student.guardianPhone || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={student.isActive ? 'default' : 'secondary'}>
                        {student.isActive ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-left space-x-2 space-x-reverse">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(student)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(student.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={(open) => (isAdmin ? setIsDialogOpen(open) : setIsDialogOpen(false))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingStudent ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input
                id="name"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">الفصل</Label>
              <Select value={formData.classId} onValueChange={v => setFormData({ ...formData, classId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفصل" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardianName">اسم ولي الأمر</Label>
              <Input
                id="guardianName"
                value={formData.guardianName}
                onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">هاتف ولي الأمر</Label>
              <Input
                id="phone"
                value={formData.guardianPhone}
                onChange={e => setFormData({ ...formData, guardianPhone: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.isActive}
                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <Label htmlFor="active">حالة الطالب نشط</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
            <Button onClick={handleSave}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isImportDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setImportPreview(null);
            setImportFileName('');
          }
          setIsImportDialogOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-primary" />
              استيراد CSV شامل (طلاب + فصول)
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted/50 p-4 rounded-md text-sm space-y-2">
              <p className="font-semibold text-primary">تعليمات الملف:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>يجب أن يكون الملف بصيغة CSV.</li>
                <li>يتم الاعتماد على Header ثابت بأسماء الأعمدة.</li>
                <li>يمكنك تنزيل قالب جاهز ثم تعبئته.</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={downloadImportTemplate}>
                <Download className="w-4 h-4" />
                تنزيل قالب CSV
              </Button>
              {importFileName && <span className="text-sm text-muted-foreground">الملف: {importFileName}</span>}
            </div>

            <div className="space-y-2">
              <Label>اختر ملف CSV</Label>
              <Input
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
                disabled={!isAdmin || importLoading}
                className="cursor-pointer"
              />
            </div>

            {importLoading && (
              <p className="text-sm text-muted-foreground animate-pulse">جاري المعالجة، يرجى الانتظار...</p>
            )}

            {importPreview && (
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>إجمالي الصفوف: {importPreview.totalRows}</div>
                  <div>الصفوف المقبولة: {importPreview.acceptedRows}</div>
                  <div>الصفوف المرفوضة: {importPreview.rejectedRows}</div>
                  <div>الفصول المكتشفة: {importPreview.classesDiscovered}</div>
                  <div>الطلاب المكتشفون: {importPreview.studentsDiscovered}</div>
                </div>

                {importPreview.errors.length > 0 && (
                  <div className="rounded-md border p-3">
                    <p className="font-semibold text-destructive mb-2">أخطاء (أول 10):</p>
                    <ul className="list-disc list-inside space-y-1">
                      {importPreview.errors.slice(0, 10).map((e) => (
                        <li key={`${e.rowNumber}-${e.reason}`}>
                          سطر {e.rowNumber}: {e.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)} disabled={importLoading}>
              إغلاق
            </Button>
            <Button
              onClick={applyImport}
              disabled={!isAdmin || importLoading || !importPreview || importPreview.studentsDiscovered === 0}
            >
              تطبيق الاستيراد
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
