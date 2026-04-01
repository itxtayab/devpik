import { Metadata } from "next";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
    title: "Contact Us - DevPik",
    description: "Get in touch with the DevPik team. We are here to help.",
};

export default function ContactPage() {
    return (
        <div className="mx-auto max-w-4xl space-y-8 pb-12">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Contact Us</h1>
                <p className="text-xl text-muted-foreground">
                    Have a question, suggestion, or found a bug? We&apos;d love to hear from you.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Send us a message</h2>
                    <ContactForm />
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            You can also reach us directly via email. We aim to respond within 24-48 hours.
                        </p>
                        <div className="space-y-4">
                            <div>
                                <strong className="block text-sm text-muted-foreground">General Inquiries &amp; Support</strong>
                                <a href="mailto:founders@mergemain.com" className="text-primary hover:underline">
                                    founders@mergemain.com
                                </a>
                            </div>
                            <div>
                                <strong className="block text-sm text-muted-foreground">Business &amp; Partnerships</strong>
                                <a href="mailto:founders@mergemain.com" className="text-primary hover:underline">
                                    founders@mergemain.com
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <h3 className="font-semibold mb-2">Before reaching out</h3>
                        <p className="text-sm text-muted-foreground">
                            All our tools are free to use and do not require registration.
                            If a tool isn&apos;t working as expected, try clearing your browser cache or
                            disabling extensions that might interfere with JavaScript execution.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
