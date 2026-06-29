// @ts-check

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

/** @typedef {{ path: string, label: string }} RequiredFile */

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));

/** @type {string[]} */
const failures = [];

/**
 * @param {string} relativePath
 * @returns {string}
 */
function absolutePath(relativePath) {
  return join(rootDir, relativePath);
}

/**
 * @param {string} relativePath
 * @returns {string}
 */
function readRequiredFile(relativePath) {
  const targetPath = absolutePath(relativePath);
  if (!existsSync(targetPath)) {
    throw new Error(`Missing required file: ${relativePath}`);
  }

  return readFileSync(targetPath, "utf8");
}

/**
 * @param {string} content
 * @param {string} label
 * @param {string[]} needles
 */
function requireIncludes(content, label, needles) {
  for (const needle of needles) {
    if (!content.includes(needle)) {
      failures.push(`${label} must include: ${needle}`);
    }
  }
}

/**
 * @param {string} content
 * @returns {{ name: string, description: string }}
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n(?<body>[\s\S]*?)\n---\n/);
  if (match?.groups === undefined) {
    failures.push("SKILL.md must start with frontmatter.");
    return { name: "", description: "" };
  }

  /** @type {Map<string, string>} */
  const fields = new Map();
  for (const line of match.groups.body.split("\n")) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      failures.push(`Malformed frontmatter line: ${line}`);
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    fields.set(key, value);
  }

  const name = fields.get("name");
  const description = fields.get("description");

  if (typeof name !== "string" || name.length === 0) {
    failures.push("Frontmatter must include name.");
  }

  if (typeof description !== "string" || description.length === 0) {
    failures.push("Frontmatter must include description.");
  }

  return {
    name: typeof name === "string" ? name : "",
    description: typeof description === "string" ? description : "",
  };
}

/**
 * @param {string} skillContent
 * @returns {string[]}
 */
function extractMarkdownReferenceTargets(skillContent) {
  const referencesSection = skillContent.match(/## References\n(?<body>[\s\S]*)$/);
  if (referencesSection?.groups === undefined) {
    failures.push("SKILL.md must include a References section.");
    return [];
  }

  /** @type {string[]} */
  const targets = [];
  const linkPattern = /\]\((?<target>references\/[^)]+)\)/g;

  for (const match of referencesSection.groups.body.matchAll(linkPattern)) {
    const target = match.groups?.target;
    if (typeof target === "string") {
      targets.push(target);
    }
  }

  if (targets.length === 0) {
    failures.push("SKILL.md References section must link reference files.");
  }

  return targets;
}

/**
 * @param {string} commandContent
 * @param {string} label
 */
function validateCommandFile(commandContent, label) {
  requireIncludes(commandContent, label, [
    "SKILL.md",
    "evidence-ledger.md",
    "fail-closed-scenarios.md",
    "source-freshness.md",
    "pre-response check",
    "Evidence ledger",
  ]);

  if (commandContent.includes("-5.")) {
    failures.push(`${label} contains malformed numbering "-5."`);
  }

  if (/(^|[\s([`])skills\/nodev(\/|[\s)`\]])/.test(commandContent)) {
    failures.push(`${label} must use top-level SKILL.md and references, not skills/nodev.`);
  }
}

/** @type {RequiredFile[]} */
const requiredFiles = [
  { path: "SKILL.md", label: "SKILL.md" },
  { path: "references/fail-closed-scenarios.md", label: "fail-closed scenarios" },
  { path: "references/evidence-ledger.md", label: "evidence ledger" },
  { path: "references/source-freshness.md", label: "source freshness" },
  { path: "examples/golden-cases.md", label: "golden cases" },
  { path: "agents/openai.yaml", label: "OpenAI metadata" },
  { path: "commands/nodev.md", label: "commands/nodev.md" },
  { path: ".claude/commands/nodev.md", label: ".claude/commands/nodev.md" },
];

for (const file of requiredFiles) {
  if (!existsSync(absolutePath(file.path))) {
    failures.push(`Missing required ${file.label}: ${file.path}`);
  }
}

const skillContent = readRequiredFile("SKILL.md");
const frontmatter = parseFrontmatter(skillContent);

if (frontmatter.name !== "nodev") {
  failures.push('Frontmatter name must be "nodev".');
}

if (!frontmatter.description.startsWith("Use for safe AI-authored Cloudflare delivery")) {
  failures.push("Description must front-load core Nodev trigger words.");
}

if (!frontmatter.description.includes("Do not use")) {
  failures.push('Description must include a "Do not use" boundary.');
}

requireIncludes(skillContent, "SKILL.md", [
  "## When To Use This Skill",
  "## When Not To Use This Skill",
  "## Reference Routing",
  "## Unknown Mode Handling",
  "## Evidence Ledger",
  "## Output Modes",
  "## Pre-Response Safety Check",
  "## Execution mode",
  "## Capability check",
  "## Risk tier",
  "## Blast radius",
  "## Required Cloudflare controls",
  "## Verification gates",
  "## Rollout and rollback",
  "## Evidence ledger",
  "## Open risks",
  "## Handoff",
]);

for (const target of extractMarkdownReferenceTargets(skillContent)) {
  const normalizedTarget = normalize(target);
  if (!existsSync(absolutePath(normalizedTarget))) {
    failures.push(`SKILL.md references missing file: ${normalizedTarget}`);
  }
}

const commandContent = readRequiredFile("commands/nodev.md");
const claudeCommandContent = readRequiredFile(".claude/commands/nodev.md");
validateCommandFile(commandContent, "commands/nodev.md");
validateCommandFile(claudeCommandContent, ".claude/commands/nodev.md");

const goldenCasesContent = readRequiredFile("examples/golden-cases.md");
requireIncludes(goldenCasesContent, "golden-cases.md", [
  "## 1. Unknown Mode, Rollout Design",
  "## 2. Leaf UI With Billing Side Effect",
  "## 3. Autonomous Remote With No Logs",
  "## 4. Durable Object Worker Relying On Preview URLs",
  "## 5. AI Feature With Direct Provider Calls",
  "## 6. Broad Cloudflare Token",
  "## 7. Missing Rollback For D1 Migration",
  "## 8. Generic Coding Question",
  "Must not do:",
]);

const readmeContent = readRequiredFile("README.md");
requireIncludes(readmeContent, "README.md", [
  "npx skills add charl-kruger/nodev",
  "SKILL.md",
  "references/",
]);

if (readmeContent.includes("charl-kruger/skills")) {
  failures.push("README.md must not point installs at charl-kruger/skills.");
}

if (/(^|[\s([`])skills\/nodev(\/|[\s)`\]])/.test(readmeContent)) {
  failures.push("README.md must describe the top-level skill layout, not skills/nodev.");
}

if (failures.length > 0) {
  console.error("Nodev skill validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Nodev skill validation passed.");
