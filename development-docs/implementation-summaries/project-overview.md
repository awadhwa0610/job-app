# Job-App (Resume Builder) – Project Instructions

## Purpose
- Single-page resume builder: edit structured resume data, live-preview as PDF, and download a generated PDF.
- Built with React + TypeScript + Vite; styled via Tailwind classes and custom CSS.

## Getting Started
- Install: `npm install`
- Dev: `npm run dev` (Vite)
- Build: `npm run build`
- Preview build: `npm run preview`
- Node: use LTS (tested on macOS, npm 10+)

## Key Dependencies (pinned for stability)
- `react` / `react-dom` 18.2.0 (compatible with `@react-pdf/renderer`)
- `@react-pdf/renderer` 4.3.1 (PDF rendering & download)
- `react-quill-new` 3.6.0 (rich text editor)
- `html-react-parser` 5.2.10 (HTML → PDF-safe React elements)
- `lucide-react` (icons)

## Project Structure (src)
- `main.tsx` — app bootstrap, StrictMode render.
- `App.tsx` — page shell; holds resume state, image upload, preview toggle, debounced PDF download generation, and live PDF preview.
- `components/`
  - `ResumeEditor.tsx` — form + rich text editors for personal details, education, experience, accomplishments, skills; handles add/remove items and uploads.
  - `ResumePDF.tsx` — PDF layout built with `@react-pdf/renderer` components (`Document/Page/View/Text/Image`); renders sidebar info, summary, accomplishments, experience, skills; supports optional profile image.
  - `HtmlPdf.tsx` — parses stored HTML (from Quill) into PDF-safe components; handles lists, formatting tags, breaks, and guards against raw strings.
  - `ErrorBoundary.tsx` — class-based boundary with fallback UI and reset button.
  - `HtmlPdf.tsx` — HTML → PDF adapter (see above).
- `types.ts` — type definitions and `initialResumeData`.
- `App.css`, `index.css`, `tailwind.config.js`, `postcss.config.js` — styling and Tailwind setup.

## Data Model (from `types.ts`)
- `ResumeData` contains:
  - `personalDetails`: `fullName`, `title`, `email`, `phone`, `location`, `website`, `summary` (HTML string)
  - `education[]`: `id`, `school`, `degree`, `year`, `location`
  - `experience[]`: `id`, `company`, `role`, `date`, `location`, `description` (HTML string)
  - `accomplishments` (HTML), `skills` (HTML)
- `initialResumeData` seeds the form and preview.

## Runtime Flow
1) User edits fields in `ResumeEditor` (rich text via Quill).  
2) `App` stores live `resumeData` and `profileImage` (data URL).  
3) PDF Preview: `PDFViewer` renders `ResumePDF` from live state (re-renders on every change via `pdfKey`).  
4) Download: `usePDF` receives a debounced document (500ms) to avoid heavy work on every keystroke; `instance.url` is bound to the download link.  
5) Image upload: file → FileReader → data URL → stored in state → passed to `ResumePDF` for sidebar display and download.

## Live Preview vs Download
- Preview uses live state (`resumeData`, `profileImage`) for immediate updates.
- Download uses debounced state (`debouncedResumeData`, `debouncedProfileImage`) for stability; link text shows “Generating...” while `instance.loading` is true.

## Styling & Layout
- Sidebar (30% width) on PDF: dark background, contact info, education, personal details.
- Main area (70%): name header, summary, accomplishments, work history, skills. Uses Helvetica (built-in) to avoid remote font loading.
- Buttons use Tailwind utility classes; mobile toggle for preview/editor via `showPreview`.

## Troubleshooting
- White screen / `TypeError: Eo is not a function` in `@react-pdf_renderer.js`: ensure React is 18.2.0 with matching `react-dom` (already pinned). Reinstall deps if this reappears.
- If PDF preview is blank: check console for PDF render errors; ensure `resumeData` and `profileImage` are non-null; verify Vite dev server restarted after dependency changes.
- Large bundle warning during build is expected from Vite; consider code-splitting if needed.

## Potential Enhancements
- Add persistence (localStorage) for resume data.
- Add validation and UX hints for required fields.
- Provide theme options and font choices (with proper font registration in `@react-pdf/renderer`).
- Add unit tests for HTML parsing and PDF rendering logic.

