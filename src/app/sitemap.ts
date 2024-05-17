import { APP_DOMAIN, APP_ROUTES } from "@/app_settings";
import { getPostsList } from "@/server/helpers/blog/get-post-list";
import { getPostDate } from "@/server/helpers/blog/get-post-date";
export default async function sitemap() {
  const routes = APP_ROUTES.filter(route => route.visibleBy === 'all').map((route) => ({
    url: `${APP_DOMAIN}${route.path}`,
    lastModified: new Date().toISOString(),
  }));
s
  const blogPosts = await getPostsList();

  const postsRoutes = await Promise.all(
    blogPosts.map(async (post) => {
      const { modifiedAt } = await getPostDate({ fileName: post });
      return {
        url: `${APP_DOMAIN}/blog/${post}`,
        lastModified: modifiedAt.toLocaleDateString()
      };
    })
  );


  return [...routes, ...postsRoutes];
}
