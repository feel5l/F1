# Feature 001 (Students/Classes + Unified CSV Import) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Admin-only students/classes management improvements and a unified CSV import (row=student) with strict validation + preview + upsert for classes then students.

**Architecture:** Keep CSV parsing/validation in a pure helper (`src/lib/importCsv.ts`) with unit tests. Keep Firestore reads/writes in pages (`Students.tsx`, `Classes.tsx`) to match existing patterns. Enforce Admin-only both in UI (`useAuth().isAdmin`) and in `firestore.rules`.

**Tech Stack:** React 19 + Vite, Firebase Firestore/Auth, Vitest, PapaParse.

---

## Files overview (what changes where)

**Create**
- `src/lib/importCsv.ts` — pure CSV normalization/validation + preview summary builder (NO Firestore calls)
- `src/lib/importCsv.test.ts` — Vitest unit tests for parsing/validation/summary

**Modify**
- `src/pages/Students.tsx` — unified CSV import dialog (no class preselect), preview, apply upsert, admin gating
- `src/pages/Classes.tsx` — add/edit class dialog (CRUD), admin gating
- `firestore.rules` — restrict write access for `classes` and `students` to Admin only

---

## Task 0: Prepare environment + baseline checks

**Files:** none

- [ ] Step 1: Pull latest branch

Run:
```bash
git checkout 001-students-classes-import

git pull
```

- [ ] Step 2: Install deps + run CI commands locally

Run:
```bash
npm ci
npm run lint
npm test
npm run build
```
Expected: all PASS (baseline).

- [ ] Step 3: Commit nothing (baseline)

---

## Task 1: Create pure CSV import helper (`src/lib/importCsv.ts`)

**Files:**
- Create: `src/lib/importCsv.ts`
- Test: `src/lib/importCsv.test.ts` (Task 6 will add tests; here we can stub)

### 1.1 Create the types + helper functions

- [ ] Step 1: Create `src/lib/importCsv.ts`

Add:
```ts
export type CsvBool = boolean | undefined;

export type CsvRow = Record<string, unknown>;

export type ImportRowErrorReason =
  | 'missing_required_fields'
  | 'invalid_is_active';

export interface ImportRowError {
  rowNumber: number; // 1-based (including header row in the original file)
  reason: ImportRowErrorReason;
  message: string;
  raw: CsvRow;
}

export interface NormalizedClass {
  key: string; // `${gradeLevel}__${className}`
  className: string;
  gradeLevel: string;
  teacherEmail?: string;
}

export interface NormalizedStudent {
  classKey: string;
  studentFullName: string;
  guardianName?: string;
  guardianPhone?: string;
  parentEmail?: string;
  isActive?: boolean;
}

export interface ImportPreview {
  totalRows: number;
  acceptedRows: number;
  rejectedRows: number;
  classesDiscovered: number;
  studentsDiscovered: number;
  errors: ImportRowError[];
  classes: NormalizedClass[];
  students: NormalizedStudent[];
}

const REQUIRED = ['class_name', 'grade_level', 'student_full_name'] as const;

export function normalizeText(v: unknown): string {
  const s = (v ?? '').toString();
  // trim + collapse spaces
  return s.replace(/\s+/g, ' ').trim();
}

export function normalizeEmail(v: unknown): string {
  return normalizeText(v).toLowerCase();
}

export function parseIsActive(v: unknown): { value?: boolean; error?: string } {
  const s = normalizeText(v);
  if (!s) return { value: undefined };

  const lower = s.toLowerCase();
  if (lower === 'true' || lower === '1') return { value: true };
  if (lower === 'false' || lower === '0') return { value: false };

  return { error: 'is_active must be true/false or 1/0' };
}

export function buildClassKey(gradeLevel: string, className: string): string {
  return `${gradeLevel}__${className}`;
}

export function buildPreview(rows: CsvRow[]): ImportPreview {
  const errors: ImportRowError[] = [];
  const classesMap = new Map<string, NormalizedClass>();
  const students: NormalizedStudent[] = [];

  for (let i = 0; i < rows.length; i++) {
    const raw = rows[i];
    const rowNumber = i + 2; // assuming header row is line 1 in the CSV

    const className = normalizeText(raw['class_name']);
    const gradeLevel = normalizeText(raw['grade_level']);
    const studentFullName = normalizeText(raw['student_full_name']);

    // required fields
    if (!className || !gradeLevel || !studentFullName) {
      errors.push({
        rowNumber,
        reason: 'missing_required_fields',
        message: 'class_name, grade_level, student_full_name are required',
        raw,
      });
      continue;
    }

    const classKey = buildClassKey(gradeLevel, className);
    const teacherEmail = normalizeEmail(raw['teacher_email']);

    if (!classesMap.has(classKey)) {
      classesMap.set(classKey, {
        key: classKey,
        className,
        gradeLevel,
        teacherEmail: teacherEmail || undefined,
      });
    } else if (teacherEmail) {
      // if multiple rows provide teacher_email, last non-empty wins in preview
      const existing = classesMap.get(classKey)!;
      existing.teacherEmail = teacherEmail;
      classesMap.set(classKey, existing);
    }

    const parsedActive = parseIsActive(raw['is_active']);
    if (parsedActive.error) {
      errors.push({
        rowNumber,
        reason: 'invalid_is_active',
        message: parsedActive.error,
        raw,
      });
      continue;
    }

    students.push({
      classKey,
      studentFullName,
      guardianName: normalizeText(raw['guardian_name']) || undefined,
      guardianPhone: normalizeText(raw['guardian_phone']) || undefined,
      parentEmail: normalizeEmail(raw['parent_email']) || undefined,
      isActive: parsedActive.value,
    });
  }

  const classes = Array.from(classesMap.values());

  const acceptedRows = rows.length - errors.length;

  return {
    totalRows: rows.length,
    acceptedRows,
    rejectedRows: errors.length,
    classesDiscovered: classes.length,
    studentsDiscovered: students.length,
    errors,
    classes,
    students,
  };
}
```

- [ ] Step 2: Commit

Run:
```bash
git add src/lib/importCsv.ts

git commit -m "feat(import): add pure CSV preview builder"
```

---

## Task 2: Update Students page to use unified CSV import + preview

**Files:**
- Modify: `src/pages/Students.tsx`

### 2.1 Add Admin gating

- [ ] Step 1: Add `useAuth` and block non-admin

At top add:
```ts
import { useAuth } from '../lib/AuthContext';
```

Inside component:
```ts
const { isAdmin } = useAuth();

if (!isAdmin) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">إدارة الطلاب</h1>
      <p className="text-muted-foreground">لا تملك صلاحية إدارة الطلاب</p>
    </div>
  );
}
```

- [ ] Step 2: Commit
```bash
git add src/pages/Students.tsx

git commit -m "feat(students): gate admin actions"
```

### 2.2 Replace current “import class preselect” with unified CSV import

- [ ] Step 3: Switch PapaParse to header-based parsing

Replace `Papa.parse(file, { complete: ... })` with:
```ts
Papa.parse(file, {
  header: true,
  skipEmptyLines: true,
  complete: (results) => { /* build preview */ },
  error: (error) => { /* toast */ },
});
```

- [ ] Step 4: Build preview using `buildPreview`

Add imports:
```ts
import { buildPreview, type ImportPreview, type CsvRow } from '../lib/importCsv';
```

Add state:
```ts
const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
const [importErrorsOpen, setImportErrorsOpen] = useState(false);
```

In Papa complete:
```ts
const rows = (results.data as CsvRow[]) || [];
const preview = buildPreview(rows);
setImportPreview(preview);
```

- [ ] Step 5: Update dialog UI

Inside the import dialog:
- File input (CSV)
- Preview summary (counts)
- Button “عرض الأخطاء” if `errors.length > 0`
- Button “تطبيق الاستيراد” disabled if `studentsDiscovered === 0`

- [ ] Step 6: Add “Download CSV template”

Add a helper:
```ts
const downloadTemplate = () => {
  const header = 'class_name,grade_level,teacher_email,student_full_name,guardian_name,guardian_phone,parent_email,is_active\n';
  const blob = new Blob(["\uFEFF" + header], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ghiyabi_import_template.csv';
  a.click();
  URL.revokeObjectURL(url);
};
```

### 2.3 Apply import (Firestore upsert) with “update-only-non-empty”

- [ ] Step 7: Implement apply handler

Add a function:
```ts
const applyImport = async () => {
  if (!importPreview) return;
  setImportLoading(true);

  try {
    // 1) load existing classes
    const classSnap = await getDocs(collection(db, 'classes'));
    const existingClasses = classSnap.docs.map(d => ({ id: d.id, ...d.data() } as Class));

    const classKeyToId = new Map<string, string>();
    for (const c of existingClasses) {
      const key = `${(c.gradeLevel || '').trim()}__${(c.name || '').trim()}`;
      classKeyToId.set(key, c.id);
    }

    // 2) upsert classes (batch in chunks)
    // create new classes first
    for (const c of importPreview.classes) {
      if (!classKeyToId.has(c.key)) {
        const ref = await addDoc(collection(db, 'classes'), {
          name: c.className,
          gradeLevel: c.gradeLevel,
          teacherEmail: c.teacherEmail || '',
        });
        classKeyToId.set(c.key, ref.id);
      } else if (c.teacherEmail) {
        const id = classKeyToId.get(c.key)!;
        await updateDoc(doc(db, 'classes', id), {
          teacherEmail: c.teacherEmail,
        });
      }
    }

    // 3) load existing students (small enough for school use)
    const studentSnap = await getDocs(collection(db, 'students'));
    const existingStudents = studentSnap.docs.map(d => ({ id: d.id, ...d.data() } as Student));

    const studentKeyToId = new Map<string, string>();
    for (const s of existingStudents) {
      const key = `${s.classId}__${(s.fullName || '').trim()}`;
      studentKeyToId.set(key, s.id);
    }

    // 4) upsert students
    let created = 0;
    let updated = 0;

    for (const s of importPreview.students) {
      const classId = classKeyToId.get(s.classKey);
      if (!classId) continue; // should not happen if class upsert succeeded

      const studentKey = `${classId}__${s.studentFullName}`;
      const existingId = studentKeyToId.get(studentKey);

      const patch: Partial<Student> = {
        classId,
        className: s.classKey.split('__')[1] || '',
        fullName: s.studentFullName,
      };

      // update-only-non-empty
      if (s.guardianName) patch.guardianName = s.guardianName;
      if (s.guardianPhone) patch.guardianPhone = s.guardianPhone;
      if (s.parentEmail) patch.parentEmail = s.parentEmail;
      if (typeof s.isActive === 'boolean') patch.isActive = s.isActive;

      if (existingId) {
        await updateDoc(doc(db, 'students', existingId), patch);
        updated++;
      } else {
        await addDoc(collection(db, 'students'), {
          guardianName: '',
          guardianPhone: '',
          isActive: true,
          ...patch,
        });
        created++;
      }
    }

    toast.success(`تم الاستيراد: ${created} طالب جديد، ${updated} تحديث`);
    setIsImportDialogOpen(false);
    setImportPreview(null);
    fetchData();
  } catch (err) {
    console.error(err);
    toast.error('حدث خطأ أثناء تطبيق الاستيراد');
  } finally {
    setImportLoading(false);
  }
};
```

- [ ] Step 8: Commit
```bash
git add src/pages/Students.tsx

git commit -m "feat(students): add unified CSV import with preview"
```

---

## Task 3: Add class create/edit dialog in Classes page

**Files:**
- Modify: `src/pages/Classes.tsx`

- [ ] Step 1: Add admin gating (same pattern as Staff)

Add:
```ts
import { useAuth } from '../lib/AuthContext';
```
Then:
```ts
const { isAdmin } = useAuth();
if (!isAdmin) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">إدارة الفصول</h1>
      <p className="text-muted-foreground">لا تملك صلاحية إدارة الفصول</p>
    </div>
  );
}
```

- [ ] Step 2: Add “Add/Edit Class” dialog state + form

Create state:
```ts
const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
const [classForm, setClassForm] = useState({ name: '', gradeLevel: '', teacherEmail: '' });
const [editingId, setEditingId] = useState<string | null>(null);
```

Add handlers:
```ts
const openCreate = () => {
  setEditingId(null);
  setClassForm({ name: '', gradeLevel: '', teacherEmail: '' });
  setIsEditDialogOpen(true);
};

const openEdit = (c: Class) => {
  setEditingId(c.id);
  setClassForm({ name: c.name || '', gradeLevel: c.gradeLevel || '', teacherEmail: c.teacherEmail || '' });
  setIsEditDialogOpen(true);
};

const saveClass = async () => {
  if (!classForm.name.trim() || !classForm.gradeLevel.trim()) {
    toast.error('يرجى إدخال اسم الفصل والمرحلة');
    return;
  }

  try {
    const payload = {
      name: classForm.name.trim(),
      gradeLevel: classForm.gradeLevel.trim(),
      teacherEmail: classForm.teacherEmail.trim().toLowerCase(),
    };

    if (editingId) {
      await updateDoc(doc(db, 'classes', editingId), payload);
      toast.success('تم تحديث الفصل');
    } else {
      await addDoc(collection(db, 'classes'), payload);
      toast.success('تم إضافة الفصل');
    }

    setIsEditDialogOpen(false);
    fetchData();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, 'classes');
  }
};
```

- [ ] Step 3: Add “إضافة فصل” button + “تعديل” action in table

Add a button beside refresh:
```tsx
<Button onClick={openCreate}>
  <Plus className="w-4 h-4 mr-2" />
  إضافة فصل
</Button>
```

For each row add edit button:
```tsx
<Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
  <Edit2 className="w-4 h-4" />
</Button>
```

- [ ] Step 4: Add dialog UI for form + save

- [ ] Step 5: Commit
```bash
git add src/pages/Classes.tsx

git commit -m "feat(classes): add class create/edit CRUD"
```

---

## Task 4: Update Firestore rules to enforce Admin-only writes

**Files:**
- Modify: `firestore.rules`

- [ ] Step 1: Restrict writes

In `match /classes/{classId}` change `allow write` to Admin-only (already is Admin, keep validation).

In `match /students/{studentId}` change:
```diff
- allow write: if (isAdmin() || isTeacherLeader()) && isValidStudent(incoming());
+ allow write: if isAdmin() && isValidStudent(incoming());
```

- [ ] Step 2: Commit
```bash
git add firestore.rules

git commit -m "fix(rules): restrict students/classes writes to admin"
```

---

## Task 5: Add Vitest tests for importCsv (pure logic)

**Files:**
- Create: `src/lib/importCsv.test.ts`

- [ ] Step 1: Create test file

```ts
import { describe, expect, it } from 'vitest';
import { buildPreview } from './importCsv';

describe('importCsv.buildPreview', () => {
  it('rejects rows missing required fields (strict)', () => {
    const preview = buildPreview([
      { class_name: '', grade_level: 'ثالث ابتدائي', student_full_name: 'أحمد' },
      { class_name: 'ثالث ابتدائي 1', grade_level: '', student_full_name: 'أحمد' },
      { class_name: 'ثالث ابتدائي 1', grade_level: 'ثالث ابتدائي', student_full_name: '' },
    ]);

    expect(preview.acceptedRows).toBe(0);
    expect(preview.rejectedRows).toBe(3);
    expect(preview.errors.length).toBe(3);
  });

  it('parses classes and students from valid rows', () => {
    const preview = buildPreview([
      {
        class_name: 'ثالث ابتدائي 1',
        grade_level: 'ثالث ابتدائي',
        teacher_email: 'Teacher@Example.com',
        student_full_name: 'أحمد محمد',
        guardian_name: 'ولي الأمر',
        guardian_phone: '9665xxxx',
        parent_email: 'PARENT@EXAMPLE.COM',
        is_active: 'true',
      },
    ]);

    expect(preview.rejectedRows).toBe(0);
    expect(preview.classesDiscovered).toBe(1);
    expect(preview.studentsDiscovered).toBe(1);

    expect(preview.classes[0].teacherEmail).toBe('teacher@example.com');
    expect(preview.students[0].parentEmail).toBe('parent@example.com');
    expect(preview.students[0].isActive).toBe(true);
  });

  it('rejects invalid is_active', () => {
    const preview = buildPreview([
      {
        class_name: 'ثالث ابتدائي 1',
        grade_level: 'ثالث ابتدائي',
        student_full_name: 'أحمد محمد',
        is_active: 'maybe',
      },
    ]);

    expect(preview.rejectedRows).toBe(1);
    expect(preview.errors[0].reason).toBe('invalid_is_active');
  });
});
```

- [ ] Step 2: Run tests

Run:
```bash
npm test
```
Expected: PASS

- [ ] Step 3: Commit
```bash
git add src/lib/importCsv.test.ts

git commit -m "test(import): add unit tests for CSV preview"
```

---

## Task 6: Final verification + optional cleanup

- [ ] Step 1: Run full checks
```bash
npm run lint
npm test
npm run build
```

- [ ] Step 2: Open PR from this branch (if not already)

- [ ] Step 3: Ensure no secrets were added

---

## Spec coverage self-check
- Admin-only UI: Tasks 2.1 + 3.1
- CSV unified import + strict + preview: Task 2.2
- Upsert classes then students + update-only-non-empty: Task 2.3
- Firestore rules enforcement: Task 4
- Tests: Task 5

No placeholders, matches spec.
