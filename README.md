# غيابي (Ghiyabi) - نظام تحضير الطلاب 🎓
[![CI](https://github.com/your-repo/workflows/CI/badge.svg)](https://github.com/your-repo/actions)

نظام إلكتروني متقدم لإدارة وتحضير الطلاب مخصص لمدرسة زيد بن ثابت الابتدائية، مصمم لتبسيط عملية تسجيل الغياب والحضور اليومي وتقديم تقارير دقيقة للمعلمين والإدارة.

---

## 🚀 التقنيات المستخدمة (Tech Stack)

تم بناء المشروع باستخدام أحدث التقنيات لضمان السرعة والأمان:

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore & Authentication)
- **State Management**: React Hooks & Context API
- **Charts**: [Recharts](https://recharts.org/)
- **Animations**: [Motion](https://motion.dev/)
- **Testing**: [Vitest](https://vitest.dev/)

---

## ✨ المميزات الأساسية (Key Features)

- 🔐 **نظام صلاحيات**: تسجيل دخول للمعلمين والإدارة (Admin/Teacher).
- 📝 **تحضير ذكي**: واجهة سهلة وسريعة لتحضير الطلاب يومياً.
- 📊 **لوحة تحكم**: عرض إحصائيات فورية لغياب وحضور الطلاب.
- 📈 **تقارير متقدمة**: استخراج تقارير دورية واتجاهات الغياب (Attendance Trends).
- 🔄 **تحديث تلقائي**: تحديث البيانات فورياً كل 5 دقائق في صفحة التقارير.
- 📱 **متوافق مع الجوال**: واجهة مستخدم متجاوبة تدعم اللغة العربية (RTL).

---

## 🛠️ البدء بالعمل (Getting Started)

### المتطلبات (Prerequisites)
- Node.js (v20+)
- npm or yarn

### التثبيت (Installation)

1. قم بتحميل المشروع:
   ```bash
   git clone <repository-url>
   cd ghiyabi
   ```

2. تثبيت الحزم:
   ```bash
   npm install
   ```

3. إعداد البيئة (Environment Variables):
   سيقوم النظام بإنشاء ملف `firebase-applet-config.json` عند الإعداد، ولكن للتشغيل المحلي يمكنك إضافة مفتاح Gemini في ملف `.env`:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

### التشغيل (Development)
```bash
npm run dev
```
سيعمل التطبيق على الرابط: `http://localhost:3000`

### الاختبارات (Testing)
```bash
npm test
```

---

## 📂 هيكلة المشروع (Project Structure)

```text
├── src/
│   ├── components/    # المكونات القابلة لإعادة الاستخدام (UI & Shared)
│   ├── lib/           # إعدادات Firebase والوظائف المساعدة
│   ├── pages/         # صفحات التطبيق (Dashboard, Reports, Attendance, etc.)
│   ├── types/         # تعريفات TypeScript
│   └── App.tsx        # إدارة المسارات (Routes)
├── .github/           # ملفات CI/CD (GitHub Actions)
├── firestore.rules    # قواعد حماية قاعدة البيانات
└── seed.ts           # بيانات تجريبية أولية (Seed Data)
```

---

## 🔐 الأمان وقواعد البيانات (Security)

المشروع يستخدم **Firebase Security Rules** لضمان أن المعلمين يشاهدون فقط بيانات طلابهم، بينما يملك المسؤول (Admin) صلاحية الرؤية الكاملة. 
- الملف المسؤول: `firestore.rules`.
- قبل النشر، تأكد من مراجعة القواعد الأمنية.

---

## 🤝 المساهمة (Contribution)

1. قم بعمل Fork للمشروع.
2. أنشئ فرعاً جديداً (`git checkout -b feature/AmazingFeature`).
3. قم بعمل Commit لتغييراتك (`git commit -m 'Add some AmazingFeature'`).
4. قم بعمل Push للفرع (`git push origin feature/AmazingFeature`).
5. افتح Pull Request.

---

## 📜 الترخيص (License)
هذا المشروع خاص بمدرسة زيد بن ثابت الابتدائية.

---
*تم التطوير بكل ❤️ لدعم التعليم في المملكة العربية السعودية.*
