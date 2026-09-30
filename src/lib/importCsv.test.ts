import { describe, expect, it } from 'vitest';

import {
  buildClassKey,
  buildPreview,
  normalizeEmail,
  normalizeText,
  parseIsActive,
} from './importCsv';

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

  it('يقبل صفوفاً صحيحة ويرفض الناقصة في نفس الملف (استيراد جزئي)', () => {
    const preview = buildPreview([
      { class_name: '', grade_level: 'ثالث', student_full_name: 'مرفوض' },
      {
        class_name: '1/أ',
        grade_level: 'ثالث',
        student_full_name: 'مقبول',
        is_active: '1',
      },
    ]);

    expect(preview.totalRows).toBe(2);
    expect(preview.acceptedRows).toBe(1);
    expect(preview.rejectedRows).toBe(1);
    expect(preview.studentsDiscovered).toBe(1);
    expect(preview.errors[0].rowNumber).toBe(2);
    expect(preview.students[0].isActive).toBe(true);
  });

  it('يدمج عدة طلاب في فصل واحد ويحدّث بريد المعلم من صف لاحق', () => {
    const preview = buildPreview([
      {
        class_name: '1/أ',
        grade_level: 'ثالث',
        student_full_name: 'طالب 1',
      },
      {
        class_name: '1/أ',
        grade_level: 'ثالث',
        teacher_email: 'lead@example.com',
        student_full_name: 'طالب 2',
        is_active: '0',
      },
    ]);

    expect(preview.classesDiscovered).toBe(1);
    expect(preview.studentsDiscovered).toBe(2);
    expect(preview.classes[0].key).toBe(buildClassKey('ثالث', '1/أ'));
    expect(preview.classes[0].teacherEmail).toBe('lead@example.com');
    expect(preview.students[1].isActive).toBe(false);
  });
});

describe('importCsv helpers', () => {
  it('normalizeText يضغط الفراغات ويتجاهل null', () => {
    expect(normalizeText('  أحمد   محمد  ')).toBe('أحمد محمد');
    expect(normalizeText(null)).toBe('');
  });

  it('normalizeEmail يطبّع الحروف', () => {
    expect(normalizeEmail('  Teacher@Example.COM ')).toBe('teacher@example.com');
  });

  it('parseIsActive يقبل true/false و 1/0 ويترك الحقل فارغاً', () => {
    expect(parseIsActive('TRUE')).toEqual({ value: true });
    expect(parseIsActive('0')).toEqual({ value: false });
    expect(parseIsActive('')).toEqual({ value: undefined });
    expect(parseIsActive('yes').error).toMatch(/true\/false/);
  });
});
