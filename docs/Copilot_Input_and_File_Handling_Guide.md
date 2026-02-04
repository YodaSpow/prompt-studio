# M365 Copilot Chat Input + File Handling Guide

Focused on prompt size, transcript uploads, supported file types, and SharePoint limitations.

## 1. Prompt Size Limits (Text Typed Directly Into Chat)

You can safely enter up to ~3,000-4,000 characters directly as a prompt.
This is ideal for instructions, queries, or guidance related to an uploaded file.
If you need more than ~4k characters, break the prompt into smaller blocks.

- Fully supported by this chat
- Processed instantly
- Best for instructions and framing

## 2. Large Transcript Files (56,000-78,000 Characters)

These cannot be pasted as a single prompt due to length, but they can be fully processed when sent as an uploaded file.

### Supported file types for long transcripts

You can upload:

- `.docx` - Word document
- `.txt` - Plain text
- `.vtt` - Subtitle/transcript format
- `.pdf` - If it contains selectable text (not scans)

Once uploaded, the full 56k-78k characters can be processed.

Suitable use cases:

- Long interviews
- Meeting transcripts
- Conversation logs
- Call centre transcripts
- Video subtitle exports

## 3. SharePoint / OneDrive Links (Important Limitation)

This chat cannot open SharePoint links directly.

- It cannot access files behind authentication
- It cannot fetch content from a URL
- It cannot read a file unless you upload it directly

What does work:

- Download the file from SharePoint
- Upload that file into the chat

This allows full reading of 56k-78k character files.

## 4. How to Use a Long Transcript + Prompt (Working Method)

A simple, repeatable workflow:

### Step-by-step

1. Prepare your prompt (3,000-4,000 characters max).
   Include:
- What you want
- How to interpret the transcript
- Any rules or structure to apply
- Required output format (summary, extraction, analysis, rewrite, etc.)

2. Upload the transcript file.
   Attach `.docx`, `.txt`, `.vtt`, or `.pdf` (~56k-78k characters).

3. Reference your prompt after uploading.
   Example: `Use the previous instructions with the uploaded file.`

4. Generate output.
   The response combines your prompt, the full transcript, and your processing rules.

5. Iterate (optional).
   Use short refinement prompts such as:
- `Regenerate in bullet points.`
- `Extract only decisions and actions.`
- `Rewrite in formal tone.`
- `Condense to 500 words.`

You do not need to re-upload the file for each follow-up.

## 5. Summary Statement

Can you use a 56,000-character SharePoint document as a prompt?

Yes, but only if you upload the file or paste the content.
A SharePoint link cannot be read directly due to permission/security boundaries.
