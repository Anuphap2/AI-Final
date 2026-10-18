---
name: frontend-nextjs-app-router
description: "Implement or review Next.js App Router components, routing, and server/client boundaries."
---

# Next.js App Router

## Contract

Apply this skill only when the task matches: Next.js App Router. Keep the work within the requested scope and do not invent missing facts.

## When to Use

Implement or review Next.js App Router components, routing, and server/client boundaries.

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

Input: A task that requires next.js app router.
Expected: Apply the procedure and constraints, produce evidence, and respond to the user in natural Thai when the user communicates in Thai.

## Guidance

# Next.js App Router

- ใช้ Server Components เป็นค่าเริ่มต้น และเพิ่ม `use client` เฉพาะ component ที่ต้องใช้ browser state หรือ event
- แยก loading, error และ not-found states สำหรับ route ที่ทำ data fetching
- รักษา data fetching และ mutation ให้สอดคล้องกับ caching/revalidation strategy ของโปรเจกต์

## Engineering Reasoning: Architecture และ Performance

- กำหนด ownership ของ state, data fetching และ mutation ให้ชัดระหว่าง Server/Client boundary
- วิเคราะห์ cache key, freshness, invalidation และ race condition เพื่อป้องกัน stale หรือ inconsistent UI
- พิจารณา latency, waterfall request, bundle size, hydration cost และจำนวน re-render ใน critical path
- ออกแบบ loading, error และ retry behavior ให้ไม่ทำให้ state สูญหายหรือเกิด duplicate mutation
- รักษา URL, API contract และ behavior เดิมเมื่อทำ refactor เพื่อไม่สร้าง migration debt ให้ผู้ใช้
- เพิ่ม client-side abstraction เท่าที่จำเป็น และอย่าใช้ global state เพื่อแก้ปัญหาที่เป็น local state
