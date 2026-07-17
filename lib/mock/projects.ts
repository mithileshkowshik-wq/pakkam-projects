import { DOMAINS } from "./domains";
import { SKILLS } from "./skills";
import { USERS } from "./users";
import type { Domain, Project, Skill, User } from "./types";

const skill = (name: string): Skill => {
  const match = SKILLS.find((item) => item.name === name);

  if (!match) {
    throw new Error(`Missing mock skill: ${name}`);
  }

  return match;
};

const domain = (name: string): Domain => {
  const match = DOMAINS.find((item) => item.name === name);

  if (!match) {
    throw new Error(`Missing mock domain: ${name}`);
  }

  return match;
};

const user = (username: string): User => {
  const match = USERS.find((item) => item.username === username);

  if (!match) {
    throw new Error(`Missing mock user: ${username}`);
  }

  return match;
};

const owner = (
  username: string,
): Pick<User, "id" | "username" | "name" | "avatarUrl" | "headline"> => {
  const match = user(username);

  return {
    id: match.id,
    username: match.username,
    name: match.name,
    avatarUrl: match.avatarUrl,
    headline: match.headline,
  };
};

export const PROJECTS: Project[] = [
  {
    id: "project-coop-puzzle-game-prototype",
    ownerId: user("alex-bennett").id,
    title: "Co-op puzzle game prototype",
    pitch:
      "A cozy two-player puzzler about rerouting light through a broken observatory. Prototype is playable, tuning the middle levels now.",
    description:
      "<p>A cozy two-player puzzler about rerouting beams of light through a broken observatory to wake up its sleeping constellations. Each level is a small self-contained machine; co-op comes from one player steering mirrors while the other controls time.</p><p>The prototype is playable end-to-end with 12 levels. We're tuning difficulty in the middle third and building out the soundtrack and art pass before a small public demo.</p>",
    stage: "IN_PROGRESS",
    commitmentLevel: "PART_TIME",
    collaborationStyle: ["Remote", "Async-friendly"],
    tools: ["Notion", "Figma"],
    isOpenToCollabs: true,
    isPublic: true,
    createdAt: "2026-06-18T10:00:00.000Z",
    updatedAt: "2026-07-10T12:00:00.000Z",
    skills: [
      skill("Unity"),
      skill("C#"),
      skill("Level Design"),
      skill("Pixel Art"),
      skill("Music Production"),
    ],
    domains: [domain("Gaming")],
    roles: [
      {
        id: "role-unity-developer",
        title: "Unity Developer",
        description:
          "Help build level mechanics and a lightweight editor for rapid iteration.",
      },
      {
        id: "role-level-designer",
        title: "Level Designer",
        description:
          "Design the middle-third puzzles and pace the difficulty curve.",
      },
      {
        id: "role-composer",
        title: "Composer",
        description:
          "Write an ambient, generative-leaning score that reacts to solved puzzles.",
      },
    ],
    links: [],
    updates: [
      {
        id: "update-observatory-art-pass",
        content:
          "Finished the observatory art pass and shipped a new mirror-rotation feel. Feels way smoother.",
        createdAt: "2026-07-10T09:00:00.000Z",
      },
      {
        id: "update-middle-levels",
        content:
          "Middle levels are too spiky — reworking 6 through 9 this week.",
        createdAt: "2026-07-02T09:00:00.000Z",
      },
    ],
    owner: owner("alex-bennett"),
    viewingCount: 47,
  },
  {
    id: "project-serialized-sci-fi-newsletter",
    ownerId: user("mira-kaur").id,
    title: "A serialized sci-fi newsletter",
    pitch:
      "Looking for a co-writer and an illustrator to launch a bi-weekly short-fiction newsletter set in a shared solarpunk universe.",
    description:
      "<p>A low-pressure fiction project built around compact episodes, recurring correspondents, and illustrated artifacts from a shared solarpunk setting.</p><p>The first arc is outlined; the next step is finding a collaborator who likes worldbuilding in public.</p>",
    stage: "IDEA",
    commitmentLevel: "CASUAL",
    collaborationStyle: ["Remote", "Async-friendly"],
    tools: ["Google Docs", "Substack"],
    isOpenToCollabs: true,
    isPublic: true,
    createdAt: "2026-05-22T10:00:00.000Z",
    updatedAt: "2026-07-04T10:00:00.000Z",
    skills: [skill("Copywriting"), skill("Illustration"), skill("Editing")],
    domains: [domain("Writing & Publishing")],
    roles: [
      {
        id: "role-co-writer",
        title: "Co-writer",
        description:
          "Develop short episodes and help shape the shared universe bible.",
      },
      {
        id: "role-illustrator",
        title: "Illustrator",
        description: "Create spot illustrations and issue header art.",
      },
    ],
    links: [],
    updates: [
      {
        id: "update-newsletter-outline",
        content: "Drafted the first four issue beats and a starter glossary.",
        createdAt: "2026-07-04T10:00:00.000Z",
      },
    ],
    owner: owner("mira-kaur"),
    viewingCount: 18,
  },
  {
    id: "project-neighborhood-tool-share-app",
    ownerId: user("jordan-torres").id,
    title: "Neighborhood tool-share app",
    pitch:
      "A map-based app for borrowing tools from neighbors. Backend is up; we need a designer and a React dev to ship the v1.",
    description:
      "<p>A neighborhood resource map where residents can lend drills, ladders, garden tools, and repair gear without starting from a blank marketplace.</p><p>The core backend and auth flow are working. The remaining push is interaction design, front-end polish, and launch testing with one pilot block.</p>",
    stage: "NEAR_LAUNCH",
    commitmentLevel: "SERIOUS",
    collaborationStyle: ["Remote", "Scheduled calls"],
    tools: ["Linear", "Figma", "GitHub"],
    isOpenToCollabs: true,
    isPublic: true,
    createdAt: "2026-03-12T10:00:00.000Z",
    updatedAt: "2026-07-12T10:00:00.000Z",
    skills: [skill("React"), skill("UI Design"), skill("Node.js")],
    domains: [domain("Social Impact")],
    roles: [
      {
        id: "role-product-designer",
        title: "Product Designer",
        description:
          "Tighten the borrowing flow and empty states before pilot launch.",
      },
      {
        id: "role-react-developer",
        title: "React Developer",
        description: "Build the map filters, listing cards, and request flow.",
      },
    ],
    links: [{ id: "link-v1-demo", label: "Private v1 demo", url: "#" }],
    updates: [
      {
        id: "update-backend-ready",
        content: "Backend endpoints are wired up for listings and requests.",
        createdAt: "2026-07-12T10:00:00.000Z",
      },
      {
        id: "update-pilot-block",
        content: "Found a pilot block with twelve neighbors ready to test.",
        createdAt: "2026-06-28T10:00:00.000Z",
      },
    ],
    owner: owner("jordan-torres"),
    viewingCount: 62,
  },
  {
    id: "project-chiptune-sample-pack",
    ownerId: user("alex-bennett").id,
    title: "Chiptune sample pack",
    pitch:
      "A tiny pack of crunchy melodic loops and one-shot UI sounds for cozy game jams.",
    description:
      "<p>A compact chiptune sample pack built from old handheld-inspired synth patches, short melodic loops, and tactile UI sounds.</p>",
    stage: "IDEA",
    commitmentLevel: "CASUAL",
    collaborationStyle: ["Remote", "Flexible"],
    tools: ["Ableton", "Notion"],
    isOpenToCollabs: true,
    isPublic: true,
    createdAt: "2026-06-30T10:00:00.000Z",
    updatedAt: "2026-07-05T10:00:00.000Z",
    skills: [skill("Music Production"), skill("Sound Design")],
    domains: [domain("Music")],
    roles: [
      {
        id: "role-sound-curator",
        title: "Sound Curator",
        description: "Help trim, name, and tag the first collection.",
      },
    ],
    links: [],
    updates: [],
    owner: owner("alex-bennett"),
    viewingCount: 21,
  },
  {
    id: "project-pixel-art-zine",
    ownerId: user("alex-bennett").id,
    title: "Pixel art zine",
    pitch:
      "A near-finished PDF zine about tiny palettes, tile constraints, and making expressive game props.",
    description:
      "<p>A practical pixel art zine collecting short exercises, annotated sprite sheets, and constraints that make small tiles feel expressive.</p><p>Most pages are laid out; the final pass needs proofreading and a few guest examples.</p>",
    stage: "NEAR_LAUNCH",
    commitmentLevel: "PART_TIME",
    collaborationStyle: ["Remote", "Async-friendly"],
    tools: ["Aseprite", "Figma"],
    isOpenToCollabs: true,
    isPublic: true,
    createdAt: "2026-04-16T10:00:00.000Z",
    updatedAt: "2026-07-09T10:00:00.000Z",
    skills: [skill("Pixel Art"), skill("Illustration"), skill("Editing")],
    domains: [domain("Art & Illustration")],
    roles: [
      {
        id: "role-proofreader",
        title: "Proofreader",
        description: "Catch typos and unclear steps before export.",
      },
    ],
    links: [{ id: "link-zine-preview", label: "Preview deck", url: "#" }],
    updates: [
      {
        id: "update-zine-layout",
        content: "Laid out the palette exercises and cover draft.",
        createdAt: "2026-07-09T10:00:00.000Z",
      },
    ],
    owner: owner("alex-bennett"),
    viewingCount: 34,
  },
  {
    id: "project-indie-music-discovery-zine",
    ownerId: user("lee-park").id,
    title: "Indie music discovery zine",
    pitch:
      "A monthly digital zine pairing short artist interviews with visual listening notes and small-scene recommendations.",
    description:
      "<p>A design-and-writing project for people who miss hand-curated music blogs but want something lighter than a magazine.</p><p>The first issue theme is local scenes that trade demos in group chats instead of streaming campaigns.</p>",
    stage: "PROTOTYPE",
    commitmentLevel: "CASUAL",
    collaborationStyle: ["Remote", "Async-friendly"],
    tools: ["Figma", "Google Docs"],
    isOpenToCollabs: true,
    isPublic: true,
    createdAt: "2026-05-18T10:00:00.000Z",
    updatedAt: "2026-07-06T10:00:00.000Z",
    skills: [skill("UI Design"), skill("Content Writing"), skill("Editing")],
    domains: [domain("Music"), domain("Writing & Publishing")],
    roles: [
      {
        id: "role-visual-designer",
        title: "Visual Designer",
        description: "Shape the first issue layout and reusable page system.",
      },
      {
        id: "role-interviewer",
        title: "Interviewer",
        description: "Run short artist interviews and edit them for the zine.",
      },
    ],
    links: [],
    updates: [
      {
        id: "update-zine-theme",
        content: "Locked the first issue theme and interview shortlist.",
        createdAt: "2026-07-06T10:00:00.000Z",
      },
    ],
    owner: owner("lee-park"),
    viewingCount: 29,
  },
  {
    id: "project-climate-data-viz-dashboard",
    ownerId: user("casey-diaz").id,
    title: "Climate data viz dashboard",
    pitch:
      "An approachable dashboard that turns regional climate datasets into clear, annotated visual stories for classrooms.",
    description:
      "<p>A dashboard prototype for exploring climate indicators without requiring users to understand raw tables first.</p><p>The focus is clear comparisons, annotations, and classroom-ready exports.</p>",
    stage: "PROTOTYPE",
    commitmentLevel: "SERIOUS",
    collaborationStyle: ["Remote", "Scheduled calls"],
    tools: ["Observable", "Figma", "Notion"],
    isOpenToCollabs: true,
    isPublic: true,
    createdAt: "2026-04-28T10:00:00.000Z",
    updatedAt: "2026-07-11T10:00:00.000Z",
    skills: [skill("Data Analysis"), skill("UX Research"), skill("React")],
    domains: [domain("Research"), domain("Climate & Environment")],
    roles: [
      {
        id: "role-data-storyteller",
        title: "Data Storyteller",
        description:
          "Help choose examples and write plain-language annotations.",
      },
      {
        id: "role-frontend-prototyper",
        title: "Frontend Prototyper",
        description: "Build the first interactive chart set in React.",
      },
    ],
    links: [{ id: "link-data-notes", label: "Dataset notes", url: "#" }],
    updates: [
      {
        id: "update-chart-tests",
        content: "Tested three chart treatments with a small teacher cohort.",
        createdAt: "2026-07-11T10:00:00.000Z",
      },
    ],
    owner: owner("casey-diaz"),
    viewingCount: 41,
  },
  {
    id: "project-pocket-podcast-studio",
    ownerId: user("robin-shah").id,
    title: "Pocket podcast studio",
    pitch:
      "A lightweight workflow kit for recording, editing, and publishing polished mini-interviews from a phone.",
    description:
      "<p>A prototype workflow that combines practical templates, audio cleanup presets, and publishing checklists for short interview shows.</p>",
    stage: "IN_PROGRESS",
    commitmentLevel: "PART_TIME",
    collaborationStyle: ["Remote", "Flexible"],
    tools: ["Descript", "Notion"],
    isOpenToCollabs: true,
    isPublic: true,
    createdAt: "2026-06-02T10:00:00.000Z",
    updatedAt: "2026-07-08T10:00:00.000Z",
    skills: [
      skill("Podcast Production"),
      skill("Sound Design"),
      skill("Content Writing"),
    ],
    domains: [domain("Film & Video"), domain("Lifestyle")],
    roles: [
      {
        id: "role-template-tester",
        title: "Template Tester",
        description: "Run the workflow on a sample interview and flag friction.",
      },
    ],
    links: [],
    updates: [
      {
        id: "update-audio-presets",
        content: "Built the first cleanup preset chain for noisy phone audio.",
        createdAt: "2026-07-08T10:00:00.000Z",
      },
    ],
    owner: owner("robin-shah"),
    viewingCount: 25,
  },
  {
    id: "project-community-fundraising-playbook",
    ownerId: user("jordan-torres").id,
    title: "Community fundraising playbook",
    pitch:
      "A practical launch playbook for neighborhood groups raising small pools of money without turning into a full nonprofit.",
    description:
      "<p>A structured guide with outreach scripts, event formats, and transparent budget templates for community-led fundraising.</p><p>The project needs a sharper editorial voice and a few real-world examples before public release.</p>",
    stage: "IDEA",
    commitmentLevel: "SERIOUS",
    collaborationStyle: ["Remote", "In-person"],
    tools: ["Notion", "Google Sheets"],
    isOpenToCollabs: true,
    isPublic: true,
    createdAt: "2026-06-24T10:00:00.000Z",
    updatedAt: "2026-07-03T10:00:00.000Z",
    skills: [
      skill("Fundraising"),
      skill("Community Building"),
      skill("Content Writing"),
    ],
    domains: [domain("Social Impact"), domain("Finance")],
    roles: [
      {
        id: "role-field-reviewer",
        title: "Field Reviewer",
        description:
          "Review the playbook against real community organizing scenarios.",
      },
      {
        id: "role-editor",
        title: "Editor",
        description: "Make the scripts clear, concise, and easy to adapt.",
      },
    ],
    links: [],
    updates: [],
    owner: owner("jordan-torres"),
    viewingCount: 16,
  },
];
