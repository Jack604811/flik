import { promises as fs } from "fs";
import path from "path";
import { BLOG_POSTS_PATH } from "@/app_settings";
export async function getPostDate({ fileName }: { fileName: string }) {
  const workDir = process.cwd();
  const contentPath = BLOG_POSTS_PATH;
  const post = await fs.stat(path.join(workDir, contentPath, fileName));
  const postTimes = {
    createdAt: post.birthtime,
    modifiedAt: post.mtime,
  };
  return postTimes;
}
