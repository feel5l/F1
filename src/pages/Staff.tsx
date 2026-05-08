
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { StaffMember, AppRole } from '../types';
import { useAuth } from '../lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, Edit2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Staff() {
  const { isAdmin } = useAuth();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
  const [newRole, setNewRole] = useState<AppRole | "">("");

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'staff'), orderBy('fullName'));
      const querySnapshot = await getDocs(q);
      const staffList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as StaffMember[];
      setStaff(staffList);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error('خطأ في جلب بيانات الموظفين');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!editingMember || !newRole) return;
    
    try {
      const memberRef = doc(db, 'staff', editingMember.id!);
      await updateDoc(memberRef, {
        appRole: newRole
      });

      // Sync with global roles collection for Firestore rules efficiency
      if (editingMember.email) {
        const roleRef = doc(db, 'roles', editingMember.email);
        await setDoc(roleRef, {
          role: newRole,
          updatedAt: new Date()
        });
      }

      toast.success('تم تحديث الدور بنجاح');
      setEditingMember(null);
      fetchStaff();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('حدث خطأ أثناء تحديث الدور');
    }
  };

  const filteredStaff = staff.filter(member =>
    member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.role || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.nationalId.includes(searchTerm)
  );

  const getRoleBadge = (role?: AppRole) => {
    switch (role) {
      case 'ADMIN': return <Badge className="bg-red-100 text-red-800 border-red-200">مدير نظام</Badge>;
      case 'TEACHER': return <Badge className="bg-blue-100 text-blue-800 border-blue-200">معلم</Badge>;
      case 'TEACHER_LEADER': return <Badge className="bg-purple-100 text-purple-800 border-purple-200">رائد نشاط</Badge>;
      case 'ATTENDANCE_OFFICER': return <Badge className="bg-green-100 text-green-800 border-green-200">مسؤول غياب</Badge>;
      case 'SUPERVISOR': return <Badge className="bg-amber-100 text-amber-800 border-amber-200">مشرف</Badge>;
      default: return <Badge variant="outline">غير محدد</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">الهيئة التعليمية</h1>
          <p className="text-muted-foreground">عرض وإدارة الطاقم التعليمي والإداري للمدرسة</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle>سجل الموظفين</CardTitle>
              <CardDescription>إجمالي {staff.length} موظف</CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث في الموظفين..."
                className="pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">البريد/المستخدم</TableHead>
                  <TableHead className="text-right">الوظيفة (النظام)</TableHead>
                  <TableHead className="text-right">الصلاحية</TableHead>
                  <TableHead className="text-right">التخصص</TableHead>
                  <TableHead className="text-right">الجوال</TableHead>
                  {isAdmin && <TableHead className="text-center w-20">إدارة</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 7 : 6} className="text-center py-10">جاري التحميل...</TableCell>
                  </TableRow>
                ) : filteredStaff.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 7 : 6} className="text-center py-10">لا يوجد بيانات مطابقة</TableCell>
                  </TableRow>
                ) : (
                  filteredStaff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium whitespace-nowrap">{member.fullName}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{member.email}</TableCell>
                      <TableCell className="whitespace-nowrap">{member.role}</TableCell>
                      <TableCell>
                        {getRoleBadge(member.appRole)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{member.specialization}</TableCell>
                      <TableCell dir="ltr">{member.phone}</TableCell>
                      {isAdmin && (
                        <TableCell className="text-center">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setEditingMember(member);
                              setNewRole(member.appRole || "");
                            }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Role Dialog */}
      <Dialog open={!!editingMember} onOpenChange={(open) => !open && setEditingMember(null)}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>تعديل صلاحيات الموظف</DialogTitle>
            <DialogDescription>
              تعديل الصلاحيات التقنية لـ {editingMember?.fullName} في نظام غيابي.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role">نوع الحساب والصلاحية</Label>
              <Select 
                value={newRole} 
                onValueChange={(value) => setNewRole(value as AppRole)}
              >
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="اختر الدور الجديد" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">مدير نظام (وصول كامل)</SelectItem>
                  <SelectItem value="TEACHER">معلم (فصوله فقط)</SelectItem>
                  <SelectItem value="TEACHER_LEADER">رائد نشاط / رئيس قسم</SelectItem>
                  <SelectItem value="ATTENDANCE_OFFICER">مسؤول غياب (كل الفصول)</SelectItem>
                  <SelectItem value="SUPERVISOR">مشرف (تقارير فقط)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditingMember(null)}>إلغاء</Button>
            <Button onClick={handleUpdateRole}>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
