import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Project = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  content: string;
};

const projectsDirectory = path.join(process.cwd(), "content/projects");

export function getAllProjects(): Project[] {
  if (!fs.existsSync(projectsDirectory)) {
    return [];
  }

  const files = fs.readdirSync(projectsDirectory);

  const projects: Project[] = files
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const fullPath = path.join(projectsDirectory, file);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || "",
        date: data.date || "",
        summary: data.summary || "",
        techStack: data.techStack || [],
        githubUrl: data.githubUrl,
        liveUrl: data.liveUrl,
        featured: data.featured || false,
        content,
      };
    })
    .sort((a, b) => (new Date(b.date).getTime() > new Date(a.date).getTime() ? 1 : -1));

  return projects;
}

export function getProjectBySlug(slug: string): Project | null {
  try {
    const fullPathMdx = path.join(projectsDirectory, `${slug}.mdx`);
    const fullPathMd = path.join(projectsDirectory, `${slug}.md`);

    let fullPath = "";
    if (fs.existsSync(fullPathMdx)) {
      fullPath = fullPathMdx;
    } else if (fs.existsSync(fullPathMd)) {
      fullPath = fullPathMd;
    } else {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || "",
      date: data.date || "",
      summary: data.summary || "",
      techStack: data.techStack || [],
      githubUrl: data.githubUrl,
      liveUrl: data.liveUrl,
      featured: data.featured || false,
      content,
    };
  } catch (error) {
    return null;
  }
}
