# Feature 001 — إدارة الطلاب والفصول + استيراد CSV شامل (Admin فقط)

## 1. الملخص
نضيف إدارة كاملة للطلاب والفصول داخل مشروع **غيابي**، مع استيراد **CSV واحد شامل** (كل صف = طالب) يقوم بعمل Upsert للفصول ثم الطلاب، وبصلاحيات **Admin فقط**.

## 2. الأهداف
- تمكين Admin من إدارة:
  - `classes` (إضافة/تعديل/حذف + إسناد معلم عبر `teacherEmail`).
  - `students` (إضافة/تعديل/حذف + تفعيل/تعطيل).
- استيراد CSV واحد شامل مع Preview قبل التطبيق.
- منع التكرار والتحديث المنضبط للبيانات.
- فرض صلاحيات Admin في الواجهة وFirestore rules.

## 3. خارج النطاق
- دعم XLSX (Excel) بدل CSV.
- صلاحيات حسب الصف للمعلمين.
- إرسال واتساب تلقائي (Feature لاحقة).

## 4. الأطراف/الأدوار
- **Admin**: إدارة الطلاب والفصول والاستيراد.
- **غير Admin**: قراءة فقط حسب ما يسمح به النظام، ولا يوجد CRUD في هذه الميزة.

## 5. بيانات Firestore المستهدفة
### 5.1 Class
من `src/types.ts`:
- `name: string`
- `gradeLevel: string`
- `teacherEmail?: string`

### 5.2 Student
من `src/types.ts`:
- `fullName: string`
- `classId: string`
- `className: string`
- `guardianName: string`
- `guardianPhone: string`
- `parentEmail?: string`
- `isActive: boolean`

## 6. صيغة CSV المعتمدة
Header:
```csv
class_name,grade_level,teacher_email,student_full_name,guardian_name,guardian_phone,parent_email,is_active
```

قواعد:
- مطلوب: `class_name`, `grade_level`, `student_full_name`.
- `teacher_email`, `guardian_*`, `parent_email`, `is_active` اختيارية.
- `is_active` يقبل: `true/false` أو `1/0` (يتم تحويلها إلى boolean).

## 7. سلوك الاستيراد (Strict + Preview)
### 7.1 Validation
- أي صف ناقص مطلوباته يتم تجاهله ويُسجل خطأ (لا يوقف العملية).

### 7.2 Upsert للفصول
- مفتاح منطقي: `(grade_level + class_name)` بعد التنظيف.
- إن وُجد فصل مطابق:
  - تحديث `teacherEmail` فقط إذا كانت `teacher_email` في CSV غير فارغة.
- إن لم يوجد:
  - إنشاء فصل جديد.

### 7.3 Upsert للطلاب
- لا يوجد ID للطالب في الملف.
- معيار dedup: `(classId + student_full_name)`.
- إذا وُجد طالب مطابق:
  - تحديث الحقول غير الفارغة فقط (لا يتم مسح قيم موجودة).
- إذا لم يوجد:
  - إنشاء طالب جديد.

### 7.4 Preview
يعرض قبل التطبيق:
- إجمالي الصفوف المقروءة
- الصفوف المقبولة/المرفوضة
- عدد الفصول: جديد/محدّث
- عدد الطلاب: جديد/محدّث
- قائمة أخطاء مختصرة (رقم السطر + السبب)

## 8. UI/UX
### 8.1 الطلاب (Students)
- زر: استيراد CSV شامل
- زر: تحميل قالب CSV
- Dialog للاستيراد: رفع ملف → Preview → تطبيق

### 8.2 الفصول (Classes)
- CRUD للفصول (إضافة/تعديل)
- (اختياري) تصدير CSV للفصول

## 9. الصلاحيات
- UI: تعتمد على `useAuth().isAdmin` لإظهار أدوات الإدارة.
- Firestore rules:
  - كتابة `students` و`classes` = Admin فقط.

## 10. معايير القبول
- Admin يستطيع CRUD + الاستيراد.
- غير Admin لا يستطيع CRUD (UI + rules).
- CI يمر.
