import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Text Tools
const WordCounter = dynamic(() => import("@/components/tools/WordCounter"), { loading: () => <Loader /> });
const CaseConverter = dynamic(() => import("@/components/tools/CaseConverter"), { loading: () => <Loader /> });
const TextRepeater = dynamic(() => import("@/components/tools/TextRepeater"), { loading: () => <Loader /> });
const LoremIpsumGenerator = dynamic(() => import("@/components/tools/LoremIpsumGenerator"), { loading: () => <Loader /> });
const MarkdownConverter = dynamic(() => import("@/components/tools/MarkdownConverter"), { loading: () => <Loader /> });
const TextDiff = dynamic(() => import("@/components/tools/TextDiff"), { loading: () => <Loader /> });
const SlugGenerator = dynamic(() => import("@/components/tools/SlugGenerator"), { loading: () => <Loader /> });
const TextToHtml = dynamic(() => import("@/components/tools/TextToHtml"), { loading: () => <Loader /> });
const UnicodeTextConverter = dynamic(() => import("@/components/tools/UnicodeTextConverter"), { loading: () => <Loader /> });

// Developer Tools
const JsonFormatter = dynamic(() => import("@/components/tools/JsonFormatter"), { loading: () => <Loader /> });
const Base64Encoder = dynamic(() => import("@/components/tools/Base64Encoder"), { loading: () => <Loader /> });
const UrlEncoder = dynamic(() => import("@/components/tools/UrlEncoder"), { loading: () => <Loader /> });
const UuidGenerator = dynamic(() => import("@/components/tools/UuidGenerator"), { loading: () => <Loader /> });
const HtmlMinifier = dynamic(() => import("@/components/tools/HtmlMinifier"), { loading: () => <Loader /> });
const JwtDecoder = dynamic(() => import("@/components/tools/JwtDecoder"), { loading: () => <Loader /> });
const MermaidConverter = dynamic(() => import("@/components/tools/MermaidConverter"), { loading: () => <Loader /> });
const UnitConverter = dynamic(() => import("@/components/tools/UnitConverter"), { loading: () => <Loader /> });
const ColorConverter = dynamic(() => import("@/components/tools/ColorConverter"), { loading: () => <Loader /> });

const RegexTester = dynamic(() => import("@/components/tools/RegexTester"), { loading: () => <Loader /> });

// Network Tools
const SpeedTest = dynamic(() => import("@/components/tools/SpeedTest"), { loading: () => <Loader /> });
const IpCheck = dynamic(() => import("@/components/tools/IpCheck"), { loading: () => <Loader /> });
const DnsLookup = dynamic(() => import("@/components/tools/DnsLookup"), { loading: () => <Loader /> });

// Backend-Powered Tools
const CodeShare = dynamic(() => import("@/components/tools/CodeShare"), { loading: () => <Loader /> });
const UrlShortener = dynamic(() => import("@/components/tools/UrlShortener"), { loading: () => <Loader /> });

const Loader = () => (
    <div className="flex h-40 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
);

export function ToolRenderer({ slug }: { slug: string }) {
    switch (slug) {
        case "word-counter":
            return <WordCounter />;
        case "case-converter":
            return <CaseConverter />;
        case "text-repeater":
            return <TextRepeater />;
        case "lorem-ipsum-generator":
            return <LoremIpsumGenerator />;
        case "markdown-converter":
            return <MarkdownConverter />;
        case "text-diff":
            return <TextDiff />;
        case "slug-generator":
            return <SlugGenerator />;
        case "text-to-html":
            return <TextToHtml />;
        case "unicode-text-converter":
            return <UnicodeTextConverter />;
        case "json-formatter":
            return <JsonFormatter />;
        case "base64-encode-decode":
            return <Base64Encoder />;
        case "url-encode-decode":
            return <UrlEncoder />;
        case "uuid-generator":
            return <UuidGenerator />;
        case "html-minifier":
            return <HtmlMinifier />;
        case "jwt-decoder":
            return <JwtDecoder />;
        case "mermaid-converter":
            return <MermaidConverter />;
        case "unit-converter":
            return <UnitConverter />;
        case "color-converter":
            return <ColorConverter />;
        case "regex-tester":
            return <RegexTester />;
        case "speed-test":
            return <SpeedTest />;
        case "ip-check":
            return <IpCheck />;
        case "dns-lookup":
            return <DnsLookup />;
        case "code-share":
            return <CodeShare />;
        case "url-shortener":
            return <UrlShortener />;
        default:
            return <div>Tool implementation not found for slug: {slug}</div>;
    }
}
