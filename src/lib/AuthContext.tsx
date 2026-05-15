import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { StaffMember, AppRole } from '../types';

interface AuthContextType {
  user: User | null;
  staffMember: StaffMember | null;
  loading: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  isSupervisor: boolean;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  staffMember: null,
  loading: true, 
  isAdmin: false,
  isTeacher: false,
  isSupervisor: false
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [staffMember, setStaffMember] = useState<StaffMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      if (authUser && authUser.email) {
        try {
          // Fetch from staff collection
          const q = query(collection(db, 'staff'), where('email', '==', authUser.email));
          const querySnapshot = await getDocs(q);
          
          // Fetch from roles collection (Master Source for Rules)
          const roleRef = doc(db, 'roles', authUser.email);
          const roleSnap = await getDoc(roleRef);
          let roleData = roleSnap.exists() ? roleSnap.data() : null;
          if (!roleData?.role && authUser.email === 'alzaem3000@gmail.com') {
            await setDoc(roleRef, { role: 'ADMIN' as AppRole });
            toast.success('تم تفعيل صلاحيات المدير بنجاح في قاعدة البيانات');
            roleData = { role: 'ADMIN' };
          }

          if (!querySnapshot.empty) {
            const data = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as StaffMember;
            // Overwrite appRole if present in roles collection
            if (roleData && roleData.role) {
              data.appRole = roleData.role as AppRole;
            }
            setStaffMember(data);
          } else if (roleData && roleData.role) {
            // In case user is in roles but not yet in staff (safety fallback)
            setStaffMember({
              fullName: authUser.displayName || 'مستخدم جديد',
              email: authUser.email,
              phone: '',
              role: 'موظف',
              appRole: roleData.role as AppRole,
              specialization: ''
            });
          } else {
            setStaffMember(null);
          }
        } catch (error) {
          console.error("Error fetching staff member:", error);
          setStaffMember(null);
        }
      } else {
        setStaffMember(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const isAdmin = staffMember?.appRole === 'ADMIN';
  const isTeacher = staffMember?.appRole === 'TEACHER' || staffMember?.appRole === 'TEACHER_LEADER';
  const isSupervisor = staffMember?.appRole === 'SUPERVISOR';

  return (
    <AuthContext.Provider value={{ user, staffMember, loading, isAdmin, isTeacher, isSupervisor }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
