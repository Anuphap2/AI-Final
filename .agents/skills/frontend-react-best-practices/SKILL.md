---
name: frontend-react-best-practices
description: "Eliminate waterfalls, optimize re-renders, and streamline bundles using Vercel React best practices."
---

# React Best Practices & Performance

## Contract

Apply this skill only when the task matches: React Best Practices & Performance. Keep the work within the requested scope and do not invent missing facts.

## When to Use

Eliminate waterfalls, optimize re-renders, and streamline bundles using Vercel React best practices.

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

Input: A task that requires react best practices & performance.
Expected: Apply the procedure and constraints, produce evidence, and respond to the user in natural Thai when the user communicates in Thai.

## Guidance

# React Best Practices & Performance

แนวทางการเขียนและปรับแต่งประสิทธิภาพ React และ Next.js ตามมาตรฐานวิศวกรรมของ Vercel

## 1. Eliminating Waterfalls (CRITICAL)
- ดึงข้อมูลคู่ขนานด้วย `Promise.all()` สำหรับการดึงข้อมูลที่ไม่ขึ้นต่อกัน
- ขยับ `await` เข้าไปไว้เฉพาะใน branch ที่ต้องใช้งานจริง ห้าม await ล่วงหน้าก่อนตรวจเงื่อนไข synchronous
- ใช้ React Suspense เพื่อทำ Streaming SSR แทนการรอโหลดข้อมูลพร้อมกันทั้งหน้า

## 2. Re-render Optimization
- ไม่ subscribe state ที่ใช้เฉพาะใน callback หรือ event handler
- สกัด computation หนักๆ เป็น memoized component
- คำนวณ Derived state ในระหว่าง render โดยตรง ห้ามใช้ `useEffect` เพื่อ sync state
- ใช้ `startTransition` หรือ `useDeferredValue` สำหรับการอัปเดตที่ไม่เร่งด่วนเพื่อรักษาความลื่นไหลของ UI

## 3. Bundle Size & Server Performance
- นำเข้าโมดูลโดยตรง หลีกเลี่ยง Barrel files ขนาดยักษ์
- ใช้ Dynamic imports (`next/dynamic` หรือ `React.lazy`) สำหรับ Component ขนาดใหญ่
- ลดขนาดข้อมูล props ที่ส่งจาก Server Components ไปยัง Client Components
