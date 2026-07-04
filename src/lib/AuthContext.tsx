import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { StaffMember, AppRole } from '../types';
import {
  shouldBootstrapAdmin,
  mergeStaffWithRole,
  createStaffFromRole,
  resolveRoleFlags,
} from './rbac';

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
          const q = query(collection(db, 'staff'), where('email', '==', authUser.email));
          const querySnapshot = await getDocs(q);

          const roleRef = doc(db, 'roles', authUser.email);
          const roleSnap = await getDoc(roleRef);
          let roleData = roleSnap.exists() ? roleSnap.data() : null;
          if (shouldBootstrapAdmin(authUser.email, roleData)) {
            await setDoc(roleRef, { role: 'ADMIN' as AppRole });
            toast.success('تم تفعيل صلاحيات المدير بنجاح في قاعدة البيانات');
            roleData = { role: 'ADMIN' };
          }

          if (!querySnapshot.empty) {
            const data = mergeStaffWithRole(
              { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as StaffMember,
              roleData
            );
            setStaffMember(data);
          } else if (roleData && roleData.role) {
            setStaffMember(
              createStaffFromRole(authUser.email, authUser.displayName, roleData.role as AppRole)
            );
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

  const { isAdmin, isTeacher, isSupervisor } = resolveRoleFlags(staffMember?.appRole);

  return (
    <AuthContext.Provider value={{ user, staffMember, loading, isAdmin, isTeacher, isSupervisor }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
