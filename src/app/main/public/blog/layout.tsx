import { BLOG_ENABLED } from "@/app-settings"
import { notFound } from "next/navigation"
export default function BlogLayout({
    children,
}: {
    children: React.ReactNode
}) {

    if (!BLOG_ENABLED) {
        return notFound();
    }

    return children
}