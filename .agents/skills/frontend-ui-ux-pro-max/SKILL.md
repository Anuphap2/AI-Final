---
name: frontend-ui-ux-pro-max
description: "Generate tailored design systems, UI styles, palettes, and typography using UI/UX Pro Max intelligence."
---

# UI/UX Pro Max

## Contract

Apply this skill only when the task matches: UI/UX Pro Max. Keep the work within the requested scope and do not invent missing facts.

## When to Use

Generate tailored design systems, UI styles, palettes, and typography using UI/UX Pro Max intelligence.

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

Input: A task that requires ui/ux pro max.
Expected: Apply the procedure and constraints, produce evidence, and respond to the user in natural Thai when the user communicates in Thai.

## Guidance

# UI/UX Pro Max

ใช้ระบบ Design Intelligence จาก UI/UX Pro Max (79 UI styles, 192 color palettes, 74 font pairings, 119 UX guidelines) ในการสร้าง Design System ที่ตรงกับอุตสาหกรรม

## 1. วิธีสืบค้นและสร้าง Design System

รันสคริปต์ค้นหา BM25 ได้โดยตรงผ่าน Python:
```bash
python ~/.agents/skills/ui-ux-pro-max/scripts/search.py "<product_type> <keywords>" --design-system
```

ตัวอย่าง:
```bash
python ~/.agents/skills/ui-ux-pro-max/scripts/search.py "saas dashboard analytics" --design-system
```

## 2. การปรับแต่งด้วย Design Dials (1-10)

- `--variance <1-10>`: 1 = เรียบง่ายกึ่งกลาง (Minimalism), 10 = โดดเด่นอสมมาตร (Brutalism, Bento Grid)
- `--motion <1-10>`: 1 = ละมุนเรียบง่าย, 10 = ซับซ้อน choreographed (แนบ GSAP snippet)
- `--density <1-10>`: 1 = โปร่งสบาย (Marketing), 10 = แน่นกระชับ (Dashboard/Data)

## 3. Master + Overrides Architecture

- บันทึก Master System ไว้ที่ `design-system/<slug>/MASTER.md` ด้วยแฟล็ก `--persist -p "<ProjectName>"`
- หน้าที่ต้องการความแตกต่างให้สร้าง override ใน `design-system/<slug>/pages/<page>.md`
- หน้า Override มีสิทธิ์เขียนทับเฉพาะกฎที่ระบุ ส่วนที่เหลือสืบทอดจาก Master

## 4. Pre-Delivery Checklist
- [ ] ไม่มี Emoji เป็นไอคอน (ใช้ SVG: Lucide/Heroicons/Radix)
- [ ] มี `cursor-pointer` บนองค์ประกอบที่คลิกได้ทั้งหมด
- [ ] Hover states ลื่นไหล (150-300ms)
- [ ] Text contrast ขั้นต่ำ 4.5:1
- [ ] Focus states ชัดเจนสำหรับ Keyboard Navigation
- [ ] รองรับ Breakpoints: 375px, 768px, 1024px, 1440px
