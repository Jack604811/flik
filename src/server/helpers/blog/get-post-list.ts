import { promises as fs } from "fs";
import path from "path";
import { BLOG_POSTS_PATH } from "@/app_settings";

export async function getPostsList() {
  const workDir = process.cwd();
  const contentPath = BLOG_POSTS_PATH;
  const posts = await fs.readdir(path.join(workDir, contentPath));
  return posts;
}
