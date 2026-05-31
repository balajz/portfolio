import fs from "fs";
import path from "path";

const dataDirectory = path.join(process.cwd(), "content/data");

export type Experience = {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  skills: string[];
};

export type Recommendation = {
  title: string;
  creator: string;
  url?: string;
};

export type Recommendations = {
  songs: Recommendation[];
  anime: Recommendation[];
  movies: Recommendation[];
  books: Recommendation[];
};

export type Highlight = {
  title: string;
  date: string;
  description: string;
};

export type Goal = {
  title: string;
  status: "completed" | "in-progress" | "planned";
  description?: string;
};

function readJsonFile<T>(filename: string, defaultValue: T): T {
  try {
    const fullPath = path.join(dataDirectory, filename);
    if (!fs.existsSync(fullPath)) {
      return defaultValue;
    }
    const fileContents = fs.readFileSync(fullPath, "utf8");
    return JSON.parse(fileContents) as T;
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return defaultValue;
  }
}

export function getExperience(): Experience[] {
  return readJsonFile<Experience[]>("experience.json", []);
}

export function getRecommendations(): Recommendations {
  return readJsonFile<Recommendations>("recommendations.json", {
    songs: [],
    anime: [],
    movies: [],
    books: [],
  });
}

export function getHighlights(): Highlight[] {
  return readJsonFile<Highlight[]>("highlights.json", []);
}

export function getGoals(): Goal[] {
  return readJsonFile<Goal[]>("goals.json", []);
}
