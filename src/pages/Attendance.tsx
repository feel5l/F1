import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Class, Student, AttendanceStatus } from '../types';
import { CheckCircle2, XCircle, Clock, FileText, Loader2 } from 'lucide-react';

export default function Attendance() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, { status: AttendanceStatus, note: string }>>({});
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('');
  const [period, setPeriod] = useState('2');

  useEffect(() => {
    const fetchClasses = async () => {
      const snap = await getDocs(collection(db, 'classes'));
      setClasses(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Class)));
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    const fetchStudents = async () => {
      setLoading(true);
      const q = query(collection(db, 'students'), where('classId', '==', selectedClass), where('isActive', '==', true));
      const snap = await getDocs(q);
      const studentList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
      setStudents(studentList);
      
      // Initialize attendance with default "Present"
      const initial: typeof attendance = {};
      studentList.forEach(s => {
        initial[s.id] = { status: 'حاضر', note: '' };
      });
      setAttendance(initial);
      setLoading(false);
    };
    fetchStudents();
  }, [selectedClass]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], note }
    }));
  };

  const submitAttendance = async () => {
    if (!selectedClass || !subject || !user?.email) {
      toast.error('يرجى ملء كافة البيانات');
      return;
    }

    setLoading(true);
    try {
      // 1. Create session
      const sessionData = {
        date: serverTimestamp(),
        period: parseInt(period),
        subject,
        classId: selectedClass,
        teacherEmail: user.email,
      };
      const sessionRef = await addDoc(collection(db, 'sessions'), sessionData);

      // 2. Create logs
      const logPromises = Object.entries(attendance).map(([studentId, d]) => {
        const data = d as { status: AttendanceStatus; note: string };
        return addDoc(collection(db, 'attendanceLogs'), {
          studentId,
          sessionId: sessionRef.id,
          classId: selectedClass,
          teacherEmail: user.email,
          status: data.status,
          note: data.note,
          timestamp: serverTimestamp(),
        });
      });

      await Promise.all(logPromises);
      toast.success('تم تسجيل التحضير بنجاح');
      setSelectedClass('');
      setSubject('');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'attendanceLogs');
    } finally {
      setLoading(false);
    }
  };

  const attendanceList = Object.values(attendance) as { status: AttendanceStatus; note: string }[];

  const stats = {
    present: attendanceList.filter((a) => a.status === 'حاضر').length,
    absent: attendanceList.filter((a) => a.status === 'غائب').length,
    late: attendanceList.filter((a) => a.status === 'متأخر').length,
    excused: attendanceList.filter((a) => a.status === 'بعذر').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">تحضير اليوم</h1>
        <p className="text-muted-foreground">قم بتسجيل حضور وغياب الطلاب للفصل المختار</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>بيانات الحصة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>الفصل</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
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
              <Label>المادة</Label>
              <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="مثلاً: لغتي، رياضيات" />
            </div>
            <div className="space-y-2">
              <Label>الحصة</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                    <SelectItem key={p} value={p.toString()}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {selectedClass && (
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>قائمة الطلاب</CardTitle>
                <CardDescription>إجمالي: {students.length} طالب</CardDescription>
              </div>
              <div className="flex gap-2 text-xs">
                <Badge variant="outline" className="bg-green-50 text-green-700">حاضر: {stats.present}</Badge>
                <Badge variant="outline" className="bg-red-50 text-red-700">غائب: {stats.absent}</Badge>
                <Badge variant="outline" className="bg-orange-50 text-orange-700">متأخر: {stats.late}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">اسم الطالب</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead className="hidden md:table-cell">ملاحظات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map(student => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.fullName}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            <Button
                              size="sm"
                              variant={attendance[student.id]?.status === 'حاضر' ? 'default' : 'outline'}
                              className={attendance[student.id]?.status === 'حاضر' ? 'bg-green-600 hover:bg-green-700' : ''}
                              onClick={() => handleStatusChange(student.id, 'حاضر')}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1 md:hidden" />
                              <span className="hidden md:inline">حاضر</span>
                            </Button>
                            <Button
                              size="sm"
                              variant={attendance[student.id]?.status === 'غائب' ? 'default' : 'outline'}
                              className={attendance[student.id]?.status === 'غائب' ? 'bg-red-600 hover:bg-red-700' : ''}
                              onClick={() => handleStatusChange(student.id, 'غائب')}
                            >
                              <XCircle className="w-4 h-4 mr-1 md:hidden" />
                              <span className="hidden md:inline">غائب</span>
                            </Button>
                            <Button
                              size="sm"
                              variant={attendance[student.id]?.status === 'متأخر' ? 'default' : 'outline'}
                              className={attendance[student.id]?.status === 'متأخر' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                              onClick={() => handleStatusChange(student.id, 'متأخر')}
                            >
                              <Clock className="w-4 h-4 mr-1 md:hidden" />
                              <span className="hidden md:inline">متأخر</span>
                            </Button>
                            <Button
                              size="sm"
                              variant={attendance[student.id]?.status === 'بعذر' ? 'default' : 'outline'}
                              className={attendance[student.id]?.status === 'بعذر' ? 'bg-blue-500 hover:bg-blue-600' : ''}
                              onClick={() => handleStatusChange(student.id, 'بعذر')}
                            >
                              <FileText className="w-4 h-4 mr-1 md:hidden" />
                              <span className="hidden md:inline">بعذر</span>
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Input
                            placeholder="ملاحظة..."
                            value={attendance[student.id]?.note}
                            onChange={e => handleNoteChange(student.id, e.target.value)}
                            className="h-8 text-xs"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4">
                <Button className="w-full" onClick={submitAttendance} disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  حفظ التحضير
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
