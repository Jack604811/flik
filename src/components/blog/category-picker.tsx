import Link from "next/link"
import { Badge } from "@/components/ui/badge";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react";

export function CategoryPicker({ categories }: { categories: string[] }) {
    return (
        <div className="max-w-screen-2xl mx-auto space-y-2 py-4 px-6 flex flex-col items-center md:items-start">
            <Collapsible>
                <CollapsibleTrigger className="flex gap-2">
                    <p className="underline">Select category</p>
                    <ChevronDown className="w-6 h-6" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="py-6">
                        {
                            categories.map(category => (
                                <Link key={category} href={`/blog/category/${category}`}>
                                    <Badge className="capitalize p-3 text-md">{category}</Badge>
                                </Link>
                            ))
                        }
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    )
}