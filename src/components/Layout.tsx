import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { auth } from '../lib/firebase';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  School,
  ClipboardCheck,
  History,
  BarChart3,
  LogOut,
  Menu,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, isAdmin, staffMember } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'لوحة التحكم', path: '/', icon: LayoutDashboard, roles: ['ADMIN', 'TEACHER', 'TEACHER_LEADER', 'ATTENDANCE_OFFICER', 'SUPERVISOR'] },
    { name: 'إدارة الطلاب', path: '/students', icon: Users, roles: ['ADMIN', 'TEACHER_LEADER'] },
    { name: 'الهيئة التعليمية', path: '/staff', icon: Users, roles: ['ADMIN', 'SUPERVISOR'] },
    { name: 'إدارة الفصول', path: '/classes', icon: School, roles: ['ADMIN'] },
    { name: 'تحضير اليوم', path: '/attendance', icon: ClipboardCheck, roles: ['ADMIN', 'TEACHER', 'TEACHER_LEADER', 'ATTENDANCE_OFFICER'] },
    { name: 'سجل الغياب', path: '/logs', icon: History, roles: ['ADMIN', 'ATTENDANCE_OFFICER', 'TEACHER_LEADER'] },
    { name: 'التقارير', path: '/reports', icon: BarChart3, roles: ['ADMIN', 'SUPERVISOR', 'TEACHER_LEADER'] },
  ];

  const currentRole = staffMember?.appRole || (isAdmin ? 'ADMIN' : 'TEACHER');

  const visibleNavItems = navItems.filter(item => 
    item.roles.includes(currentRole as any)
  );

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'مدير نظام';
      case 'TEACHER': return 'معلم';
      case 'TEACHER_LEADER': return 'رائد نشاط / رئيس قسم';
      case 'ATTENDANCE_OFFICER': return 'مسؤول غياب';
      case 'SUPERVISOR': return 'مشرف';
      default: return 'موظف';
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-4 px-3">
      <div className="mb-8 px-4 flex items-center gap-2">
        <School className="w-8 h-8 text-primary" />
        <span className="text-xl font-bold">نظام غيابي</span>
      </div>
      <nav className="flex-1 space-y-1">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto px-4 py-2 border-t">
        <div className="mb-4">
          <p className="text-sm font-medium truncate">{user?.email}</p>
          <p className="text-xs text-muted-foreground">{getRoleLabel(currentRole)}</p>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-l bg-card">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden border-b bg-card px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <School className="w-6 h-6 text-primary" />
          <span className="font-bold">غيابي</span>
        </div>
        <Sheet>
          <SheetTrigger render={
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          } />
          <SheetContent side="right" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
