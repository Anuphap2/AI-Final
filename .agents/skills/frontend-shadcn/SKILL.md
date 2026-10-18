---
name: frontend-shadcn
description: "Manage, compose, and style accessible components using shadcn/ui and semantic tokens."
---

# shadcn/ui Best Practices

## Contract

Apply this skill only when the task matches: shadcn/ui Best Practices. Keep the work within the requested scope and do not invent missing facts.

## When to Use

Manage, compose, and style accessible components using shadcn/ui and semantic tokens.

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

Input: A task that requires shadcn/ui best practices.
Expected: Apply the procedure and constraints, produce evidence, and respond to the user in natural Thai when the user communicates in Thai.

## Guidance

# shadcn/ui Best Practices

หลักการใช้และ Compose ส่วนประกอบ UI ด้วย shadcn/ui และ Tailwind CSS อย่างถูกต้องตามหลักสถาปัตยกรรม

## 1. Core Principles
- **Compose, Don't Reinvent:** ประกอบ UI จาก Primitives ที่มีอยู่ (เช่น Settings page = Tabs + Card + FieldGroup)
- **Semantic Color Tokens:** ใช้โทนสีความหมายเสมอ (`bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`) ห้าม Hardcode สี เช่น `bg-blue-500`
- **ห้ามใส่ manual `dark:` overrides:** ให้ปล่อยให้ระบบ Semantic Tokens สลับธีมผ่าน CSS Variables อัตโนมัติ

## 2. Tailwind & Layout Rules
- **ห้ามใช้ `space-x-*` หรือ `space-y-*`:** ให้ใช้ `flex` คู่กับ `gap-*` เสมอ (สำหรับแนวตั้งใช้ `flex flex-col gap-*`)
- **ใช้ `size-*` shorthand:** เมื่อความกว้างและความสูงเท่ากัน เช่น `size-10` แทน `w-10 h-10`
- **ใช้ `truncate` shorthand:** แทนการเขียน `overflow-hidden text-ellipsis whitespace-nowrap` ยาวๆ
- **ใช้ `cn()` สำหรับเงื่อนไข:** ใช้ utility function `cn()` เสมอ ห้ามต่อ string ด้วย ternary template literal
- **Dialog, Sheet, Drawer ต้องมี Title เสมอ:** เพื่อการเข้าถึง (Accessibility) หากไม่ต้องการแสดงให้ใช้ `className="sr-only"`
- **Form Composition:** ใช้ `FieldGroup` และ `Field` ควบคู่กับ `data-invalid` และ `aria-invalid`
