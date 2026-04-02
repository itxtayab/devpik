import { Metadata } from "next";
import { StructuredData, generateBreadcrumbSchema } from "@/components/seo/StructuredData";
import { Shield, Server, Cookie, Globe, UserCheck, Mail, Lock, Eye, Database, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
    title: "Privacy Policy - DevPik",
    description: "Privacy Policy for DevPik. Learn how we handle your data with client-side processing and what information we collect.",
    alternates: { canonical: "https://www.devpik.com/privacy-policy" },
};

const sections = [
    {
        icon: Lock,
        title: "Client-Side Processing",
        content: `The vast majority of utilities provided on DevPik operate entirely on the client-side — within your web browser. This means the text, code, or data you input into our tools is processed locally on your device and is **never transmitted to, stored on, or viewed by our servers**. Your data remains strictly confidential and under your complete control.`,
    },
    {
        icon: Database,
        title: "Information We Collect",
        content: `We collect minimal data to operate and improve our services:`,
        list: [
            "**Log Data** — IP addresses, browser type, referring pages, date/time stamps, and page interaction data",
            "**Usage Analytics** — Anonymous usage statistics to understand which tools are most popular and improve our service",
            "**Cookies** — Essential cookies for site functionality and third-party cookies from advertising partners",
        ],
    },
    {
        icon: Eye,
        title: "How We Use Your Information",
        content: `The limited information we collect is used exclusively to:`,
        list: [
            "Analyze traffic trends and site performance",
            "Improve user experience and tool functionality",
            "Serve relevant advertisements to support free access to our tools",
            "Prevent abuse, fraud, and security threats",
        ],
    },
    {
        icon: Cookie,
        title: "Cookies & Advertising",
        content: `DevPik uses Google AdSense and related services to display advertisements. Google may use cookies (including DART cookies) to serve ads based on your visits to our site and other websites. You can opt out of personalized advertising by visiting [Google's Ad Settings](https://adssettings.google.com/). Third-party vendors may also use cookies, web beacons, and similar technologies to collect or receive information for ad targeting.`,
    },
    {
        icon: Globe,
        title: "Third-Party Services",
        content: `Our website may contain links to third-party websites or embed third-party services. We have no control over the content, privacy practices, or policies of these external services. We encourage you to review the privacy policies of any third-party sites you visit. Key third-party services we use include:`,
        list: [
            "**Google AdSense** — Advertising ([Privacy Policy](https://policies.google.com/privacy))",
            "**Google Analytics** — Usage analytics ([Privacy Policy](https://policies.google.com/privacy))",
            "**Vercel** — Hosting ([Privacy Policy](https://vercel.com/legal/privacy-policy))",
        ],
    },
    {
        icon: Shield,
        title: "Data Security",
        content: `We take reasonable precautions to protect the limited information we collect. Since our tools process data client-side, your sensitive data never leaves your browser. For the usage data we do collect, we implement industry-standard security measures to prevent unauthorized access, alteration, or disclosure.`,
    },
    {
        icon: UserCheck,
        title: "Your Rights",
        content: `Depending on your location, you may have rights regarding your personal information, including:`,
        list: [
            "The right to access the personal data we hold about you",
            "The right to request correction or deletion of your data",
            "The right to opt out of personalized advertising",
            "The right to withdraw consent at any time",
        ],
    },
    {
        icon: Server,
        title: "Children's Privacy",
        content: `DevPik does not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us so we can take appropriate action.`,
    },
    {
        icon: Mail,
        title: "Contact Us",
        content: `If you have questions about this Privacy Policy or wish to exercise your data rights, contact us at **founders@mergemain.com**.`,
    },
];

export default function PrivacyPolicyPage() {
    const breadcrumbSchema = generateBreadcrumbSchema([
        { name: "Home", url: "https://www.devpik.com" },
        { name: "Privacy Policy", url: "https://www.devpik.com/privacy-policy" },
    ]);

    return (
        <div className="pb-16">
            <StructuredData data={breadcrumbSchema} />

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#001a3d] via-[#002a5c] to-[#003F87] p-8 md:p-12 mb-10">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-blue-200 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
                        <Shield className="w-4 h-4" />
                        Your Privacy Matters
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">Privacy Policy</h1>
                    <p className="text-blue-200/80 text-lg max-w-2xl">
                        We believe in transparency. Here&apos;s exactly how DevPik handles your data — spoiler: most of it never leaves your browser.
                    </p>
                    <p className="text-blue-300/60 text-sm mt-4">Last Updated: February 2026</p>
                </div>
            </div>

            {/* Key Highlight */}
            <div className="max-w-4xl mx-auto mb-10">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <Lock className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-emerald-400 mb-1">Your Data Stays on Your Device</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            All DevPik tools run entirely in your browser. Your input data is <strong className="text-foreground">never sent to our servers</strong>. We only collect standard analytics data to improve the site.
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
                    By using DevPik, you consent to this Privacy Policy. If you disagree, please discontinue use of the site.
                </p>
            </div>
        </div>
    );
}
