import { PROJECTS } from "./projects";
import type { Project, User } from "./types";
import { USERS } from "./users";

export * from "./types";
export * from "./skills";
export * from "./domains";
export * from "./users";
export * from "./projects";

export const CURRENT_USER_ID = "user-alex-bennett";

export async function getProjectById(
  id: string,
): Promise<Project | undefined> {
  return PROJECTS.find((project) => project.id === id);
}

export async function getUserByUsername(
  username: string,
): Promise<User | undefined> {
  return USERS.find((user) => user.username === username);
}

export async function getProjectsByOwner(ownerId: string): Promise<Project[]> {
  return PROJECTS.filter((project) => project.ownerId === ownerId);
}

export async function getSuggestedPeople(
  currentUserId: string,
  limit = 3,
): Promise<User[]> {
  return USERS.filter((user) => user.id !== currentUserId).slice(0, limit);
}

export async function getSuggestedProjects(
  currentUserId: string,
  limit = 2,
): Promise<Project[]> {
  return PROJECTS.filter((project) => project.ownerId !== currentUserId).slice(
    0,
    limit,
  );
}
