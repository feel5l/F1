import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, where, Timestamp, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AttendanceLog, Session, Student, Class } from '../types';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Logs() {
  const { user, isAdmin } = useAuth();
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [sessions, setSessions] = useState<Record<string, Session>>({});
  const [students, setStudents] = useState<Record<string, Student>>({});
  const [classes, setClasses] = useState<Record<string, Class>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        let logsQuery;
        if (isAdmin) {
          logsQuery = query(collection(db, 'attendanceLogs'), orderBy('timestamp', 'desc'), limit(100));
        } else {
          logsQuery = query(
            collection(db, 'attendanceLogs'),
            where('teacherEmail', '==', user?.email),
            orderBy('timestamp', 'desc'),
            limit(100)
          );
        }
        
        const logsSnap = await getDocs(logsQuery);
        const logsData = logsSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) } as AttendanceLog));
        setLogs(logsData);

        // Fetch related data
        const studentDocs = await getDocs(collection(db, 'students'));
        const sessionDocs = await getDocs(collection(db, 'sessions'));
        const classDocs = await getDocs(collection(db, 'classes'));

        const studentMap: Record<string, Student> = {};
        studentDocs.forEach(d => studentMap[d.id] = { id: d.id, ...(d.data() as any) } as Student);
        setStudents(studentMap);

        const sessionMap: Record<string, Session> = {};
        sessionDocs.forEach(d => sessionMap[d.id] = { id: d.id, ...(d.data() as any) } as Session);
        setSessions(sessionMap);

        const classMap: Record<string, Class> = {};
        classDocs.forEach(d => classMap[d.id] = { id: d.id, ...(d.data() as any) } as Class);
        setClasses(classMap);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [user?.email, isAdmin]);

  const sendWhatsAppNotification = (log: AttendanceLog, student?: Student) => {
    if (!student?.guardianPhone) {
      toast.error('رقم ولي الأمر غير متوفر لهذا الطالب');
      return;
    }

    const date = log.timestamp instanceof Timestamp ? log.timestamp.toDate() : new Date();
    const formattedDate = format(date, 'PPP', { locale: ar });
    const message = `السلام عليكم، نود إحاطتكم بظهور ابنكم/ابنتكم ${student.fullName} غائباً (أو متأخراً) عن مدرسة زيد بن ثابت اليوم ${formattedDate}. نرجو تزويدنا بالعذر. شكراً لكم.`;
    
    // Clean phone number (keep only digits)
    const cleanPhone = student.guardianPhone.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'حاضر': return <Badge className="bg-green-600">حاضر</Badge>;
      case 'غائب': return <Badge variant="destructive">غائب</Badge>;
      case 'متأخر': return <Badge className="bg-orange-500">متأخر</Badge>;
      case 'بعذر': return <Badge className="bg-blue-500">بعذر</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">سجل الغياب</h1>
        <p className="text-muted-foreground">عرض آخر 100 سجل تحضير في المدرسة</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>التاريخ والوقت</TableHead>
                  <TableHead>اسم الطالب</TableHead>
                  <TableHead>الفصل</TableHead>
                  <TableHead>المادة</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-center w-20">إجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-10">جاري التحميل...</TableCell></TableRow>
                ) : logs.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-10">لا توجد سجلات بعد</TableCell></TableRow>
                ) : logs.map((log) => {
                  const student = students[log.studentId];
                  const session = sessions[log.sessionId];
                  const cls = session ? classes[session.classId] : null;
                  const date = log.timestamp instanceof Timestamp ? log.timestamp.toDate() : new Date();

                  return (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs">
                        {format(date, 'PPP p', { locale: ar })}
                      </TableCell>
                      <TableCell className="font-medium">{student?.fullName || 'غير معروف'}</TableCell>
                      <TableCell>{cls?.name || '-'}</TableCell>
                      <TableCell>{session?.subject || '-'}</TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell className="text-center">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          disabled={!student?.guardianPhone}
                          onClick={() => sendWhatsAppNotification(log, student)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
