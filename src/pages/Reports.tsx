import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { AttendanceLog, Class, Student, AttendanceStatus } from '../types';
import { Download, Calendar as CalendarIcon, Filter, Search, Loader2 } from 'lucide-react';

const STATUS_COLORS: Record<AttendanceStatus, string> = {
  "حاضر": "#16a34a", // green-600
  "غائب": "#dc2626", // red-600
  "متأخر": "#f59e0b", // orange-500
  "بعذر": "#3b82f6", // blue-500
};

export default function Reports() {
  const { isAdmin, user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('week');
  
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    rate: 0
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const classSnap = await getDocs(collection(db, 'classes'));
        const classList = classSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Class));
        
        if (isAdmin) {
          setClasses(classList);
        } else {
          setClasses(classList.filter(c => c.teacherEmail === user?.email));
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchInitialData();
  }, [user, isAdmin]);

  useEffect(() => {
    if (selectedClass === 'all') {
      setStudents([]);
      setSelectedStudent('all');
      return;
    }
    const fetchStudents = async () => {
      const q = query(collection(db, 'students'), where('classId', '==', selectedClass));
      const snap = await getDocs(q);
      setStudents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student)));
      setSelectedStudent('all');
    };
    fetchStudents();
  }, [selectedClass]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let q = query(collection(db, 'attendanceLogs'), orderBy('timestamp', 'desc'));

      // Role based filtering
      if (!isAdmin && user?.email) {
        q = query(q, where('teacherEmail', '==', user.email));
      }

      // Filter by Class
      if (selectedClass !== 'all') {
        q = query(q, where('classId', '==', selectedClass));
      }

      // Filter by Student
      if (selectedStudent !== 'all') {
        q = query(q, where('studentId', '==', selectedStudent));
      }

      const snap = await getDocs(q);
      let logsData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as AttendanceLog));

      // Filter by Date Range (client-side for simplicity since we want relative ranges)
      const now = new Date();
      if (dateRange === 'today') {
        const start = startOfDay(now);
        logsData = logsData.filter(l => l.timestamp.toDate() >= start);
      } else if (dateRange === 'week') {
        const start = subDays(now, 7);
        logsData = logsData.filter(l => l.timestamp.toDate() >= start);
      } else if (dateRange === 'month') {
        const start = startOfMonth(now);
        logsData = logsData.filter(l => l.timestamp.toDate() >= start);
      }

      setLogs(logsData);

      // Calculate Stats
      const total = logsData.length;
      const present = logsData.filter(l => l.status === 'حاضر').length;
      const absent = logsData.filter(l => l.status === 'غائب').length;
      const late = logsData.filter(l => l.status === 'متأخر').length;
      const excused = logsData.filter(l => l.status === 'بعذر').length;
      const rate = total > 0 ? ((present + late + excused) / total) * 100 : 0;

      setStats({ total, present, absent, late, excused, rate: Math.round(rate) });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedClass, selectedStudent, dateRange]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchLogs();
    }, 5 * 60 * 1000); // 5 minutes refresh
    return () => clearInterval(interval);
  }, [selectedClass, selectedStudent, dateRange]);

  // Chart Data: Trends by Date
  const trendData = React.useMemo(() => {
    const daily: Record<string, { date: string; dateObj: Date; حاضر: number; غائب: number; متأخر: number; بعذر: number }> = {};
    
    logs.forEach(log => {
      const d = log.timestamp.toDate();
      const key = format(d, 'yyyy-MM-dd');
      if (!daily[key]) {
        daily[key] = { date: format(d, 'MMM d', { locale: ar }), dateObj: d, حاضر: 0, غائب: 0, متأخر: 0, بعذر: 0 };
      }
      daily[key][log.status]++;
    });

    return Object.values(daily).sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
  }, [logs]);

  const pieData = [
    { name: 'حاضر', value: stats.present, color: STATUS_COLORS['حاضر'] },
    { name: 'غائب', value: stats.absent, color: STATUS_COLORS['غائب'] },
    { name: 'متأخر', value: stats.late, color: STATUS_COLORS['متأخر'] },
    { name: 'بعذر', value: stats.excused, color: STATUS_COLORS['بعذر'] },
  ].filter(d => d.value > 0);

  const exportCSV = () => {
    const headers = ["التاريخ", "الطالب", "الحالة", "الملاحظات"];
    const rows = logs.map(l => [
      format(l.timestamp.toDate(), 'yyyy-MM-dd HH:mm'),
      l.studentId, // Would be better to join name
      l.status,
      l.note || ""
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `تقرير_الحضور_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">التقارير التفصيلية</h1>
          <p className="text-muted-foreground">تحليل بيانات الحضور والغياب للمدرسة</p>
        </div>
        <Button onClick={exportCSV} variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          تصدير البيانات (CSV)
        </Button>
      </div>

      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
              <Label>نطاق التاريخ</Label>
              <Select value={dateRange} onValueChange={(v: any) => setDateRange(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">اليوم</SelectItem>
                  <SelectItem value="week">آخر 7 أيام</SelectItem>
                  <SelectItem value="month">هذا الشهر</SelectItem>
                  <SelectItem value="all">الكل</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>الفصل</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="الكل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الفصول</SelectItem>
                  {classes.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>الطالب</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent} disabled={selectedClass === 'all'}>
                <SelectTrigger>
                  <SelectValue placeholder="الكل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الطلاب</SelectItem>
                  {students.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.fullName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="gap-2" onClick={fetchLogs}>
              <Search className="w-4 h-4" />
              تحديث
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي السجلات</CardTitle>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-600">حاضر</CardTitle>
                <div className="text-2xl font-bold">{stats.present}</div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-600">غائب</CardTitle>
                <div className="text-2xl font-bold">{stats.absent}</div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-600">متأخر</CardTitle>
                <div className="text-2xl font-bold">{stats.late}</div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-600">نسبة الانضباط</CardTitle>
                <div className="text-2xl font-bold">{stats.rate}%</div>
              </CardHeader>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>اتجاهات الحضور</CardTitle>
                <CardDescription>معدلات الغياب والحضور اليومية</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="حاضر" stroke={STATUS_COLORS['حاضر']} strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="غائب" stroke={STATUS_COLORS['غائب']} strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="متأخر" stroke={STATUS_COLORS['متأخر']} strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>توزيع الحالات</CardTitle>
                <CardDescription>نسبة كل حالة حضور ضمن الفترة المختارة</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>سجل البيانات المفلتر</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الملاحظات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.slice(0, 50).map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs">
                          {format(log.timestamp.toDate(), 'PPP p', { locale: ar })}
                        </TableCell>
                        <TableCell>
                          <Badge style={{ backgroundColor: STATUS_COLORS[log.status] }}>
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{log.note || '-'}</TableCell>
                      </TableRow>
                    ))}
                    {logs.length > 50 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground italic">
                          يتم عرض أول 50 سجلاً فقط في الجدول... استخدم التصدير لمشاهدة الكل
                        </TableCell>
                      </TableRow>
                    )}
                    {logs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-10">لا توجد بيانات للفترة المحددة</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
