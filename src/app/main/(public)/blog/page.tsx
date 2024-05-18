
import { getAllPosts } from "@/server/helpers/blog/get-all-posts";
import { PostsGrid } from "@/components/blog/posts-grid";
import { CategoryPicker } from "@/components/blog/category-picker";
import { BLOG_DESCRIPTION, BLOG_TITLE } from "@/app_settings";

export default async function Page() {
  const posts = await getAllPosts();
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

      <PostsGrid posts={posts} />

    </>
  );
}
