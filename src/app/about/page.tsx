import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us - DevPik",
    description: "Learn more about DevPik — free, privacy-first developer tools and text utilities that run 100% in your browser.",
};

export default function AboutPage() {
    return (
        <div className="mx-auto max-w-4xl space-y-8 pb-12">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl">About DevPik</h1>
                <p className="text-xl text-muted-foreground">
                    Free, high-quality developer tools that respect your privacy and just work.
                </p>
            </div>

            <div className="prose prose-slate max-w-none space-y-6 text-lg leading-relaxed">
                <p>
                    Welcome to <strong>DevPik</strong>, your go-to destination for free, high-quality developer tools
                    and text utilities. Founded with the mission to solve everyday developer problems efficiently,
                    we provide a comprehensive suite of utilities designed for developers, writers, students, and
                    professionals alike.
                </p>

                <h2>Our Mission</h2>
                <p>
                    We believe that essential developer tools should be accessible to everyone, everywhere, without barriers.
                    That's why every tool on our platform is 100% free to use, requiring no account creation, no subscriptions,
                    and no hidden fees. From JSON formatting to regex testing, Base64 encoding to DNS lookups — DevPik
                    has you covered.
                </p>

                <h2>Privacy First</h2>
                <p>
                    Your data security is our top priority. Unlike many online utilities that send your data to remote servers
                    for processing, all of our tools operate <strong>entirely client-side within your browser</strong>.
                    This means your sensitive JSON files, private texts, and code snippets never leave your device.
                    No data is collected, stored, or transmitted — ever.
                </p>

                <h2>Fast & Reliable</h2>
                <p>
                    Built with cutting-edge web technologies, DevPik is designed for speed. We've eliminated unnecessary
                    bloat to ensure that our tools load instantly and process your requests in milliseconds, saving you
                    valuable time in your workflow.
                </p>
            </div>
        </div>
    );
}
