import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { CATEGORIES, getToolsByCategory, ToolCategory } from "@/lib/tools-data";
import { ArrowRight, Wrench, Sparkles, Code2, Type, Wifi, Braces, Paintbrush } from "lucide-react";

interface Props {
    params: Promise<{ category: string }>;
}

const CATEGORY_META: Partial<Record<string, { title: string; description: string }>> = {
    "css-tools": {
        title: "CSS & Design Tools — Free Online Converters & Calculators | DevPik",
        description: "Free online CSS and design tools for developers and designers. Convert between px, rem, em, inches, and more — all running 100% in your browser.",
    },
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const categoryId = params.category as ToolCategory;
    const category = CATEGORIES[categoryId];

    if (!category) return {};

    const custom = CATEGORY_META[categoryId];
    const title = custom?.title ?? `${category.name} - Free Online Tools`;
    const description = custom?.description ?? category.description;

    return {
        title,
        description,
        alternates: {
            canonical: `https://www.devpik.com/${categoryId}`,
        },
        openGraph: {
            title,
            description,
            url: `https://www.devpik.com/${categoryId}`,
            type: "website",
        },
    };
}

export const dynamicParams = false;

export function generateStaticParams() {
    return Object.keys(CATEGORIES).map((category) => ({
        category,
    }));
}

const CategoryIcon = ({ category }: { category: ToolCategory }) => {
    if (category === "text-tools") return <Type className="h-8 w-8 text-blue-500" />;
    if (category === "developer-tools") return <Code2 className="h-8 w-8 text-emerald-500" />;
    if (category === "network-tools") return <Wifi className="h-8 w-8 text-orange-500" />;
    if (category === "json-tools") return <Braces className="h-8 w-8 text-amber-500" />;
    if (category === "css-tools") return <Paintbrush className="h-8 w-8 text-pink-500" />;
    return <Wrench className="h-8 w-8 text-primary" />;
};

export default async function CategoryPage(props: Props) {
    const params = await props.params;
    const categoryId = params.category as ToolCategory;
    const category = CATEGORIES[categoryId];

    if (!category) {
        notFound();
    }

    const tools = getToolsByCategory(categoryId);

    return (
        <div className="flex flex-col gap-10 pb-12">
            <section className="flex flex-col space-y-4 rounded-3xl bg-slate-100 p-8 md:p-12 border border-border/50">
                <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-border/50">
                        <CategoryIcon category={categoryId} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{category.name}</h1>
                        <p className="mt-2 text-lg text-muted-foreground">{category.description}</p>
                    </div>
                </div>
            </section>

            <section>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {tools.map((tool) => (
                        <Link
                            key={tool.slug}
                            href={`/${categoryId}/${tool.slug}`}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            <div className="z-10 flex flex-col gap-3">
                                <h2 className="text-xl font-semibold leading-none tracking-tight group-hover:text-primary transition-colors">
                                    {tool.name}
                                </h2>
                                <p className="text-sm text-muted-foreground leading-relaxed shadow-sm pb-2">
                                    {tool.description}
                                </p>
                            </div>
                            <div className="z-10 mt-4 flex items-center text-sm font-medium text-primary">
                                Launch Tool
                                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
