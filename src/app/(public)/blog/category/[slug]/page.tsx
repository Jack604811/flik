
export const dynamic = 'force-static'

import { BLOG_DESCRIPTION, BLOG_TITLE } from "@/app_settings";
import { getAllPosts } from "@/server/helpers/blog/get-all-posts";
import { PostsGrid } from "@/components/blog/posts-grid";
import { notFound } from "next/navigation";
import { CategoryPicker } from "@/components/blog/category-picker";


export async function generateStaticParams() {
    const posts = await getAllPosts();
    return posts.map(post => ({ slug: post.frontMatter.category.toLowerCase() }))
}
export default async function Page({ params }: { params: { slug: string } }) {

    const posts = await getAllPosts();

    const matchingPosts = posts.filter(post => post.frontMatter.category.toLowerCase() === params.slug.toLowerCase());

    if (!matchingPosts || matchingPosts.length === 0) {
        notFound();
    }

    const categories = posts.map(post => post.frontMatter.category.toLowerCase());

    return (
        <>
            <div className="text-center space-y-2 xl:space-y-4 py-6">
                <h1 className="text-3xl font-bold sm:text-4xl xl:text-5xl">
                    {BLOG_TITLE}
                </h1>
                <h2 className="text-lg xl:text-xl text-foreground/90">
                    {BLOG_DESCRIPTION}
                </h2>
            </div>
            <CategoryPicker categories={categories} />

            <PostsGrid posts={matchingPosts} />

        </>
    );
}
