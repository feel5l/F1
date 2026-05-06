import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, query, where, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
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

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  
  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importClassId, setImportClassId] = useState('');
  const [importLoading, setImportLoading] = useState(false);
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
    if (!file || !importClassId) {
      if (!importClassId) toast.error('يرجى اختيار الفصل أولاً');
      return;
    }

    setImportLoading(true);
    Papa.parse(file, {
      complete: async (results) => {
        try {
          const data = results.data as string[][];
          // Skip header if exists (simple check if first row contains non-typical names)
          const startIndex = (data[0][0]?.includes('الاسم') || data[0][0]?.includes('Name')) ? 1 : 0;
          
          let count = 0;
          for (let i = startIndex; i < data.length; i++) {
            const row = data[i];
            const name = row[0]?.trim();
            if (name) {
              const selectedClass = classes.find(c => c.id === importClassId);
              await addDoc(collection(db, 'students'), {
                fullName: name,
                classId: importClassId,
                className: selectedClass?.name || '',
                guardianName: row[1]?.trim() || '',
                guardianPhone: row[2]?.trim() || '',
                parentEmail: row[3]?.trim() || '',
                isActive: true,
              });
              count++;
            }
          }
          
          toast.success(`تم استيراد ${count} طالباً بنجاح`);
          setIsImportDialogOpen(false);
          fetchData();
        } catch (err) {
          console.error(err);
          toast.error('حدث خطأ أثناء استيراد البيانات');
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

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(search.toLowerCase());
    const matchesClass = classFilter === 'all' || s.classId === classFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">إدارة الطلاب</h1>
          <p className="text-muted-foreground">عرض وتعديل قائمة الطلاب في المدرسة</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsImportDialogOpen(true)} className="gap-2 border-primary text-primary hover:bg-primary/5">
            <Upload className="w-4 h-4" />
            استيراد من CSV
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
                  <TableHead className="text-left">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-10">جاري التحميل...</TableCell></TableRow>
                ) : filteredStudents.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-10">لا يوجد طلاب مطابقين</TableCell></TableRow>
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
                    <TableCell className="text-left space-x-2 space-x-reverse">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(student)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(student.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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

      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-primary" />
              استيراد الطلاب من ملف Excel / CSV
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted/50 p-4 rounded-md text-sm space-y-2">
              <p className="font-semibold text-primary">تعليمات الملف:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>يجب أن يكون الملف بصيغة CSV.</li>
                <li>العمود الأول: اسم الطالب الكامل.</li>
                <li>العمود الثاني (اختياري): اسم ولي الأمر.</li>
                <li>العمود الثالث (اختياري): رقم هاتف ولي الأمر.</li>
                <li>العمود الرابع (اختياري): البريد الإلكتروني لولي الأمر.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label>اختر الفصل الذي سيتم إضافة الطلاب إليه</Label>
              <Select value={importClassId} onValueChange={setImportClassId}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفصل الوجهة" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>اختر ملف CSV</Label>
              <Input
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
                disabled={!importClassId || importLoading}
                className="cursor-pointer"
              />
            </div>
            
            {importLoading && (
              <p className="text-sm text-muted-foreground animate-pulse">جاري الاستيراد، يرجى الانتظار...</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)} disabled={importLoading}>إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
