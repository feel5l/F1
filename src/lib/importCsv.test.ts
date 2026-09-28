import { describe, expect, it } from 'vitest';

import { buildPreview } from './importCsv';

describe('importCsv.buildPreview', () => {
  it('يرفض الصفوف الناقصة للحقول المطلوبة (Strict)', () => {
    const preview = buildPreview([
      { class_name: '', grade_level: 'ثالث ابتدائي', student_full_name: 'أحمد' },
      { class_name: 'ثالث ابتدائي 1', grade_level: '', student_full_name: 'أحمد' },
      { class_name: 'ثالث ابتدائي 1', grade_level: 'ثالث ابتدائي', student_full_name: '' },
    ]);

    expect(preview.acceptedRows).toBe(0);
    expect(preview.rejectedRows).toBe(3);
    expect(preview.errors.length).toBe(3);
    expect(preview.studentsDiscovered).toBe(0);
    expect(preview.classesDiscovered).toBe(0);
  });

  it('يبني الفصول والطلاب من صفوف صحيحة ويطبع البريد الإلكتروني', () => {
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

  it('يرفض is_active غير الصالح', () => {
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
