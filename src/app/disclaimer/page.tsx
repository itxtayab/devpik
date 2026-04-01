import { Metadata } from "next";
import Link from "next/link";
import { StructuredData, generateBreadcrumbSchema } from "@/components/seo/StructuredData";
import { AlertTriangle, ShieldOff, UserX, Calculator, Globe, RefreshCcw, Mail, Info, Stethoscope } from "lucide-react";

export const metadata: Metadata = {
    title: "Disclaimer - DevPik",
    description: "Disclaimer for DevPik. Understand the limitations, warranties, and terms of using our free online developer tools.",
};

const sections = [
    {
        icon: Info,
        title: "General Information",
        content: `The information and tools provided on DevPik (accessible at devpik.com) are for general informational and utility purposes only. While we strive to provide accurate and useful tools, we make no representations or guarantees about the completeness, reliability, or suitability of the information and tools provided.`,
    },
    {
        icon: ShieldOff,
        title: "No Warranties",
        content: `All tools on this Website are provided "as is" and "as available" without any warranties of any kind, either express or implied, including but not limited to:`,
        list: [
            "Implied warranties of merchantability or fitness for a particular purpose",
            "Non-infringement of intellectual property rights",
            "Accuracy, completeness, or reliability of tool outputs",
            "Uninterrupted, timely, secure, or error-free operation",
        ],
    },
    {
        icon: Stethoscope,
        title: "Not Professional Advice",
        content: `The tools and content on DevPik do not constitute professional, legal, medical, financial, or technical advice. Our tools are designed for general utility purposes. For any critical application — including legal documents, medical decisions, financial planning, or security implementations — always consult a qualified professional and independently verify all results.`,
    },
    {
        icon: AlertTriangle,
        title: "Limitation of Liability",
        content: `Under no circumstances shall DevPik, its owners, employees, or affiliates be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from:`,
        list: [
            "Use of, or inability to use, any tool on this Website",
            "Errors, inaccuracies, or omissions in tool results",
            "Loss of data, revenue, profits, or business opportunities",
            "Unauthorized access to or alteration of your data",
            "Any third-party actions related to your use of the Website",
        ],
    },
    {
        icon: Calculator,
        title: "Accuracy of Results",
        content: `Tools that perform encoding/decoding, text analysis, formatting, conversions, or any other calculations use industry-standard formulas and algorithms. However, results may be affected by:`,
        list: [
            "Floating-point precision limitations inherent to browsers",
            "Browser-specific behavior and rendering differences",
            "Edge cases in input data not covered by our algorithms",
            "Updates to standards or specifications after tool development",
        ],
        note: "Always verify critical results through independent sources before relying on them.",
    },
    {
        icon: UserX,
        title: "User Responsibility",
        content: `You acknowledge and agree that you use DevPik tools at your own risk. You are solely responsible for:`,
        list: [
            "Verifying the accuracy and suitability of tool outputs for your use case",
            "Ensuring compliance with applicable laws when using our tools",
            "Maintaining backup copies of any important data you process",
            "Understanding the limitations of browser-based processing",
        ],
    },
    {
        icon: Globe,
        title: "Third-Party Content & Links",
        content: `This Website may contain links to third-party websites, services, or advertisements. DevPik has no control over the content, privacy policies, or practices of any third-party sites and assumes no responsibility for them. The inclusion of any third-party link does not imply endorsement or recommendation by DevPik.`,
    },
    {
        icon: RefreshCcw,
        title: "Changes to This Disclaimer",
        content: `We reserve the right to modify this Disclaimer at any time without prior notice. Changes are effective immediately upon posting. Your continued use of the Website constitutes acceptance of the revised Disclaimer. We recommend reviewing this page periodically for updates.`,
    },
    {
        icon: Mail,
        title: "Contact Us",
        content: `If you have questions about this Disclaimer or need clarification on any point, please contact us at **founders@mergemain.com**.`,
    },
];

export default function DisclaimerPage() {
    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: "Home", url: "https://www.devpik.com" },
        { name: "Disclaimer", url: "https://www.devpik.com/disclaimer" },
    ]);

    return (
        <div className="pb-16">
            <StructuredData data={breadcrumbSchema} />

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2d1a0a] via-[#3d2a15] to-[#2d1a0a] p-8 md:p-12 mb-10">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-orange-200 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
                        <AlertTriangle className="w-4 h-4" />
                        Important Notice
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">Disclaimer</h1>
                    <p className="text-orange-200/80 text-lg max-w-2xl">
                        Understand the limitations and terms of using our free online developer tools before relying on their results.
                    </p>
                    <p className="text-orange-300/60 text-sm mt-4">Last Updated: February 2026</p>
                </div>
            </div>

            {/* Key Warning */}
            <div className="max-w-4xl mx-auto mb-10">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 flex items-start gap-4">
                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-red-400 mb-1">Use at Your Own Risk</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            DevPik tools are provided for convenience and general use. Results are <strong className="text-foreground">not guaranteed to be accurate</strong> and should not be relied upon for critical applications without independent verification.
                        </p>
                    </div>
                </div>
            </div>

            {/* Sections */}
            <div className="max-w-4xl mx-auto space-y-6">
                {sections.map((section, index) => {
                    const Icon = section.icon;
                    return (
                        <div
                            key={index}
                            className="group bg-card border border-border/60 rounded-xl p-6 md:p-8 hover:border-border transition-colors"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/15 transition-colors">
                                    <Icon className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-lg font-semibold text-foreground mb-3">
                                        {index + 1}. {section.title}
                                    </h2>
                                    <p className="text-muted-foreground text-[15px] leading-relaxed">
                                        {section.content}
                                    </p>
                                    {section.list && (
                                        <ul className="mt-3 space-y-2">
                                            {section.list.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2.5 text-muted-foreground text-[15px]">
                                                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full mt-2 shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {(section as any).note && (
                                        <p className="mt-3 text-sm text-amber-400/80 italic">
                                            ⚠️ {(section as any).note}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer Links */}
            <div className="max-w-4xl mx-auto mt-10 text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                    By using DevPik, you acknowledge that you have read and understood this Disclaimer.
                </p>
                <div className="flex justify-center gap-6 text-sm">
                    <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
                    <Link href="/terms" className="text-primary hover:underline">Terms &amp; Conditions</Link>
                    <Link href="/contact" className="text-primary hover:underline">Contact Us</Link>
                </div>
            </div>
        </div>
    );
}
