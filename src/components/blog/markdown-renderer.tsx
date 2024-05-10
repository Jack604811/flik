"use client";
import { BlogPostFrontmatter } from "@/types/frontmatter/blog_post";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
const MDXRemote = dynamic(() => import("next-mdx-remote").then((mod) => mod.MDXRemote), { ssr: false });
import components from "@/blog_content/components";
import dynamic from "next/dynamic";
interface Props {
  mdxSource: MDXRemoteSerializeResult;
}
export function MarkdownRender({ mdxSource }: Props) {
  const frontmatter = mdxSource.frontmatter as unknown as BlogPostFrontmatter;
  return (
    <div className="mx-auto prose xl:prose-xl dark:prose-invert ">
      <h1 className="bg-accent p-4 rounded text-center md:text-left">
        {frontmatter.title}
      </h1>
      <MDXRemote components={components} {...mdxSource} />
    </div>
  );
}
