# تصميم Feature 001 — إدارة الطلاب والفصول + استيراد CSV شامل (Admin فقط)

## السياق
مشروع **غيابي (Ghiyabi)** هو واجهة ويب مبنية بـ **React 19 + Vite** مع **Firebase (Firestore + Auth)**. يوجد حاليًا صفحات لإدارة الطلاب والفصول:
- `src/pages/Students.tsx` (CRUD للطلاب + استيراد CSV محدود)
- `src/pages/Classes.tsx` (عرض الفصول + إسناد معلم + حذف)

## الهدف
تنفيذ Feature 001 بأبسط طريقة تحقق الأهداف التالية:
1) **إدارة الطلاب والفصول** (CRUD) عبر الواجهة.
2) **استيراد CSV واحد شامل** (كل صف = طالب) يقوم بعمل **Upsert للفصول ثم الطلاب**.
3) تطبيق صلاحيات **Admin فقط** على الواجهة وعلى Firestore Rules.
4) اعتماد سياسة **Strict**: تجاهل الصفوف الخاطئة مع تقرير أخطاء وملخص قبل التطبيق.

## القرارات (Decisions)
### 1) Approach
- تنفيذ مباشر فوق الصفحات الحالية (بدون شاشة Wizard جديدة).

### 2) صيغة CSV المعتمدة
- CSV واحد، كل صف = طالب، Header ثابت:
  - `class_name,grade_level,teacher_email,student_full_name,guardian_name,guardian_phone,parent_email,is_active`

### 3) سياسة الأخطاء
- Strict: أي صف ناقص (`class_name` أو `grade_level` أو `student_full_name`) يتم تجاهله وتسجيله في التقرير.

### 4) Upsert / Dedup
- الفصول: upsert بواسطة مفتاح منطقي `grade_level + class_name` بعد التنظيف.
- الطلاب: لا يوجد ID في الملف، لذا dedup بواسطة `classId + student_full_name`.
  - المستخدم ذكر أن تكرار الاسم داخل نفس الفصل مستبعد.

### 5) سياسة التحديث عند التطابق
- تحديث **الحقول غير الفارغة فقط** (لا يتم مسح بيانات موجودة بسبب خانة فارغة في CSV).

### 6) الصلاحيات
- UI: استخدام `useAuth().isAdmin` (نفس نمط `src/pages/Staff.tsx`) لإظهار/إخفاء أدوات الإدارة.
- Firestore Rules: جعل الكتابة على `students` و`classes` **Admin فقط** لمطابقة القرار.

## معايير القبول (Acceptance)
1) Admin يستطيع:
   - إضافة/تعديل/حذف فصل، وإسناد `teacherEmail`.
   - إضافة/تعديل/حذف طالب، وتفعيل/تعطيل `isActive`.
   - رفع CSV شامل ثم رؤية Preview (Counts + Errors) ثم تطبيق.
2) غير Admin:
   - لا يرى أدوات الإدارة/الاستيراد (ويُمنع من عمليات الكتابة عبر rules).
3) CI يمر: `npm run lint`, `npm test`, `npm run build`.

## مخاطر معروفة وحدود
- في حال ظهور أسماء مكررة داخل نفس الفصل مستقبلًا: نضيف عمود اختياري/إلزامي مثل `student_national_id` أو `student_external_id` ونغيّر dedup.
