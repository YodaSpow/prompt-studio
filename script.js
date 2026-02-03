const defaultCards = [
  {
    id: "sop-template",
    name: "SOP Template",
    template: `# Role
Act as a world-class executive assistant to a CEO, specialising in converting process walkthrough transcripts into clear internal Standard Operating Procedures (SOPs).

# Task
Your job is to take a transcript of a walkthrough/training video that outlines a business process and convert it into a clear, structured SOP.

The transcript may reference different levels of process complexity. If complexity levels are provided in the Inputs, you must use them as definitions in the SOP. If they are not provided, do not invent them.

# Objective
Produce a professional, structured SOP suitable for internal operational documentation that:
- reflects what is actually described in the transcript
- is easy to follow step-by-step
- includes checklists and handoffs only where supported
- flags uncertainty instead of guessing

# Context
## Source Material
{{SOURCE_MATERIAL_NAME}}

## Expected SOP Title
SOP: {{DOC_TITLE}}

## Campaign / Process Purpose
{{PROCESS_PURPOSE}}

## Complexity Levels (optional)
If provided, include these definitions in the SOP.
If not provided, omit this section entirely.
{{COMPLEXITY_LEVELS}}

## Links (optional)
If provided, include as useful links in the SOP (and/or Appendix).
{{LINKS}}

## Personalisation / Dynamic Content Example(s) (optional)
If provided, include in Appendix as examples only (unless the transcript explicitly instructs to use them in the procedure).
{{DYNAMIC_CONTENT_EXAMPLES}}

## Required Resources / Tools
Use ONLY the items listed below plus anything explicitly mentioned in the transcript.
{{REQUIRED_RESOURCES}}

# Table of Contents Requirements
Produce a structured Table of Contents that includes at minimum:
- Purpose
- Scope (In / Out)
- Required Inputs / Resources
- Procedure (multi-phase) with sub-steps
- Approvals & Handoffs (if supported)
- Technical setup (if supported)
- Testing & QA
- Deployment / Release
- Post-deployment checks
- Documentation / Artefacts to save
- Appendix / Glossary / Acronyms / Useful references

## Procedure backbone (required)
The Procedure section must use the following stages as the default backbone, adapting sub-steps to match the transcript:

Step 1: Planning & Briefing
Step 2: Creative Development
Step 3: Build / Implementation (or Campaign Development)
Step 4: Testing & QA
Step 5: Deployment / Release

If the transcript uses a different structure, you may rename the stage labels to match the transcript, but you must keep the 5-stage backbone intact and map the transcript steps into it.

# Instructions
Based on the transcript:
- Carefully read and process the entire transcript before producing any output.
- Do not skip or ignore sections.
- Take the time needed to understand the full workflow, context, and nuances described.
- Produce a clear, step-by-step SOP with numbered steps and sub-steps.
- Include:
  - Title
  - Purpose
  - Scope (In / Out)
  - Required tools/resources
  - Sequential procedural steps
  - Sub-steps where appropriate
- Indicate where screenshots would be helpful by inserting:
  📸 Screenshot: <what to capture>
- Add a final section for Appendix / Glossary / Useful Docs / Acronyms.
- Ensure tone is professional and suitable for internal operational documentation.
- Do not invent tools, systems, or steps that are not supported by the transcript or the provided context.

# Handling gaps / uncertainty (mandatory)
If the transcript does not specify an important detail (owner, approval step, location, naming convention, etc.), do NOT guess.
Instead:
- mark the relevant line with: (Transcript unclear — needs confirmation)
- add the item into a final "Open Questions" section.

# Output Format (mandatory)
Return ONE document in this exact order:

1) SOP Title
2) Table of Contents
3) SOP Body (must follow the same structure as the Table of Contents)
4) Open Questions (only if any exist)
5) Appendix
   - Glossary / Acronyms
   - Useful Docs / Links
   - Examples (only if provided or transcript-supported)

# Project Scope
{{PROJECT_NAME}}
{{PROJECT_SCOPE}}

# Transcript Input
{{TRANSCRIPT}}
`,
  },
];

const storageKey = "promptStudio.cards";
const state = {
  cards: [],
  selectedId: null,
};

const cardSelect = document.getElementById("cardSelect");
const templateInput = document.getElementById("templateInput");
const transcriptInput = document.getElementById("transcriptInput");
const projectNameInput = document.getElementById("projectName");
const projectScopeInput = document.getElementById("projectScope");
const sopTitleInput = document.getElementById("sopTitle");
const processPurposeInput = document.getElementById("processPurpose");
const sourceMaterialInput = document.getElementById("sourceMaterial");
const requiredResourcesInput = document.getElementById("requiredResources");
const complexityLevelsInput = document.getElementById("complexityLevels");
const linkList = document.getElementById("linkList");
const addLinkBlockBtn = document.getElementById("addLinkBlock");
const dynamicExampleList = document.getElementById("dynamicExampleList");
const addDynamicExampleBtn = document.getElementById("addDynamicExample");
const output = document.getElementById("output");
const speakerList = document.getElementById("speakerList");
const speakerEmpty = document.getElementById("speakerEmpty");
const speakerMeta = document.getElementById("speakerMeta");
const lineMeter = document.getElementById("lineMeter");
const lineCount = document.getElementById("lineCount");
const lineBar = document.getElementById("lineBar");
const lineNote = document.getElementById("lineNote");
const copyStatus = document.getElementById("copyStatus");

const newCardBtn = document.getElementById("newCardBtn");
const saveCardBtn = document.getElementById("saveCardBtn");
const deleteCardBtn = document.getElementById("deleteCardBtn");
const buildBtn = document.getElementById("buildBtn");
const copyBtnTop = document.getElementById("copyBtnTop");
copyBtnTop.textContent = "COPY";

const cardDialog = document.getElementById("cardDialog");
const cardNameInput = document.getElementById("cardNameInput");

const vttInput = document.getElementById("vttInput");
const livePreviewToggle = document.getElementById("livePreviewToggle");
const editTemplateToggle = document.getElementById("editTemplateToggle");
const timestampToggle = document.getElementById("timestampToggle");
const transcriptPanel = document.getElementById("transcriptPanel");
const toggleTranscript = document.getElementById("toggleTranscript");
const complexityPanel = document.getElementById("complexityPanel");
const toggleComplexity = document.getElementById("toggleComplexity");

let lastVttRaw = "";
let lastVttParsed = "";

function loadCards() {
  const stored = localStorage.getItem(storageKey);
  if (!stored) {
    state.cards = [...defaultCards];
    return;
  }
  try {
    const parsed = JSON.parse(stored);
    state.cards = Array.isArray(parsed) && parsed.length ? parsed : [...defaultCards];
  } catch (error) {
    state.cards = [...defaultCards];
  }
}

function ensureCards() {
  if (!state.cards.length) {
    state.cards = [...defaultCards];
    persistCards();
  }
}

function ensureDefaultCard() {
  const hasDefault = state.cards.some((card) => card.id === "sop-template");
  if (!hasDefault) {
    state.cards.unshift(defaultCards[0]);
    persistCards();
  }
}

function persistCards() {
  localStorage.setItem(storageKey, JSON.stringify(state.cards));
}

function refreshSelect() {
  cardSelect.innerHTML = "";
  if (!state.cards.length) return;
  state.cards.forEach((card) => {
    const option = document.createElement("option");
    option.value = card.id;
    option.textContent = card.name;
    cardSelect.appendChild(option);
  });
  if (!state.selectedId && state.cards.length) {
    state.selectedId = state.cards[0].id;
  }
  if (!state.cards.some((card) => card.id === state.selectedId)) {
    state.selectedId = state.cards[0].id;
  }
  cardSelect.value = state.selectedId || "";
}

function setTemplateFromSelection() {
  const card = state.cards.find((item) => item.id === cardSelect.value);
  if (!card) return;
  state.selectedId = card.id;
  templateInput.value = card.template;
}

function createCard(name) {
  const id = `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
  const card = {
    id,
    name,
    template: `# Role\n## Act as a world class assistant.\n\n# Task\n## Describe the task for {{PROJECT_NAME}} in {{PROJECT_SCOPE}}.\n\n# Transcript Input\n{{TRANSCRIPT}}\n`,
  };
  state.cards.unshift(card);
  state.selectedId = id;
  persistCards();
  refreshSelect();
  setTemplateFromSelection();
}

function saveCard() {
  const card = state.cards.find((item) => item.id === state.selectedId);
  if (!card) return;
  card.template = templateInput.value;
  persistCards();
}

function deleteCard() {
  if (state.cards.length === 1) return;
  const index = state.cards.findIndex((item) => item.id === state.selectedId);
  if (index === -1) return;
  state.cards.splice(index, 1);
  state.selectedId = state.cards[0]?.id || null;
  persistCards();
  refreshSelect();
  setTemplateFromSelection();
}

function getPromptText() {
  const template = templateInput.value || "";
  const projectName = projectNameInput.value.trim();
  const projectScope = projectScopeInput.value.trim();
  const transcript = transcriptInput.value.trim();
  const sopTitle = sopTitleInput.value.trim();
  const processPurpose = processPurposeInput.value.trim();
  const sourceMaterial = sourceMaterialInput.value.trim();
  const requiredResources = requiredResourcesInput.value.trim();
  const complexityLevels = complexityLevelsInput.value.trim();
  const formattedDynamicExamples = formatDynamicExamples("[DYNAMIC CONTENT EXAMPLES]");
  const formattedLinks = formatLinks("[LINKS]");

  let result = template
    .replace(/{{PROJECT_NAME}}/g, projectName || "[PROJECT NAME]")
    .replace(/{{PROJECT_SCOPE}}/g, projectScope || "[PROJECT SCOPE]")
    .replace(/{{DOC_TITLE}}/g, sopTitle || "[DOC TITLE]")
    .replace(/{{PROCESS_PURPOSE}}/g, processPurpose || "[PROCESS PURPOSE]")
    .replace(/{{SOURCE_MATERIAL_NAME}}/g, sourceMaterial || "[SOURCE MATERIAL NAME]")
    .replace(/{{REQUIRED_RESOURCES}}/g, requiredResources || "[REQUIRED RESOURCES]")
    .replace(/{{COMPLEXITY_LEVELS}}/g, complexityLevels || "[COMPLEXITY LEVELS]")
    .replace(/{{LINKS}}/g, formattedLinks)
    .replace(/{{DYNAMIC_CONTENT_EXAMPLES}}/g, formattedDynamicExamples);

  if (!complexityLevels) {
    result = removeSection(result, "Complexity Levels (optional)");
  }
  if (!hasLinkContent()) {
    result = removeSection(result, "Links (optional)");
  }
  if (!hasDynamicContent()) {
    result = removeSection(result, "Personalisation / Dynamic Content Example(s) (optional)");
  }

  if (result.includes("{{TRANSCRIPT}}")) {
    result = result.replace(/{{TRANSCRIPT}}/g, transcript || "[PASTE TRANSCRIPT HERE]");
  } else if (transcript) {
    result = `${result}\n\n# Transcript Input\n${transcript}`;
  }

  return result.trim();
}

function removeSection(text, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`## ${escaped}[\\s\\S]*?(?:\\n\\n|$)`, "g");
  return text.replace(pattern, "");
}

function buildPrompt() {
  const text = getPromptText();
  output.textContent = text;
  updateLineMeter(text);
  updateCopyState();
}

function updateLivePreview() {
  if (!livePreviewToggle.checked) return;
  buildPrompt();
}


function copyPrompt() {
  if (copyBtnTop.disabled) return;
  const text = output.textContent.trim();
  if (!text) return;
  navigator.clipboard.writeText(text);
}

function parseVtt(text, includeTimestamps = false) {
  const lines = text
    .replace(/WEBVTT[\s\S]*?\n\n/i, "")
    .split(/\r?\n/)
    .filter((line) => !/^\s*$/.test(line))
    .filter((line) => !/^[a-f0-9-]+\/\d+-\d+$/i.test(line))
    .filter((line) => !/^[a-f0-9-]{8,}$/i.test(line))
    .filter((line) => (includeTimestamps ? true : !/\d{2}:\d{2}:\d{2}\.\d{3} -->/.test(line)))
    .filter((line) => !/^[0-9]+$/.test(line));

  const output = [];
  let currentSpeaker = null;
  let pendingTimestamp = null;

  lines.forEach((line) => {
    const timestampMatch = line.match(/(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})/);
    if (timestampMatch) {
      pendingTimestamp = `${timestampMatch[1]} --> ${timestampMatch[2]}`;
      return;
    }

    const speakerMatch = line.match(/<v\s+([^>]+)>/i);
    let speaker = null;
    let textLine = line;

    if (speakerMatch) {
      speaker = speakerMatch[1].trim();
      textLine = line.replace(/<v\s+[^>]+>/gi, "").replace(/<\/v>/gi, "");
    }

    textLine = textLine.replace(/<[^>]+>/g, "").trim();
    if (!textLine) return;

    if (speaker) {
      if (speaker !== currentSpeaker) {
        if (output.length) output.push("");
        if (includeTimestamps && pendingTimestamp) {
          output.push(pendingTimestamp);
        }
        output.push(`${speaker}: ${textLine}`);
        currentSpeaker = speaker;
      } else {
        output.push(textLine);
      }
    } else {
      output.push(textLine);
    }
    pendingTimestamp = null;
  });

  return output.join("\n").trim();
}

function formatAsCodeBlock(text, placeholder) {
  if (!text) return placeholder;
  if (/```/.test(text)) return text;
  return `\`\`\`\n${text}\n\`\`\``;
}

function extractSpeakers(text) {
  const speakers = new Set();
  const regex = /<v\s+([^>]+)>/gi;
  let match = regex.exec(text);
  while (match) {
    speakers.add(match[1].trim());
    match = regex.exec(text);
  }
  return Array.from(speakers).sort((a, b) => a.localeCompare(b));
}

function renderSpeakers(names) {
  speakerList.innerHTML = "";
  if (!names.length) {
    speakerList.appendChild(speakerEmpty);
    return;
  }
  names.forEach((name) => {
    const chip = document.createElement("span");
    chip.className = "speaker-chip";
    chip.textContent = name;
    speakerList.appendChild(chip);
  });
}

function extractDuration(text) {
  const matches = text.match(/\d{2}:\d{2}:\d{2}\.\d{3} --> (\d{2}:\d{2}:\d{2}\.\d{3})/g);
  if (!matches || !matches.length) return null;
  let maxSeconds = 0;
  matches.forEach((match) => {
    const end = match.split(" --> ")[1];
    const parts = end.split(":");
    const seconds = parseFloat(parts[2]);
    const total =
      parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60 + seconds;
    if (total > maxSeconds) maxSeconds = total;
  });
  if (!maxSeconds) return null;
  const hours = Math.floor(maxSeconds / 3600);
  const minutes = Math.floor((maxSeconds % 3600) / 60);
  const seconds = Math.round(maxSeconds % 60);
  const parts = [];
  if (hours) parts.push(`${hours} hour${hours === 1 ? "" : "s"}`);
  if (minutes) parts.push(`${minutes} min${minutes === 1 ? "" : "s"}`);
  parts.push(`${seconds} sec${seconds === 1 ? "" : "s"}`);
  return parts.join(" ");
}

function renderDuration(text) {
  const duration = extractDuration(text);
  const speakerCount = speakerList.querySelectorAll(".speaker-chip").length;
  const parts = [];
  if (speakerCount) parts.push(`Speakers: ${speakerCount}`);
  if (duration) parts.push(`Duration: ${duration}`);
  speakerMeta.textContent = parts.join(" \u2022 ");
}

function updateLineMeter(text) {
  const maxLines = 10000;
  const trimmed = text.trim();
  const lines = trimmed ? trimmed.split(/\r?\n/).length : 0;
  const percent = Math.min((lines / maxLines) * 100, 100);
  lineCount.textContent = `${lines.toLocaleString()} / 10,000 lines`;
  lineBar.style.width = `${percent}%`;
  if (lines >= maxLines) {
    lineMeter.classList.add("line-meter--bad");
    lineNote.textContent =
      "Copilot is likely to choke beyond 10,000 lines. Consider using ChatGPT.";
  } else {
    lineMeter.classList.remove("line-meter--bad");
    lineNote.textContent = "";
  }
}

function updateCopyState() {
  copyBtnTop.textContent = "COPY";
  const hasTranscript = transcriptInput.value.trim().length > 0;
  if (!hasTranscript) {
    copyBtnTop.disabled = true;
    copyBtnTop.classList.add("is-disabled");
    copyBtnTop.classList.add("is-hidden");
    copyStatus.textContent = "Add transcript text or a .vtt file to enable copy.";
    return;
  }
  copyBtnTop.disabled = false;
  copyBtnTop.classList.remove("is-disabled");
  copyBtnTop.classList.remove("is-hidden");
  copyStatus.textContent = "";
}

function handleVttUpload(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const text = typeof reader.result === "string" ? reader.result : "";
    lastVttRaw = text;
    renderSpeakers(extractSpeakers(text));
    renderDuration(text);
    const parsed = parseVtt(text, timestampToggle.checked);
    lastVttParsed = parsed;
    if (!parsed) return;
    const existing = transcriptInput.value.trim();
    transcriptInput.value = existing ? `${existing}\n\n${parsed}` : parsed;
    updateLineMeter(getPromptText());
    updateCopyState();
    updateLivePreview();
  };
  reader.readAsText(file);
}

cardSelect.addEventListener("change", setTemplateFromSelection);
newCardBtn.addEventListener("click", () => {
  cardNameInput.value = "";
  cardDialog.showModal();
});

cardDialog.addEventListener("close", () => {
  if (cardDialog.returnValue !== "create") return;
  const name = cardNameInput.value.trim();
  if (!name) return;
  createCard(name);
});

saveCardBtn.addEventListener("click", saveCard);
deleteCardBtn.addEventListener("click", deleteCard);
buildBtn.addEventListener("click", buildPrompt);
copyBtnTop.addEventListener("click", copyPrompt);

vttInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  handleVttUpload(file);
});

transcriptInput.addEventListener("input", () => {
  renderSpeakers(extractSpeakers(transcriptInput.value));
  updateLineMeter(getPromptText());
  updateCopyState();
  updateLivePreview();
});

[
  templateInput,
  projectNameInput,
  projectScopeInput,
  sopTitleInput,
  processPurposeInput,
  sourceMaterialInput,
  requiredResourcesInput,
  complexityLevelsInput,
].forEach((el) => {
  el.addEventListener("input", () => {
    updateLineMeter(getPromptText());
    updateCopyState();
    updateLivePreview();
  });
});

loadCards();
ensureCards();
ensureDefaultCard();
refreshSelect();
setTemplateFromSelection();
updateLineMeter(getPromptText());
buildPrompt();
updateCopyState();
setTimeout(updateCopyState, 0);

editTemplateToggle.addEventListener("change", () => {
  templateInput.readOnly = !editTemplateToggle.checked;
});

livePreviewToggle.addEventListener("change", () => {
  if (livePreviewToggle.checked) {
    buildPrompt();
  }
});

window.addEventListener("pageshow", () => {
  updateCopyState();
});

toggleTranscript.addEventListener("click", () => {
  const isCollapsed = transcriptPanel.classList.contains("is-collapsed");
  if (isCollapsed) {
    transcriptPanel.classList.remove("is-collapsed");
    toggleTranscript.textContent = "Hide transcript text";
  } else {
    transcriptPanel.classList.add("is-collapsed");
    toggleTranscript.textContent = "Paste transcript text (alternative to .vtt)";
  }
});

toggleComplexity.addEventListener("click", () => {
  const isCollapsed = complexityPanel.classList.contains("is-collapsed");
  if (isCollapsed) {
    complexityPanel.classList.remove("is-collapsed");
    toggleComplexity.textContent = "Hide";
  } else {
    complexityPanel.classList.add("is-collapsed");
    toggleComplexity.textContent = "Show";
  }
});

timestampToggle.addEventListener("change", () => {
  if (!lastVttRaw) return;
  const reparsed = parseVtt(lastVttRaw, timestampToggle.checked);
  if (!reparsed) return;
  const current = transcriptInput.value.trim();
  const idx = current.lastIndexOf(lastVttParsed);
  if (idx !== -1) {
    const updated =
      current.slice(0, idx) +
      reparsed +
      current.slice(idx + lastVttParsed.length);
    transcriptInput.value = updated.trim();
    lastVttParsed = reparsed;
    updateLineMeter(getPromptText());
    updateCopyState();
    updateLivePreview();
  }
});

addDynamicExampleBtn.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  addDynamicExample();
  updateLineMeter(getPromptText());
  updateLivePreview();
});

initLinkBlocks();

addLinkBlockBtn.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  addLinkBlock();
  updateLineMeter(getPromptText());
  updateLivePreview();
});



function addDynamicExample() {
  const card = document.createElement("div");
  card.className = "example-card";

  const header = document.createElement("div");
  header.className = "example-header";

  const labelInput = document.createElement("input");
  labelInput.type = "text";
  labelInput.placeholder = "Optional label";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "ghost remove-btn";
  removeBtn.textContent = "Remove";

  header.appendChild(labelInput);
  header.appendChild(removeBtn);

  const codeInput = document.createElement("textarea");
  codeInput.className = "template-input";
  codeInput.placeholder = "Example or snippet";

  card.appendChild(header);
  card.appendChild(codeInput);
  dynamicExampleList.appendChild(card);

  const onChange = () => {
    updateLineMeter(getPromptText());
    updateLivePreview();
  };

  labelInput.addEventListener("input", onChange);
  codeInput.addEventListener("input", onChange);
  removeBtn.addEventListener("click", () => {
    card.remove();
    updateLineMeter(getPromptText());
    updateLivePreview();
  });
}

function formatDynamicExamples(placeholder) {
  const cards = Array.from(dynamicExampleList.querySelectorAll(".example-card"));
  const blocks = cards
    .map((card) => {
      const label = card.querySelector("input")?.value.trim();
      const code = card.querySelector("textarea")?.value.trim();
      if (!label && !code) return "";
      const formatted = formatAsCodeBlock(code || "", placeholder);
      return label ? `${label}:\n${formatted}` : formatted;
    })
    .filter(Boolean);

  if (!blocks.length) return placeholder;
  return blocks.join("\n\n");
}

function hasDynamicContent() {
  return Array.from(dynamicExampleList.querySelectorAll(".example-card")).some((card) => {
    const label = card.querySelector("input")?.value.trim();
    const code = card.querySelector("textarea")?.value.trim();
    return Boolean(label || code);
  });
}

function initLinkBlocks() {
  linkList.innerHTML = "";
}

function addLinkBlock() {
  const card = document.createElement("div");
  card.className = "example-card";

  const header = document.createElement("div");
  header.className = "example-header";

  const labelInput = document.createElement("input");
  labelInput.type = "text";
  labelInput.placeholder = "Optional label";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "ghost remove-btn";
  removeBtn.dataset.action = "remove-link";
  removeBtn.textContent = "Remove";

  header.appendChild(labelInput);
  header.appendChild(removeBtn);

  const urlInput = document.createElement("input");
  urlInput.type = "text";
  urlInput.placeholder = "https://example.com";

  card.appendChild(header);
  card.appendChild(urlInput);
  linkList.appendChild(card);

  const onChange = () => {
    updateLineMeter(getPromptText());
    updateLivePreview();
  };

  labelInput.addEventListener("input", onChange);
  urlInput.addEventListener("input", onChange);
  removeBtn.addEventListener("click", () => {
    removeLinkCard(card);
  });
}

function formatLinks(placeholder) {
  const cards = Array.from(linkList.querySelectorAll(".example-card"));
  const links = cards
    .map((card) => {
      const inputs = card.querySelectorAll("input");
      const label = inputs[0]?.value.trim();
      const url = inputs[1]?.value.trim();
      if (!label && !url) return "";
      if (label && url) return `${label}: ${url}`;
      return url || label;
    })
    .filter(Boolean);

  if (!links.length) return placeholder;
  return links.join("\n");
}

function hasLinkContent() {
  return Array.from(linkList.querySelectorAll(".example-card")).some((card) => {
    const inputs = card.querySelectorAll("input");
    const label = inputs[0]?.value.trim();
    const url = inputs[1]?.value.trim();
    return Boolean(label || url);
  });
}

function removeLinkCard(card) {
  card.remove();
  updateLineMeter(getPromptText());
  updateLivePreview();
}

window.__promptStudioReady = true;
