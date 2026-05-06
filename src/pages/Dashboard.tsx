import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, Timestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserMinus, Clock, CheckCircle2 } from 'lucide-react';
import { Student, AttendanceLog } from '../types';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    absentToday: 0,
    lateToday: 0,
    attendanceRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Start of today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTS = Timestamp.fromDate(today);

        // 1. Total Students
        const studentsSnap = await getDocs(collection(db, 'students'));
        const totalStudents = studentsSnap.size;

        // 2. Logs for today
        let queryConstraints = [where('timestamp', '>=', todayTS)];
        if (!isAdmin && user?.email) {
          queryConstraints.push(where('teacherEmail', '==', user.email));
        }

        const logsQuery = query(
          collection(db, 'attendanceLogs'),
          ...queryConstraints
        );
        const logsSnap = await getDocs(logsQuery);
        const logs = logsSnap.docs.map(doc => doc.data() as AttendanceLog);

        const absentCount = logs.filter(l => l.status === 'غائب').length;
        const lateCount = logs.filter(l => l.status === 'متأخر').length;
        const presentCount = logs.filter(l => l.status === 'حاضر').length;

        const rate = totalStudents > 0 ? ((presentCount + lateCount) / totalStudents) * 100 : 0;

        setStats({
          totalStudents,
          absentToday: absentCount,
          lateToday: lateCount,
          attendanceRate: Math.round(rate),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const kpis = [
    { title: 'إجمالي الطلاب', value: stats.totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'غياب اليوم', value: stats.absentToday, icon: UserMinus, color: 'text-red-600', bg: 'bg-red-100' },
    { title: 'تأخر اليوم', value: stats.lateToday, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
    { title: 'نسبة الحضور', value: `${stats.attendanceRate}%`, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
        <p className="text-muted-foreground">
          {isAdmin ? 'مرحباً بك في نظام غيابي - مدرسة زيد بن ثابت' : 'مرحباً أيها المعلم'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <div className={`${kpi.bg} ${kpi.color} p-2 rounded-full`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? '...' : kpi.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>نظرة عامة على حضور الأسبوع</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
            {/* Chart would go here */}
            الرسم البياني متاح في صفحة التقارير
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>إشعارات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 text-orange-600 p-2 rounded-full">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">تنبيه تأخر</p>
                  <p className="text-xs text-muted-foreground truncate">5 طلاب متأخرين في الصف الثالث 1</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
