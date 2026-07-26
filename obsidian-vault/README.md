# SHOPO — Obsidian Second Brain

> This vault is your permanent knowledge base. Every decision, every lesson, every code pattern — documented and linked.

## How This Vault Works

### Visual Linking (Graph View)
- Every note links to related notes using `[[wikilinks]]`
- Open Obsidian → Graph View to see how code/decisions connect visually
- When you see a cluster of connected notes, you understand a feature's full picture

### Writing Rules for Agents
When ANY AI agent writes code, it MUST also update the relevant Obsidian note:
1. **What was built** — brief description
2. **Why** — the rationale / decision
3. **How** — link to the actual code file
4. **Connected to** — `[[wikilinks]]` to related features/decisions
5. **Lessons** — any mistakes or gotchas discovered

### Folder Structure
```
obsidian-vault/
├── 01_Daily_Journal/        ← One note per work day
├── 02_Architecture/         ← System design decisions
├── 03_Features/             ← One note per feature
├── 04_Code_Patterns/        ← Proven code patterns
├── 05_Anti_Patterns/        ← Mistakes to never repeat
├── 06_Lessons_Learned/      ← Wisdom from building
├── 07_API_Contracts/        ← Endpoint documentation
├── 08_Database/             ← Schema evolution
├── 09_AI_Pipeline/          ← AI system documentation
├── 10_Templates/            ← Reusable templates
└── README.md                ← This file
```

## Getting Started
1. Open this folder as an Obsidian vault
2. Enable Graph View
3. Use the daily journal template for every work session
4. Cross-link everything with `[[wikilinks]]`
