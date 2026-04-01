import { Metadata } from "next";
import { StructuredData, generateBreadcrumbSchema } from "@/components/seo/StructuredData";
import { FileText, Wrench, ShieldAlert, Ban, Megaphone, RefreshCcw, Scale, Mail, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
    title: "Terms and Conditions - DevPik",
    description: "Terms and Conditions for using DevPik tools and services. Understand your rights and responsibilities.",
};

const sections = [
    {
        icon: FileText,
        title: "Acceptance of Terms",
        content: `By accessing and using DevPik ("the Website"), you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you must discontinue use of the Website immediately. These terms apply to all visitors, users, and others who access or use our services.`,
    },
    {
        icon: Wrench,
        title: "Services Provided",
        content: `DevPik provides a collection of free online utility tools ("the Services"). These tools include but are not limited to text manipulation, developer utilities, encoding/decoding tools, and content analysis tools. All tools are provided "as is" and "as available" without any warranties of any kind.`,
        list: [
            "Tools run entirely in your browser — no data is sent to our servers",
            "Results are generated algorithmically and may contain inaccuracies",
            "Services may be modified, suspended, or discontinued at any time",
            "Free access is supported by third-party advertising",
        ],
    },
    {
        icon: Ban,
        title: "Acceptable Use Policy",
        content: `When using DevPik, you agree NOT to:`,
        list: [
            "Use automated bots, scrapers, or scripts to access our tools at scale",
            "Attempt to circumvent security measures or exploit vulnerabilities",
            "Use the Website for any unlawful, illegal, fraudulent, or harmful purpose",
            "Impair the availability or accessibility of the Website for other users",
            "Artificially inflate ad impressions or engage in click fraud",
            "Reverse engineer, decompile, or attempt to extract the source code",
        ],
    },
    {
        icon: Scale,
        title: "Intellectual Property",
        content: `All content on DevPik — including text, graphics, logos, icons, code, and the design of the tools themselves — is the property of DevPik and is protected by copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without explicit written permission.`,
    },
    {
        icon: ShieldAlert,
        title: "Disclaimer of Warranties",
        content: `The tools and information on this Website are provided free of charge and without any warranties, express or implied, including but not limited to:`,
        list: [
            "Implied warranties of merchantability or fitness for a particular purpose",
            "Guarantees of accuracy, completeness, or reliability of results",
            "Uninterrupted or error-free operation of the services",
            "Freedom from viruses or other harmful components",
        ],
    },
    {
        icon: AlertTriangle,
        title: "Limitation of Liability",
        content: `Under no circumstances shall DevPik, its owners, employees, or affiliates be liable for any direct, indirect, incidental, special, consequential, or punitive damages — including but not limited to loss of data, revenue, or profits — arising from the use of, or inability to use, the tools or information on this Website, even if DevPik has been advised of the possibility of such damages.`,
    },
    {
        icon: Megaphone,
        title: "Advertising",
        content: `DevPik displays third-party advertisements (including Google AdSense) to keep our services free for all users. By using the Website, you acknowledge and agree that:`,
        list: [
            "Third-party ads may be displayed alongside our tools and content",
            "Ad content is controlled by third-party networks, not by DevPik",
            "You will not use ad-blockers in a way that prevents our revenue generation",
            "You will not engage in click fraud or artificially inflate ad metrics",
        ],
    },
    {
        icon: RefreshCcw,
        title: "Modifications to Terms",
        content: `DevPik reserves the right to revise these Terms and Conditions at any time without prior notice. Changes are effective immediately upon posting. Your continued use of the Website after changes constitutes acceptance of the revised terms. We recommend reviewing this page periodically for updates.`,
    },
    {
        icon: Mail,
        title: "Contact",
        content: `If you have questions about these Terms and Conditions, please contact us at **founders@mergemain.com**.`,
    },
];

export default function TermsPage() {
    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: "Home", url: "https://www.devpik.com" },
        { name: "Terms and Conditions", url: "https://www.devpik.com/terms" },
    ]);

    return (
        <div className="pb-16">
            <StructuredData data={breadcrumbSchema} />

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e] p-8 md:p-12 mb-10">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-purple-200 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
                        <FileText className="w-4 h-4" />
                        Legal Agreement
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">Terms &amp; Conditions</h1>
                    <p className="text-purple-200/80 text-lg max-w-2xl">
                        Please read these terms carefully before using DevPik. By using our services, you agree to be bound by these terms.
                    </p>
                    <p className="text-purple-300/60 text-sm mt-4">Last Updated: February 2026</p>
                </div>
            </div>

            {/* Summary Card */}
            <div className="max-w-4xl mx-auto mb-10">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <Scale className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-amber-400 mb-1">Quick Summary</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            DevPik is a free tool platform. Use our tools responsibly, don&apos;t scrape or abuse the service, and understand that results are provided without warranties. We display ads to keep everything free.
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
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer Note */}
            <div className="max-w-4xl mx-auto mt-10 text-center">
                <p className="text-sm text-muted-foreground">
                    By using DevPik, you agree to these Terms and Conditions. If you disagree, please discontinue use of the site.
                </p>
            </div>
        </div>
    );
}
