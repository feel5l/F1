# Security Specification for Ghiyabi Attendance System

## 1. Data Invariants
- An `AttendanceLog` must be linked to a valid `Student` and `Session`.
- A `Session` must have a valid `Class`.
- Teachers can only view and manage attendance for sessions assigned to their email.
- The admin (`alzaem2002@gmail.com`) has unrestricted access.
- Status values for attendance are strictly: "حاضر", "غائب", "متأخر", "بعذر".

## 2. The "Dirty Dozen" Payloads (Denial Tests)
1. **Unauthenticated Write**: Attempt to create a student without being logged in.
2. **Teacher Spoofing**: Teacher A attempts to create a session for Teacher B.
3. **Invalid Email Verification**: User attempts to mark attendance without a verified email (not strictly required if we trust our internal list, but good practice).
4. **Admin Escalation**: A teacher attempts to change their role or access admin logs.
5. **Session Hijacking**: Teacher A attempts to update an attendance log belonging to Teacher B's session.
6. **Student ID Poisoning**: Creating a student with a 2KB string as ID.
7. **Status Injection**: Setting attendance status to "سحب" (not in enum).
8. **Orphaned Log**: Creating a log for a student or session that doesn't exist.
9. **Backdated/Future Log**: Creating a log with a timestamp significantly different from `request.time`.
10. **Immutable Field Update**: Attempting to change `classId` of an existing student.
11. **Shadow Field**: Adding `isPromoted: true` to a student record.
12. **Mass Scrape**: Unauthenticated user attempting to list all students.

## 3. Test Runner
(Placeholder for actual test file if environment support for local firestore emulator testing was requested, but we will focus on the rules first).
