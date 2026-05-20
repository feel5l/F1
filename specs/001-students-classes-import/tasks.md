# Feature 001 — المهام (Tasks)

## 0) تحضير
- [ ] إنشاء branch للميزة (موجود)
- [ ] إضافة ملفات spec/plan/tasks (موجود)

## 1) منطق الاستيراد (مستقل)
- [ ] إنشاء `src/lib/importCsv.ts`:
  - parse + normalize
  - validate rows (Strict)
  - توليد preview summary + errors

## 2) تحديث صفحة الطلاب
- [ ] تحديث `src/pages/Students.tsx`:
  - تغيير Dialog الاستيراد ليقبل CSV شامل
  - إضافة Preview قبل التطبيق
  - إضافة زر تحميل قالب CSV
  - تطبيق سياسة update-only-non-empty عند upsert

## 3) تحديث صفحة الفصول
- [ ] تحديث `src/pages/Classes.tsx`:
  - إضافة Dialog لإضافة/تعديل فصل (name/gradeLevel/teacherEmail)
  - ربطه بعمليات Firestore (Admin فقط)

## 4) الصلاحيات على الواجهة
- [ ] إضافة `isAdmin` checks (نفس نمط Staff) في Students/Classes

## 5) Firestore Rules
- [ ] تحديث `firestore.rules` لجعل write على `students` و`classes` = Admin فقط

## 6) اختبارات
- [ ] إضافة اختبارات Vitest لوحدة `importCsv` (حالات قبول/رفض/تحويل is_active)

## 7) تحقق نهائي
- [ ] `npm run lint`
- [ ] `npm test`
- [ ] `npm run build`

## 8) Commit
- [ ] استخدام git-commit لعمل commits صغيرة أو commit واحد حسب تفضيل الفريق
