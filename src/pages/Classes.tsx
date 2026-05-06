import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, query, where, deleteDoc, writeBatch } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Class } from '../types';
import { Plus, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'classes'));
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Class));
      // Sort by grade level and name
      list.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
      setClasses(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const seedClasses = async () => {
    if (!confirm('سيتم إضافة الفصول الدراسية الـ 12 و5 طلاب لكل فصل. هل أنت متأكد؟')) return;
    
    setLoading(true);
    const initialClasses = [
      { name: 'ثالث ابتدائي 1', gradeLevel: '3' },
      { name: 'ثالث ابتدائي 2', gradeLevel: '3' },
      { name: 'ثالث ابتدائي 3', gradeLevel: '3' },
      { name: 'ثالث ابتدائي 4', gradeLevel: '3' },
      { name: 'رابع ابتدائي 1', gradeLevel: '4' },
      { name: 'رابع ابتدائي 2', gradeLevel: '4' },
      { name: 'رابع ابتدائي 3', gradeLevel: '4' },
      { name: 'خامس ابتدائي 1', gradeLevel: '5' },
      { name: 'خامس ابتدائي 2', gradeLevel: '5' },
      { name: 'خامس ابتدائي 3', gradeLevel: '5' },
      { name: 'سادس ابتدائي 1', gradeLevel: '6' },
      { name: 'سادس ابتدائي 2', gradeLevel: '6' },
    ];

    const studentNames = [
      'أحمد محمد علي', 'خالد وليد حسن', 'ياسر فهد السليمان', 'عبدالرحمن يوسف', 'سلطان إبراهيم',
      'بندر مساعد', 'فيصل القحطاني', 'محمد العتيبي', 'سعد الشمري', 'نايف التميمي'
    ];

    try {
      for (const classData of initialClasses) {
        const classRef = await addDoc(collection(db, 'classes'), { ...classData, homeroomTeacher: '' });
        
        // Add 5 students for each class
        const batch = writeBatch(db);
        for (let i = 1; i <= 5; i++) {
          const studentDoc = doc(collection(db, 'students'));
          batch.set(studentDoc, {
            fullName: `${studentNames[Math.floor(Math.random() * studentNames.length)]} (${i})`,
            classId: classRef.id,
            parentPhone: `05${Math.floor(Math.random() * 100000000)}`,
            isActive: true,
            parentEmail: `parent${classRef.id}${i}@example.com`
          });
        }
        await batch.commit();
      }
      
      toast.success('تمت إضافة جميع الفصول والطلاب بنجاح');
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ أثناء بذر البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('حذف الفصل سيؤدي لمشاكل في بيانات الطلاب المرتبطين به. هل أنت متأكد؟')) return;
    try {
      await deleteDoc(doc(db, 'classes', id));
      toast.success('تم حذف الفصل');
      fetchData();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'classes');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إدارة الفصول</h1>
          <p className="text-muted-foreground">قائمة الفصول الدراسية الـ 12 في مدرسة زيد بن ثابت</p>
        </div>
        <div className="flex gap-2">
          {classes.length === 0 && (
            <Button variant="secondary" onClick={seedClasses} disabled={loading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              إضافة الفصول الأساسية
            </Button>
          )}
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم الفصل</TableHead>
                  <TableHead>المرحلة</TableHead>
                  <TableHead>رائد الفصل</TableHead>
                  <TableHead className="text-left w-[100px]">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-10">جاري التحميل...</TableCell></TableRow>
                ) : classes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 space-y-4">
                      <p>لا توجد فصول مضافة بعد</p>
                      <Button onClick={seedClasses}>إضافة الفصول الـ 12 الأساسية</Button>
                    </TableCell>
                  </TableRow>
                ) : classes.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.gradeLevel}</TableCell>
                    <TableCell>{c.homeroomTeacher || '-'}</TableCell>
                    <TableCell className="text-left">
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(c.id)}>
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
    </div>
  );
}
