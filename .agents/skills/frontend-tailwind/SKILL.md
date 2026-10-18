---
name: frontend-tailwind
description: "Implement or review Tailwind styling, responsive layouts, and accessible UI states."
---

# Tailwind CSS

## Contract

Apply this skill only when the task matches: Tailwind CSS. Keep the work within the requested scope and do not invent missing facts.

## When to Use

Implement or review Tailwind styling, responsive layouts, and accessible UI states.

## Inputs

- The user goal, acceptance criteria, and constraints.
- The relevant repository files, existing conventions, commands, and test results.
- Any required tool capability, permission, or external dependency.

## Constraints

- Do not guess when a required input, contract, or project convention is unknown.
- Preserve existing behavior outside the requested scope and avoid unnecessary abstraction.
- Never hide failures by weakening validation, tests, or safety checks.
- If a shortcut creates technical debt, record its impact and the condition for revisiting it.

## Procedure

1. Confirm that the task matches this skill and identify the expected outcome.
2. Inspect the relevant files, dependencies, interfaces, and existing checks before changing anything.
3. Apply the guidance below using the smallest maintainable change.
4. Run the most relevant verification commands and inspect the final diff.
5. Report the result, evidence, unresolved risks, and any technical debt.

## Output

- Provide a concise summary of the change or decision.
- Include verification commands and their results.
- State assumptions, limitations, risks, and follow-up work when applicable.

## Verification

- Verify correctness, edge cases, compatibility, security, performance, and operational impact relevant to the task.
- If verification cannot be completed, explain why and do not claim success.

## Example

Input: A task that requires tailwind css.
Expected: Apply the procedure and constraints, produce evidence, and respond to the user in natural Thai when the user communicates in Thai.

## Guidance

# Tailwind CSS

- ใช้ utility classes ตาม design tokens ที่มีอยู่ก่อนสร้างค่าเฉพาะกิจ
- รักษา responsive behavior ตั้งแต่ mobile ขึ้นไป
- ตรวจสอบ contrast, focus state และ keyboard navigation ของ interactive elements

## Maintainability และ UX Debt

- ใช้ design token และ component boundary ที่สอดคล้องกัน เพื่อไม่ให้เกิดค่าระยะห่าง สี หรือ breakpoint กระจัดกระจาย
- ตรวจ computed style, specificity, bundle impact และ duplication เมื่อ class list ยาวหรือซับซ้อนผิดปกติ
- พิจารณา responsive state, content overflow, zoom, reduced motion, dark mode และภาษา/ข้อความที่ยาวขึ้น
- UI ที่ดูถูกต้องในกรณีปกติต้องยังใช้งานได้เมื่อ loading, error, empty, disabled และ keyboard-only
- ถ้าต้องใช้ค่าเฉพาะกิจ ให้บันทึกเหตุผลและพิจารณาว่าควรยกระดับเป็น token หรือ component ในอนาคตหรือไม่
