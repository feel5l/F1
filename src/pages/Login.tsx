import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { School, KeyRound } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Handle both email and username (zayd12345)
      const normalizedEmail = email.trim();
      const loginIdentifier = normalizedEmail.includes('@') ? normalizedEmail : `${normalizedEmail}@ghiabi.com`;
      await signInWithEmailAndPassword(auth, loginIdentifier, password);
      toast.success('تم تسجيل الدخول بنجاح');
      navigate('/');
    } catch (error: any) {
      toast.error('خطأ في تسجيل الدخول: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const normalizedResetEmail = resetEmail.trim();

    if (!normalizedResetEmail) {
      toast.error('يرجى إدخال البريد الإلكتروني');
      return;
    }
    
    setResetLoading(true);
    try {
      const fullEmail = normalizedResetEmail.includes('@') ? normalizedResetEmail : `${normalizedResetEmail}@ghiabi.com`;
      await sendPasswordResetEmail(auth, fullEmail);
      toast.success('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
      setIsResetOpen(false);
    } catch (error: any) {
      toast.error('حدث خطأ: ' + error.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center">
            <School className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold">غيابي - Ghiyabi</CardTitle>
          <CardDescription>مدرسة زيد بن ثابت الابتدائية</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">اسم المستخدم أو البريد الإلكتروني</Label>
              <Input
                id="email"
                type="text"
                placeholder="zayd12345"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">كلمة المرور</Label>
                <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
                  <DialogTrigger render={
                    <Button type="button" variant="link" className="px-0 font-normal text-xs h-auto underline">
                      نسيت كلمة المرور؟
                    </Button>
                  } />
                  <DialogContent className="sm:max-w-[425px]" dir="rtl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <KeyRound className="h-5 w-5" />
                        إعادة تعيين كلمة المرور
                      </DialogTitle>
                      <DialogDescription>
                        أدخل بريدك الإلكتروني لنرسل لك رابط إعادة تعيين كلمة المرور.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Label htmlFor="resetEmail">البريد الإلكتروني</Label>
                      <Input
                        id="resetEmail"
                        type="text"
                        placeholder="zayd12345 أو example@ghiabi.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="mt-2"
                        dir="ltr"
                      />
                    </div>
                    <DialogFooter className="gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsResetOpen(false)}>إلغاء</Button>
                      <Button type="button" onClick={handleResetPassword} disabled={resetLoading}>
                        {resetLoading ? 'جاري الإرسال...' : 'إرسال الرابط'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                dir="ltr"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? 'جاري التحميل...' : 'تسجيل الدخول'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
