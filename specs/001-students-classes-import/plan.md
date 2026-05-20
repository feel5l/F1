# Feature 001 — خطة التنفيذ (Plan)

## 1) نقاط التغيير الرئيسية
- UI:
  - `src/pages/Students.tsx`: إضافة استيراد CSV شامل (بدون اختيار فصل مسبقًا) + Preview + تنزيل قالب.
  - `src/pages/Classes.tsx`: إضافة Dialog لإضافة/تعديل فصل (name/gradeLevel/teacherEmail).
  - ربط الصلاحيات على مستوى الواجهة باستخدام `useAuth().isAdmin`.

- Domain/Helpers:
  - إنشاء وحدة منطق للاستيراد (مثلاً: `src/lib/importCsv.ts`) تحتوي:
    - parsing + normalization
    - validation + error reporting
    - بناء ملخص preview

- Firestore:
  - تحديث `firestore.rules` لجعل write على `classes` و`students` = Admin فقط (مع الحفاظ على read الحالي).

- Tests:
  - إضافة اختبارات Vitest لمنطق الاستيراد (تجريب rows مختلفة).

## 2) تصميم منطق الاستيراد (بدون هلوسة)
### 2.1 Normalize
- `trim()` + استبدال تكرار الفراغات بفراغ واحد.
- `guardian_phone`: إبقاءها كنص كما هي (لا نفترض صيغة/تحويلات دولية).

### 2.2 Parse is_active
- يقبل: `true/false` (case-insensitive) أو `1/0`.
- إذا لم يوجد: نترك القيمة الحالية عند upsert، أو نضع `true` للطلاب الجدد (يمكن تثبيتها أثناء التنفيذ).

### 2.3 Batching
- Firestore batch limit = 500 عملية لكل batch.
- نجزّئ العمليات إلى دفعات آمنة.

## 3) ربط الفصول والطلاب
- مرحلة 1: تجهيز خريطة `classKey -> classId`:
  - classKey = `${gradeLevel}__${className}` بعد normalize.
  - query للفصول الموجودة (قد يكون عبر جلب كل الفصول ثم بناء map، وهو مقبول لأن عدد الفصول صغير في مدرسة).
- مرحلة 2: Upsert فصول جديدة/تحديث المعلم.
- مرحلة 3: Upsert الطلاب:
  - لأن dedup يتطلب البحث عن طالب بنفس الاسم في نفس الفصل:
    - خيار بسيط: جلب طلاب الفصل (أو كل الطلاب إذا العدد ما زال مقبولًا) ثم بناء map.

> ملاحظة: يوجد نص seed ضخم (304 طالب)؛ هذا ليس كبيرًا جدًا للتحميل في إدارة المدرسة، لكن يجب تنفيذ جلب البيانات بكفاءة.

## 4) الصلاحيات (UI)
- إضافة check في بداية الصفحات:
  - إن لم يكن Admin: عرض رسالة “لا تملك صلاحية” وإخفاء الأزرار.

## 5) خطوات التحقق
- تشغيل محلي:
  - `npm run lint`
  - `npm test`
  - `npm run build`

- سيناريو يدوي:
  - رفع CSV فيه 3 صفوف:
    - صف صحيح
    - صف ناقص class_name (يرفض)
    - صف يكرر طالب موجود (يعمل update)

