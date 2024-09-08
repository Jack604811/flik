import { BLOG_POSTS_PATH } from "@/app-settings";
import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
export async function getPostContent(fileName: string) {

  try {
    const workDir = process.cwd();
    const contentPath = BLOG_POSTS_PATH;
    const file = await fs.readFile(
      path.join(workDir, contentPath, fileName),
      "utf-8"
    );
    return file;
  } catch (error) {
    //throw 404 error
    notFound()

  }

}
