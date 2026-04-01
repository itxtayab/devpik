import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getToolBySlug, getToolsByCategory, CATEGORIES, ToolCategory } from "@/lib/tools-data";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { ToolRenderer } from "./tool-renderer";
import { StructuredData, generateSoftwareApplicationSchema, generateBreadcrumbSchema, generateFAQSchema } from "@/components/seo/StructuredData";
import { ToolFeedback } from "@/components/ToolFeedback";
import { ToolAnalytics } from "@/components/ToolAnalytics";

interface Props {
    params: Promise<{ category: string; tool: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const tool = getToolBySlug(params.tool);
    if (!tool || tool.category !== params.category) return {};

    return {
        title: tool.metaTitle,
        description: tool.metaDescription,
        alternates: {
            canonical: `/${tool.category}/${tool.slug}`,
        }
    };
}

export default async function ToolPage(props: Props) {
    const params = await props.params;
    const tool = getToolBySlug(params.tool);

    if (!tool || tool.category !== params.category) {
        notFound();
    }

    const category = CATEGORIES[tool.category as ToolCategory];
    const baseUrl = "https://www.devpik.com";

    const appSchema = generateSoftwareApplicationSchema(
        tool.name,
        tool.description,
        `${baseUrl}/${tool.category}/${tool.slug}`,
        tool.category
    );

    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: "Home", url: baseUrl },
        { name: category.name, url: `${baseUrl}/${tool.category}` },
        { name: tool.name, url: `${baseUrl}/${tool.category}/${tool.slug}` },
    ]);

    const faqSchema = tool.faqs.length > 0 ? generateFAQSchema(tool.faqs) : null;

    // Get related tools
    const relatedTools = tool.relatedSlugs
        .map(slug => getToolBySlug(slug))
        .filter(Boolean);

    return (
        <div className="flex flex-col gap-10 pb-12">
            <ToolAnalytics toolSlug={tool.slug} />
            <StructuredData data={appSchema} />
            <StructuredData data={breadcrumbSchema} />
            {faqSchema && <StructuredData data={faqSchema} />}

            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm font-medium text-muted-foreground whitespace-nowrap overflow-x-auto pb-2">
                <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
                <Link href={`/${tool.category}`} className="hover:text-foreground transition-colors">
                    {category.name}
                </Link>
                <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
                <span className="text-foreground">{tool.name}</span>
            </nav>

            {/* Hero Section */}
            <section className="flex flex-col space-y-4">
                <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">{tool.name}</h1>
                <p className="text-lg text-muted-foreground">{tool.description}</p>
            </section>

            {/* Tool Component Area */}
            <section className="bg-card border border-border/60 rounded-2xl shadow-sm p-4 md:p-8">
                <ToolRenderer slug={tool.slug} />
            </section>

            {/* How to Use Section */}
            <section className="prose prose-slate max-w-none">
                <h2>How to Use {tool.name}</h2>
                <ol className="space-y-2">
                    {tool.howToUse.map((step, index) => (
                        <li key={index}>{step}</li>
                    ))}
                </ol>
            </section>

            {/* About Section */}
            <section className="prose prose-slate max-w-none">
                <h2>About {tool.name}</h2>
                <p>{tool.about}</p>
            </section>

            {/* FAQ Section */}
            {tool.faqs.length > 0 && (
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
                    <div className="grid gap-4">
                        {tool.faqs.map((faq, index) => (
                            <div key={index} className="rounded-xl border border-border/60 bg-card p-5 shadow-sm">
                                <h3 className="text-base font-semibold text-foreground mb-2">{faq.question}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Related Tools Section */}
            {relatedTools.length > 0 && (
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight">Related Tools</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {relatedTools.map((related) => related && (
                            <Link
                                key={related.slug}
                                href={`/${related.category}/${related.slug}`}
                                className="group rounded-xl border border-border/60 bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
                            >
                                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{related.name}</h3>
                                <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{related.description}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Tool Feedback */}
            <ToolFeedback toolSlug={tool.slug} />
        </div>
    );
}
