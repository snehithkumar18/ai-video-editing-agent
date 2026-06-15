<USER_REQUEST>
You are a senior full-stack engineer doing a complete production readiness audit 
of this codebase. This is an AI-powered video editing SaaS platform built with 
Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Supabase, BullMQ, Remotion, 
and various AI APIs.

---

PART 1 — SCAN THE ENTIRE CODEBASE FIRST

Before doing anything else, scan every single file and folder in this project.
Read every file. Do not skip any file. Check:
- Does the file exist
- Does it have real implementation or just placeholder/empty content
- Are all imports resolvable
- Are there any TypeScript errors visible
- Are all functions actually implemented (not just stubbed with TODO)

---

PART 2 — PRODUCTION READINESS CHECKLIST

After scanning, go through this complete checklist and for each item mark it as:
✅ DONE — fully implemented and working
⚠️ PARTIAL — exists but incomplete or has issues
❌ MISSING — does not exist at all
🔴 BROKEN — exists but has clear errors

---

CHECKLIST — go through every single item:

FOUNDATION
[ ] Next.js 14 App Router project initialized with TypeScript
[ ] Tailwind CSS configured with custom color variables
[ ] shadcn/ui initialized and components installed
[ ] .env.local file exists with all required keys listed
[ ] next.config.ts configured with image domains and body size limit
[ ] middleware.ts exists and handles auth redirects correctly
[ ] All npm packages from package.json are installed

FOLDER STRUCTURE — check every folder exists:
[ ] src/app/(auth)/login/page.tsx
[ ] src/app/(auth)/signup/page.tsx
[ ] src/app/(auth)/layout.tsx
[ ] src/app/(dashboard)/layout.tsx
[ ] src/app/(dashboard)/dashboard/page.tsx
[ ] src/app/(dashboard)/projects/page.tsx
[ ] src/app/(dashboard)/projects/[id]/page.tsx
[ ] src/app/(dashboard)/projects/[id]/edit/page.tsx
[ ] src/app/(dashboard)/projects/[id]/edit/layout.tsx
[ ] src/app/(dashboard)/voice/page.tsx
[ ] src/app/(dashboard)/avatars/page.tsx
[ ] src/app/(dashboard)/settings/page.tsx
[ ] src/app/(dashboard)/billing/page.tsx

<truncated 6146 bytes>
with the specific error or problem]

---

### CRITICAL PATH — DO THESE FIRST
[list the 5-10 most important missing or broken items that would completely block the app from working at all — ordered by priority]

---

### WHAT TO BUILD NEXT
[Give me a numbered list of exactly what to do next, in priority order, to get this app to production. For each item write 2-3 sentences explaining what needs to happen. Start from the most critical blocking issues.]

---

### FILES THAT NEED TO BE CREATED FROM SCRATCH
[List every missing file with its exact path and a one-sentence description of what it needs to do]

---

### FILES THAT NEED TO BE FIXED
[List every partial or broken file with its exact path and bullet points of exactly what needs to be changed or added]

---

After giving me this full report, ask me:

"Which of these items have you already completed manually or through other tools? 
Tell me the numbers from the MISSING and BROKEN lists and I will skip those 
and focus only on what still needs to be built."

Wait for my response before doing anything else.
Do not start building anything yet.
Just audit and report.
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-06-15T14:36:08+05:30.

The user's current state is as follows:
Active Document: c:\Users\NEHITH\Documents\Ai-video-editing-agent\.env.example (LANGUAGE_UNSPECIFIED)
Cursor is on line: 29
Other open documents:
- c:\Users\NEHITH\Documents\Ai-video-editing-agent\.env.example (LANGUAGE_UNSPECIFIED)
- c:\Users\NEHITH\Documents\Ai-video-editing-agent\src\app\api\video\generate\route.ts (LANGUAGE_TYPESCRIPT)
- c:\Users\NEHITH\Documents\Ai-video-editing-agent\src\lib\queue\videoQueue.ts (LANGUAGE_TYPESCRIPT)
</ADDITIONAL_METADATA>
<USER_SETTINGS_CHANGE>
The user changed setting `Model Selection` from Gemini 3.5 Flash (High) to Claude Opus 4.6 (Thinking). No need to comment on this change if the user doesn't ask about it. If reporting what model you are, please use a human readable name instead of the exact string.
</USER_SETTINGS_CHANGE>