import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { StaffMember } from '../types';
import { buildAdminBootstrapRoleDoc } from './adminBootstrapRole';
import { deriveAuthRoleFlags, shouldBootstrapAdminRole } from './roleAccess';
import { resolveStaffMemberAfterAuth } from './authStaffMerge';

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
          if (shouldBootstrapAdminRole(authUser.email, roleData)) {
            const bootstrapDoc = buildAdminBootstrapRoleDoc();
            await setDoc(roleRef, bootstrapDoc);
            toast.success('تم تفعيل صلاحيات المدير بنجاح في قاعدة البيانات');
            roleData = bootstrapDoc;
          }

          const staffFromCollection = querySnapshot.empty
            ? null
            : ({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as StaffMember);
          setStaffMember(
            resolveStaffMemberAfterAuth(
              staffFromCollection,
              roleData,
              authUser.email,
              authUser.displayName
            )
          );
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

  const { isAdmin, isTeacher, isSupervisor } = deriveAuthRoleFlags(staffMember?.appRole);

  return (
    <AuthContext.Provider value={{ user, staffMember, loading, isAdmin, isTeacher, isSupervisor }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
