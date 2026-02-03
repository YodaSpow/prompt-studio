# Prompt Studio

Build structured Copilot prompts from real transcripts. Curate reusable prompt cards, scope them to projects, and merge Teams call transcripts into a Core prompt with one click.

Live site: https://yodaspow.github.io/prompt-studio/

## Features
- Prompt card templates with placeholder inputs (project name, scope, title, resources, etc.)
- VTT upload with optional timestamp inclusion and cleaned transcript output
- Speaker detection and meeting duration summary (from VTT)
- Optional sections auto-removed when empty (Complexity Levels, Links, Dynamic Content Examples)
- Line-count meter for Copilot limits with warning state
- Local-only: runs entirely in the browser

## How To Use
1. Open the site.
2. Select a prompt card (SOP template by default).
3. Fill in placeholder fields for your project.
4. Upload a `.vtt` file (preferred) or paste transcript text.
5. Click **Build Core Prompt** and **COPY** to use in Copilot.

## Development
This is a static site (HTML/CSS/JS). Open `index.html` locally, or deploy via GitHub Pages.

## License
Private/internal use unless stated otherwise.
