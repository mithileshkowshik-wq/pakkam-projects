import { DOMAINS } from "./domains";
import { SKILLS } from "./skills";
import type { Domain, Skill, User } from "./types";

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

export const USERS: User[] = [
  {
    id: "user-alex-bennett",
    username: "alex-bennett",
    name: "Alex Bennett",
    headline: "Game designer · Berlin, DE",
    bio: "Game designer building small, strange, cozy games. Always up for a weird prototype.",
    location: "Berlin, DE",
    availabilityLevel: "PART_TIME",
    openToCollaborate: true,
    skills: [
      skill("Unity"),
      skill("Game Design"),
      skill("Pixel Art"),
      skill("C#"),
      skill("Level Design"),
      skill("Shaders"),
    ],
    domains: [
      domain("Gaming"),
      domain("Music"),
      domain("Art & Illustration"),
      domain("Education"),
    ],
  },
  {
    id: "user-mira-kaur",
    username: "mira-kaur",
    name: "Mira Kaur",
    headline: "Writer & editor",
    bio: "Writer and editor taking on small, thoughtful collaborations between drafts.",
    availabilityLevel: "CASUAL",
    openToCollaborate: true,
    skills: [skill("Copywriting"), skill("Illustration"), skill("Editing")],
    domains: [domain("Writing & Publishing")],
  },
  {
    id: "user-jordan-torres",
    username: "jordan-torres",
    name: "Jordan Torres",
    headline: "Social-impact app builder",
    bio: "Building practical tools for neighborhood-scale mutual aid and resource sharing.",
    availabilityLevel: "SERIOUS",
    openToCollaborate: true,
    skills: [skill("React"), skill("UI Design")],
    domains: [domain("Social Impact"), domain("Technology")],
  },
  {
    id: "user-casey-diaz",
    username: "casey-diaz",
    name: "Casey Diaz",
    headline: "Product designer · Berlin",
    bio: "Product designer shaping calm, usable tools for creative teams.",
    location: "Berlin",
    availabilityLevel: "PART_TIME",
    openToCollaborate: true,
    skills: [skill("React"), skill("UI Design")],
    domains: [domain("Technology"), domain("Art & Illustration")],
  },
  {
    id: "user-robin-shah",
    username: "robin-shah",
    name: "Robin Shah",
    headline: "Composer · Remote",
    bio: "Composer and sound designer for games, installations, and tiny interactive worlds.",
    availabilityLevel: "CASUAL",
    openToCollaborate: true,
    skills: [skill("Music Production"), skill("Sound Design")],
    domains: [domain("Music"), domain("Gaming")],
  },
  {
    id: "user-lee-park",
    username: "lee-park",
    name: "Lee Park",
    headline: "Writer & editor",
    bio: "Editor and content writer focused on clear narrative systems and launch copy.",
    availabilityLevel: "BROWSING",
    openToCollaborate: false,
    skills: [skill("Content Writing"), skill("Editing")],
    domains: [domain("Writing & Publishing"), domain("Film & Video")],
  },
];
