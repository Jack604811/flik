"use client";
import { BlogPostFrontmatter } from "@/types/frontmatter/blog_post";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import components from "@/blog_content/components";
interface Props {
  mdxSource: MDXRemoteSerializeResult;
}
export function MarkdownRender({ mdxSource }: Props) {
  const frontmatter = mdxSource.frontmatter as unknown as BlogPostFrontmatter;
  return (
    <div className="prose prose-invert mx-auto xl:prose-xl">
      <h1>{frontmatter.title}</h1>
      <MDXRemote components={components} {...mdxSource} />
    </div>
  );
}
