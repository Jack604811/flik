import Image from "next/image";
import Link from "next/link";
import { BLOG_DESCRIPTION, BLOG_TITLE } from "@/app_settings";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllPosts } from "@/server/helpers/blog/get-all-posts";

interface Props {
    posts: Awaited<ReturnType<typeof getAllPosts>>;
}

export function PostsGrid({ posts }: Props) {
    return (
        <div className="py-6 px-6">


            <div className="grid grid-cols-1 mt-8 justify-items-center gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-screen-2xl mx-auto">
                {posts.map(
                    ({
                        fileName,
                        modifiedAt,
                        frontMatter: { title, description, category },
                        readingTime: { text: readingTimeText },
                    }) => (
                        <Card key={fileName} className="max-w-[460px] w-full ">
                            <CardContent className="px-4 py-3">
                                <Image
                                    src={"/assets/placeholder.svg"}
                                    alt=""
                                    width={435}
                                    height={233}
                                    className="w-full object-cover aspect-video "
                                />
                                <div className="flex flex-col gap-3">
                                    <Link href={`/blog/category/${category.toLowerCase()}`}>
                                        <Badge className="self-start mt-3">
                                            {category}
                                        </Badge>
                                    </Link>
                                    <Link href={`/blog/${fileName.split(".")[0]}`} >

                                        <h3 className="text-lg font-bold">{title}</h3>
                                        <p>{description}</p>
                                        <span className="text-sm text-foreground/60">
                                            Updated {new Date(modifiedAt).toLocaleDateString()} -{" "}
                                            {readingTimeText}
                                        </span>
                                    </Link>

                                </div>

                            </CardContent>
                        </Card>
                    )
                )}
            </div>
        </div >
    )
}