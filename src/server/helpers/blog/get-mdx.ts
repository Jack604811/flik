import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

export async function getPostMDX(file: string) {
  const mdxSource = await serialize(file, {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      // @ts-ignore
      rehypePlugins: [rehypeHighlight],
    },
  });
  return mdxSource;
}
