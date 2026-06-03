import { describe, it, expect } from 'vitest';
import { deriveAuthFlags } from './authRoles';

describe('deriveAuthFlags', () => {
  it('marks ADMIN only as admin', () => {
    expect(deriveAuthFlags('ADMIN')).toEqual({
      isAdmin: true,
      isTeacher: false,
      isSupervisor: false,
    });
  });

  it('treats TEACHER and TEACHER_LEADER as teachers', () => {
    expect(deriveAuthFlags('TEACHER').isTeacher).toBe(true);
    expect(deriveAuthFlags('TEACHER_LEADER').isTeacher).toBe(true);
    expect(deriveAuthFlags('TEACHER').isAdmin).toBe(false);
  });

  it('marks SUPERVISOR without granting admin or teacher', () => {
    expect(deriveAuthFlags('SUPERVISOR')).toEqual({
      isAdmin: false,
      isTeacher: false,
      isSupervisor: true,
    });
  });

  it('returns all false when role is missing', () => {
    expect(deriveAuthFlags(undefined)).toEqual({
      isAdmin: false,
      isTeacher: false,
      isSupervisor: false,
    });
  });
});
