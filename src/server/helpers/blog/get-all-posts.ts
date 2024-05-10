import { getPostMDX } from "@/server/helpers/blog/get-mdx";
import { getPostsList } from "@/server/helpers/blog/get-post-list";
import { getPostDate } from "@/server/helpers/blog/get-post-date";
import { BlogPostFrontmatter } from "@/types/frontmatter/blog_post";
import { getPostContent } from "./get-post-content";
import readingTime from "reading-time";

/*
 * This function is a convenient wrapper around other smaller helper functions that will get all the information needed for each post in the blog:
 * It will:
 * 1. get the file names of all the posts located in the posts folder using the getPostsList helper
 * 2. get the creation and modification dates of each post using the getPostDate helper
 * 3. get the content of each post using the getPostContent helper
 * 4. get the reading time of each post using the reading-time library
 * 5. get the front matter of each post using the getPostMDX helper
 * 6. return an array of objects, each object containing the file name, creation date, modification date,front matter and reading-time of each post
 */

export async function getAllPosts() {
  try {
    const posts = await getPostsList();
    const postsWithDate = await Promise.all(
      posts.map(async (post) => {
        const postStat = await getPostDate({ fileName: post });
        return {
          fileName: post,
          createdAt: postStat.createdAt,
          modifiedAt: postStat.modifiedAt,
        };
      })
    );

    const postsWithDateAndFrondMatter = await Promise.all(
      postsWithDate.map(async (post) => {
        const postContent = await getPostContent(post.fileName);
        const withoutFrontMatter = postContent.split("---").slice(2).join("---");
        const postReadingTime = readingTime(withoutFrontMatter);
        const postMDX = await getPostMDX(postContent);
        return {
          ...post,
          frontMatter: postMDX.frontmatter as unknown as BlogPostFrontmatter,
          readingTime: postReadingTime,
        };
      })
    );
    return postsWithDateAndFrondMatter;
  } catch (error) {
    throw new Error();
  }

}
