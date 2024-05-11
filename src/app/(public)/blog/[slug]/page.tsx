
export const dynamic = 'force-static'


import { MarkdownRender } from "@/components/blog/markdown-renderer";

import { ScrollProgressBar } from "@/components/blog/scroll-progress-bar";
import { Badge } from "@/components/ui/badge";
import { getPostMDX } from "@/server/helpers/blog/get-mdx";
import { getPostContent } from "@/server/helpers/blog/get-post-content";
import { getPostsList } from "@/server/helpers/blog/get-post-list";
import { BlogPostFrontmatter } from "@/types/frontmatter/blog_post";
import Link from "next/link";

import type { Metadata, ResolvingMetadata } from 'next'
import Image from "next/image";

type MetaDataProps = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}


export async function generateMetadata(
  { params, searchParams }: MetaDataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const postContent = await getPostContent(`${params.slug}.mdx`);
  const post = await getPostMDX(postContent);
  const frontMatter = post.frontmatter as unknown as BlogPostFrontmatter;

  return {
    title: frontMatter.title,
    description: frontMatter.description,
    openGraph: {
      type: "article",
      images: [
        {
          url: frontMatter.cover_image,
        }
      ],


    },
    twitter: {
      images: [{
        url: frontMatter.cover_image

      }]
    }

  }
}


export async function generateStaticParams() {
  const posts = await getPostsList();

  return posts.map((post) => ({
    slug: post,
  }))

}

export default async function Page({
  params,
}: {
  params: { slug: string };
}) {
  const postContent = await getPostContent(`${params.slug}.mdx`);
  const post = await getPostMDX(postContent);
  const frontMatter = post.frontmatter as unknown as BlogPostFrontmatter;

  return (
    <main className="relative">
      <ScrollProgressBar />
      <article className="max-w-[1440px] mx-auto flex flex-col items-center py-8 text-center px-4">
        <Image src={frontMatter.cover_image} alt={frontMatter.title} width={1080} height={720} className="aspect-video object-cover rounded" />
        <Link className="mt-8" href={`/blog/category/${frontMatter.category.toLowerCase()}`}>
          <Badge className="text-md rounded-md">Category</Badge>
        </Link>

        <p className="text-foreground/60 mt-4">2 days ago - 5 min read</p>
        <div className="text-left mt-6">
          <MarkdownRender mdxSource={post} />
        </div>
      </article>
    </main>
  );
}
