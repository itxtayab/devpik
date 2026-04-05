import { type Metadata } from "next";

export type ToolCategory = "text-tools" | "developer-tools" | "network-tools" | "json-tools";

export interface FAQ {
    question: string;
    answer: string;
}

export interface ToolItem {
    slug: string;
    name: string;
    description: string;
    category: ToolCategory;
    metaTitle: string;
    metaDescription: string;
    howToUse: string[];
    about: string;
    faqs: FAQ[];
    relatedSlugs: string[];
}

export const CATEGORIES: Record<ToolCategory, { name: string; description: string }> = {
    "text-tools": {
        name: "Text Tools",
        description: "Free online text formatting and processing tools.",
    },
    "developer-tools": {
        name: "Developer Tools",
        description: "Essential utilities for developers and programmers.",
    },
    "network-tools": {
        name: "Network Tools",
        description: "Test your connection speed, check your IP address, and analyze network performance.",
    },
    "json-tools": {
        name: "JSON Tools",
        description: "Free online JSON formatting, escaping, and data transformation tools for developers.",
    },
};

export const toolsData: ToolItem[] = [
    // ==================== TEXT TOOLS ====================
    {
        slug: "word-counter",
        name: "Word Counter",
        description: "Count words, characters, sentences and paragraphs instantly.",
        category: "text-tools",
        metaTitle: "Word Counter - Count Words & Characters Online Free",
        metaDescription: "Free online word counter tool. Count words, characters, sentences, and paragraphs instantly. Perfect for essays, blog posts, and social media.",
        howToUse: [
            "Paste or type your text into the input area above.",
            "View real-time statistics including word count, character count (with and without spaces), sentence count, and paragraph count.",
            "Use the 'Clear Text' button to reset and start a new count."
        ],
        about: "The Word Counter is a fast, reliable tool for counting words, characters, sentences, and paragraphs in any text. Whether you're writing a blog post with a specific word count target, crafting a tweet within character limits, or preparing an essay with length requirements, this tool provides instant, accurate statistics. Unlike other word counters, this tool processes everything locally in your browser — your text never leaves your device, ensuring complete privacy. It correctly handles edge cases like multiple spaces, line breaks, and special characters to give you the most accurate count possible. Writers, students, content marketers, and social media managers rely on word counters daily to ensure their content meets platform-specific length requirements.",
        faqs: [
            { question: "How does the word counter handle multiple spaces?", answer: "Our word counter intelligently collapses multiple consecutive spaces into one, so extra spacing won't inflate your word count. It uses the same word boundary detection used by professional writing software." },
            { question: "Does the character count include spaces?", answer: "We display both counts: total characters (including spaces) and characters without spaces. This is useful for platforms like Twitter that count all characters, as well as for SMS messages where space-free counts matter." },
            { question: "Can I use this for academic writing?", answer: "Absolutely! The word counter is perfect for essays, research papers, and dissertations where you need to meet minimum or maximum word count requirements. It also counts sentences and paragraphs for structure analysis." },
            { question: "Is my text stored or sent to a server?", answer: "No. The Word Counter runs 100% client-side in your browser. Your text is never transmitted to any server, ensuring complete privacy and data security." }
        ],
        relatedSlugs: ["case-converter", "text-repeater", "text-to-html", "slug-generator"]
    },
    {
        slug: "case-converter",
        name: "Case Converter",
        description: "Convert text between uppercase, lowercase, title case, and more.",
        category: "text-tools",
        metaTitle: "Case Converter - Change Text Case Online",
        metaDescription: "Easily convert text to UPPERCASE, lowercase, Title Case, or Sentence case online. Free, instant, and private.",
        howToUse: [
            "Paste or type your text into the input field.",
            "Click the desired case conversion button: UPPERCASE, lowercase, Title Case, Sentence case, or more.",
            "Copy the converted result to your clipboard with one click."
        ],
        about: "The Case Converter is an essential formatting tool that lets you instantly transform text between different cases. Convert to UPPERCASE for headings and emphasis, lowercase for standardizing text, Title Case for proper headings and titles, or Sentence case for natural-looking paragraphs. This tool is invaluable for writers editing copy that was accidentally typed in the wrong case, developers formatting variable names, and content creators standardizing text across platforms. Don't waste time manually retyping text — convert it instantly. All processing happens in your browser for maximum speed and privacy.",
        faqs: [
            { question: "What is Title Case?", answer: "Title Case capitalizes the first letter of each word while keeping the rest lowercase. For example, 'the quick brown fox' becomes 'The Quick Brown Fox'. It's the standard format for book titles, article headlines, and headings." },
            { question: "What's the difference between Sentence case and Title Case?", answer: "Sentence case only capitalizes the first letter of the first word (like a normal sentence), while Title Case capitalizes the first letter of every word. Sentence case is used for body text, while Title Case is used for titles and headings." },
            { question: "Can I convert text with special characters?", answer: "Yes! The Case Converter preserves all special characters, numbers, and punctuation while only changing the letter casing. Emojis, symbols, and non-Latin characters remain untouched." }
        ],
        relatedSlugs: ["word-counter", "unicode-text-converter", "slug-generator", "text-repeater"]
    },
    {
        slug: "text-repeater",
        name: "Text Repeater",
        description: "Repeat text or words multiple times quickly and easily.",
        category: "text-tools",
        metaTitle: "Text Repeater - Repeat Words Online",
        metaDescription: "A simple and free online tool to repeat any text or word multiple times instantly. Perfect for testing and content generation.",
        howToUse: [
            "Enter the text or word you want to repeat in the input field.",
            "Set the number of repetitions and choose a separator (new line, space, comma, or custom).",
            "Click 'Generate' to create the repeated text, then copy it to your clipboard."
        ],
        about: "The Text Repeater lets you duplicate any text string multiple times with customizable separators. This is perfect for generating test data, creating repeated patterns for design work, filling placeholders in templates, or producing bulk content for testing purposes. You can choose to separate repetitions with new lines, spaces, commas, or any custom separator of your choice. Developers frequently use text repeaters for stress-testing input fields, generating sample data for databases, and creating mock content. The tool handles large repetition counts efficiently, processing everything client-side without any server delays.",
        faqs: [
            { question: "Is there a limit to how many times I can repeat text?", answer: "The tool supports up to 10,000 repetitions. For very large counts, processing happens instantly in your browser since there's no server round-trip involved." },
            { question: "Can I use custom separators between repetitions?", answer: "Yes! You can choose from preset separators (new line, space, comma) or enter any custom separator text between repetitions. This makes it flexible for generating CSV data, code arrays, or formatted lists." },
            { question: "What are common use cases for a text repeater?", answer: "Common uses include generating test data for software development, creating filler content for design mockups, stress-testing input validation, generating bulk SQL insert statements, and creating repeated patterns for social media posts." }
        ],
        relatedSlugs: ["word-counter", "lorem-ipsum-generator", "case-converter", "text-to-html"]
    },
    {
        slug: "lorem-ipsum-generator",
        name: "Lorem Ipsum Generator",
        description: "Generate dummy placeholder text for your designs and layouts.",
        category: "text-tools",
        metaTitle: "Lorem Ipsum Generator - Dummy Text Online",
        metaDescription: "Free online Lorem Ipsum generator. Create placeholder text for web design, mockups, and printing layouts.",
        howToUse: [
            "Select the type of output you need: paragraphs, sentences, or words.",
            "Set the desired count using the number input.",
            "Click 'Generate' to create your Lorem Ipsum text, then copy it for use in your project."
        ],
        about: "The Lorem Ipsum Generator creates professional placeholder text for designers, developers, and content creators. Lorem Ipsum has been the industry's standard dummy text since the 1500s, used by typesetters and now by web designers and graphic artists worldwide. Our generator creates authentic Latin-based placeholder text that looks natural and professional in any layout. Use it for website mockups, print designs, presentations, or any project where you need realistic-looking text without the distraction of meaningful content. The generated text maintains proper sentence structure, paragraph breaks, and word distribution for a natural appearance.",
        faqs: [
            { question: "What is Lorem Ipsum?", answer: "Lorem Ipsum is dummy text that has been used as placeholder content in the printing and typesetting industry since the 1500s. It derives from 'De Finibus Bonorum et Malorum' by Cicero, a treatise on ethics written in 45 BC." },
            { question: "Why use Lorem Ipsum instead of regular text?", answer: "Lorem Ipsum allows designers and clients to focus on the visual design elements without being distracted by reading actual content. It also provides a realistic representation of how text will flow in the final design." },
            { question: "Can I generate a specific number of words?", answer: "Yes! You can generate Lorem Ipsum by paragraphs, sentences, or an exact number of words to precisely fit your layout requirements." }
        ],
        relatedSlugs: ["text-repeater", "word-counter", "markdown-converter", "text-to-html"]
    },
    {
        slug: "markdown-converter",
        name: "Markdown Converter",
        description: "Convert Markdown syntax to clean HTML instantly.",
        category: "text-tools",
        metaTitle: "Markdown to HTML Converter Online",
        metaDescription: "Fast, real-time Markdown to HTML converter with instant preview and clean HTML code output.",
        howToUse: [
            "Write or paste your Markdown text in the left editor panel.",
            "View the live HTML preview on the right panel in real-time as you type.",
            "Switch between rendered preview and raw HTML code view, then copy the output."
        ],
        about: "The Markdown Converter transforms Markdown syntax into clean, standards-compliant HTML in real-time. Markdown is the preferred writing format for developers, technical writers, and content creators because of its simplicity and readability. Our converter supports the full Markdown specification including headings, bold, italic, links, images, code blocks, lists, tables, and blockquotes. The live preview panel shows exactly how your content will render, while the code view gives you the raw HTML to paste into your website, CMS, or email templates. Whether you're writing README files, blog posts, or documentation, this tool makes the Markdown-to-HTML workflow seamless.",
        faqs: [
            { question: "What Markdown features are supported?", answer: "Our converter supports the full CommonMark specification including headings (H1-H6), bold, italic, strikethrough, links, images, ordered and unordered lists, code blocks with syntax highlighting, tables, blockquotes, and horizontal rules." },
            { question: "Can I use this for GitHub README files?", answer: "Yes! Our converter handles GitHub-Flavored Markdown (GFM) including tables, task lists, and fenced code blocks. This makes it perfect for previewing your README before committing." },
            { question: "Is the generated HTML clean and semantic?", answer: "Absolutely. The converter produces clean, semantic HTML5 without unnecessary inline styles or proprietary attributes. The output is ready to use in any web project or CMS." }
        ],
        relatedSlugs: ["text-to-html", "lorem-ipsum-generator", "html-minifier", "text-diff"]
    },
    {
        slug: "text-diff",
        name: "Text Diff / Compare",
        description: "Compare two pieces of text to find differences and similarities.",
        category: "text-tools",
        metaTitle: "Text Compare - Online Diff Tool",
        metaDescription: "Compare text online to find differences. A powerful text diff tool to check for modifications quickly.",
        howToUse: [
            "Paste the original text in the left panel and the modified text in the right panel.",
            "Click 'Compare' to instantly highlight the differences between the two texts.",
            "Review the color-coded diff output: green for additions, red for deletions, and unchanged text in the default color."
        ],
        about: "The Text Diff tool lets you compare two pieces of text side-by-side to instantly spot every difference. Whether you're reviewing code changes, comparing document versions, checking translations, or auditing content edits, this tool provides a clear, color-coded visualization of all insertions, deletions, and modifications. It uses the same diff algorithm trusted by professional version control systems like Git. The tool supports character-level and line-level comparison modes, making it suitable for both prose editing and code review. All comparison happens locally in your browser for speed and privacy — your documents never leave your device.",
        faqs: [
            { question: "How does the diff comparison work?", answer: "The tool uses an advanced longest-common-subsequence algorithm (the same one used in Git) to find the minimal set of changes between two texts. It then highlights additions in green and deletions in red for easy visual review." },
            { question: "Can I compare code files?", answer: "Yes! The tool works excellently for comparing code snippets, configuration files, or any structured text. It preserves whitespace and indentation, which is critical for code comparison." },
            { question: "Is there a size limit for text comparison?", answer: "The tool can handle large texts efficiently, but for optimal performance we recommend texts under 100,000 characters per panel. Since processing is done in your browser, performance depends on your device's capabilities." }
        ],
        relatedSlugs: ["json-compare", "word-counter", "markdown-converter", "case-converter"]
    },
    {
        slug: "slug-generator",
        name: "Slug Generator",
        description: "Convert any text or title into a clean, SEO-friendly URL slug.",
        category: "text-tools",
        metaTitle: "Slug Generator - Create SEO-Friendly URL Slugs Online",
        metaDescription: "Free online slug generator tool. Convert titles, headlines, or any text into clean, URL-safe slugs for SEO-friendly web addresses.",
        howToUse: [
            "Type or paste the title, headline, or any text you want to convert into the input field.",
            "Customize options: choose a separator (hyphen, underscore, or dot), toggle lowercase, remove numbers, or set a max length.",
            "The slug is generated in real-time below the input. Copy it and use it in your website URLs."
        ],
        about: "The Slug Generator converts any text into a clean, SEO-friendly URL slug that's safe to use in web addresses. A good URL slug is crucial for search engine optimization (SEO) because it tells both users and search engines what the page is about. Our generator automatically handles Unicode normalization (converting accented characters like 'é' to 'e'), removes special characters, and replaces spaces with your chosen separator. You can customize the separator style (hyphens for SEO, underscores for file names, dots for versioning), enforce lowercase, remove numbers, and set a maximum character length. The tool even previews the full URL so you can see exactly how your slug will look in the browser's address bar.",
        faqs: [
            { question: "What is a URL slug?", answer: "A URL slug is the part of a web address that comes after the domain name and identifies a specific page in a human-readable form. For example, in 'example.com/my-awesome-blog-post', the slug is 'my-awesome-blog-post'." },
            { question: "Why are hyphens preferred over underscores in slugs?", answer: "Google treats hyphens as word separators but treats underscores as word joiners. So 'my-blog-post' is seen as three words by Google, while 'my_blog_post' is treated as one word. Using hyphens is the SEO best practice." },
            { question: "Does the slug generator handle non-English characters?", answer: "Yes! The generator normalizes Unicode characters, converting accented letters like 'ü', 'ñ', and 'é' to their ASCII equivalents ('u', 'n', 'e'). This ensures your slugs are universally compatible." },
            { question: "What's the ideal slug length for SEO?", answer: "Google displays up to about 60 characters in search results. Most SEO experts recommend keeping slugs under 60 characters and using 3-5 descriptive words. Our max length option helps you enforce this limit." }
        ],
        relatedSlugs: ["word-counter", "case-converter", "text-to-html", "unicode-text-converter"]
    },
    {
        slug: "text-to-html",
        name: "Text to HTML Converter",
        description: "Convert plain text with line breaks into properly formatted HTML code.",
        category: "text-tools",
        metaTitle: "Text to HTML Converter - Plain Text to HTML Online",
        metaDescription: "Free online tool to convert plain text to HTML. Automatically wraps paragraphs, converts line breaks to tags, and generates clean HTML code.",
        howToUse: [
            "Paste or type your plain text in the left input panel. Use blank lines to separate paragraphs.",
            "Configure formatting options: enable paragraph wrapping (<p> tags), auto-linking of URLs, or whitespace preservation (<pre> tags).",
            "View the generated HTML code on the right panel. Toggle between code view and rendered preview, then copy the HTML."
        ],
        about: "The Text to HTML Converter transforms plain text into properly structured HTML code, automatically handling paragraph wrapping, line break conversion, and URL detection. This tool is essential for web developers, email marketers, and content managers who need to quickly convert text content into web-ready HTML. It intelligently detects paragraph boundaries from blank lines and wraps them in <p> tags, converts single line breaks to <br> tags, and can automatically convert URLs and email addresses into clickable links. The whitespace preservation mode wraps content in <pre> tags for code and formatted text. HTML entities are properly escaped to prevent rendering issues and XSS vulnerabilities.",
        faqs: [
            { question: "How are paragraphs detected?", answer: "The tool identifies paragraphs by looking for double line breaks (blank lines) between text blocks. Each block is wrapped in <p> tags. Single line breaks within a paragraph are converted to <br> tags." },
            { question: "Does it auto-detect and link URLs?", answer: "Yes! When the 'Auto-link URLs' option is enabled, the tool automatically detects http/https URLs and email addresses in your text and converts them to clickable <a> tags with proper target='_blank' and rel='noopener noreferrer' attributes." },
            { question: "Are HTML special characters escaped?", answer: "Yes, the converter properly escapes characters like <, >, &, and quotes to their HTML entity equivalents (&lt;, &gt;, &amp;, &quot;). This prevents broken rendering and protects against cross-site scripting (XSS)." }
        ],
        relatedSlugs: ["markdown-converter", "html-minifier", "slug-generator", "word-counter"]
    },
    {
        slug: "unicode-text-converter",
        name: "Unicode Text Converter",
        description: "Transform text into fancy Unicode fonts for social media and bios.",
        category: "text-tools",
        metaTitle: "Fancy Text Generator - Unicode Text Converter Online",
        metaDescription: "Free fancy text generator with 14+ Unicode font styles. Create bold, italic, cursive, gothic, and decorative text for Instagram, Twitter, and more.",
        howToUse: [
            "Type or paste your text in the input field at the top of the tool.",
            "Instantly see your text converted into 14 different Unicode font styles including Bold, Italic, Script, Fraktur, Double-Struck, Circled, and more.",
            "Click the copy button next to any style to copy it to your clipboard for use in social media bios, posts, and messages."
        ],
        about: "The Unicode Text Converter transforms ordinary text into stylish Unicode characters that work across all platforms — Instagram, Twitter/X, Facebook, TikTok, WhatsApp, Discord, and more. Unlike regular fonts that only work on specific websites, Unicode characters are part of the universal character standard, meaning they display correctly everywhere that supports text. Choose from 14 unique styles including 𝐁𝐨𝐥𝐝, 𝑰𝒕𝒂𝒍𝒊𝒄, 𝒮𝒸𝓇𝒾𝓅𝓉, 𝔉𝔯𝔞𝔨𝔱𝔲𝔯 (Gothic), 𝕆𝕦𝕥𝕝𝕚𝕟𝕖, Ⓒⓘⓡⓒⓛⓔⓓ, 🅂🅀🅄🄰🅁🄴🄳, S̷t̷r̷i̷k̷e̷t̷h̷r̷o̷u̷g̷h̷, and U̲n̲d̲e̲r̲l̲i̲n̲e̲d̲. Each style has a one-click copy button for instant use. This is the go-to tool for creating eye-catching social media bios, unique usernames, and decorative text without any software installation.",
        faqs: [
            { question: "Will these fancy fonts work on Instagram and Twitter?", answer: "Yes! Unicode characters are universally supported across all major social media platforms including Instagram bios and captions, Twitter/X posts, Facebook, TikTok, WhatsApp, Telegram, and Discord. They work because they're actual Unicode characters, not custom fonts." },
            { question: "Why do some characters not convert?", answer: "Unicode mathematical symbol fonts only cover the Latin alphabet (A-Z, a-z) and sometimes digits (0-9). Numbers, punctuation, and non-Latin characters (like Chinese, Arabic, or Cyrillic) will remain unchanged in the converted output." },
            { question: "Are these characters accessible for screen readers?", answer: "Screen readers may have difficulty interpreting some Unicode styles, particularly Fraktur and Circled characters. For accessibility, we recommend using these styles sparingly for decorative purposes rather than for important information." },
            { question: "What's the difference between this and changing fonts?", answer: "Regular fonts only change how text looks on a specific website or app. Unicode characters are part of the universal text standard — they look the same everywhere they're pasted. That's why they work on platforms that don't allow custom fonts." }
        ],
        relatedSlugs: ["case-converter", "slug-generator", "word-counter", "text-repeater"]
    },

    // ==================== DEVELOPER TOOLS ====================
    {
        slug: "json-formatter",
        name: "JSON Formatter",
        description: "Format, beautify, validate and convert JSON data with syntax highlighting, tree view, and auto-fix.",
        category: "developer-tools",
        metaTitle: "JSON Formatter & Validator - Format, Convert & Fix JSON Online | DevPik",
        metaDescription: "Free online JSON formatter with syntax highlighting, tree view, JSON to XML/CSV/YAML conversion, auto-fix, file upload, search, and statistics. 100% client-side.",
        howToUse: [
            "Paste your JSON into the input panel, drag & drop a .json file, or click Upload to import from your device.",
            "Click 'Format' to beautify with syntax highlighting, 'Minify' to compress, or 'Fix JSON' to auto-repair common errors like trailing commas and single quotes.",
            "Switch between Code view (with color-coded syntax) and Tree view (interactive expandable/collapsible hierarchy) to explore your data.",
            "Use 'Convert' to transform JSON to XML, CSV, or YAML format. Download or copy the output when ready.",
            "Toggle 'Auto' mode to format on paste, use Search to find keys/values, and check the Statistics panel for data insights."
        ],
        about: "The JSON Formatter is a professional-grade JSON toolkit for developers. Beyond basic formatting and validation, it offers syntax highlighting with color-coded keys, strings, numbers, booleans, and nulls. The interactive tree view lets you explore JSON hierarchies with expand/collapse controls, type badges, and click-to-copy JSON paths. The auto-fix feature intelligently repairs common JSON errors including trailing commas, single quotes, and unquoted keys. Convert JSON to XML, CSV, or YAML with a single click. Upload JSON files via file picker or drag-and-drop, and download formatted output. The statistics panel shows key counts, nesting depth, data type distribution, and file size. Auto-format mode processes JSON on paste, and the search feature highlights matching keys and values across both code and tree views. Your data is saved locally between sessions, and all processing happens 100% client-side — no data ever leaves your browser.",
        faqs: [
            { question: "What types of JSON errors can this detect and fix?", answer: "The formatter validates all JSON syntax and provides detailed error messages. The 'Fix JSON' feature auto-repairs common issues like trailing commas, single quotes instead of double quotes, and unquoted property names. For other errors, you'll get precise messages to help you debug." },
            { question: "What formats can I convert JSON to?", answer: "You can convert JSON to XML (with proper element nesting and escaping), CSV (flattens arrays of objects with header detection), and YAML (with correct indentation and type handling). Each conversion preserves data integrity." },
            { question: "How does the tree view work?", answer: "The tree view displays your JSON as an interactive hierarchy. Click nodes to expand/collapse, see type badges (Array[5], Object{3}), and click any node to copy its JSON path. Use 'Expand All' and 'Collapse All' buttons, and the search highlights matching nodes." },
            { question: "Is my JSON data secure?", answer: "100% secure. Everything processes locally in your browser — no server requests. Your data is saved in localStorage for convenience between sessions but never transmitted. Safe for API keys, tokens, and sensitive configuration." },
            { question: "Can I upload and download JSON files?", answer: "Yes! Click 'Upload' or drag-and-drop a .json file directly onto the input area. After formatting or converting, click 'Download' to save the result as a file." }
        ],
        relatedSlugs: ["json-minifier", "json-compare", "json-escape", "json-unescape"]
    },
    {
        slug: "base64-encode-decode",
        name: "Base64 Encoder / Decoder",
        description: "Encode text to Base64 format or decode from it.",
        category: "developer-tools",
        metaTitle: "Base64 Encode and Decode Online Tool",
        metaDescription: "Fast and secure online tool to encode and decode text to and from Base64 format. Client-side processing for privacy.",
        howToUse: [
            "Enter or paste the text you want to encode in the input field.",
            "Click 'Encode' to convert your text to Base64 format, or paste a Base64 string and click 'Decode' to convert it back to readable text.",
            "Copy the result with the copy button. The tool handles UTF-8 text correctly."
        ],
        about: "The Base64 Encoder/Decoder converts text to and from Base64 encoding instantly. Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format, widely used in web development, email protocols (MIME), data URLs, and API authentication. Developers use Base64 to embed images in CSS/HTML (data URIs), encode API credentials for HTTP Basic Authentication, transmit binary data through text-only channels, and encode/decode JWT token payloads. Our tool handles UTF-8 text correctly, ensuring that international characters, emojis, and special symbols are properly encoded and decoded. All processing happens client-side for security.",
        faqs: [
            { question: "What is Base64 encoding used for?", answer: "Base64 is used to safely transmit binary data through text-based protocols. Common uses include embedding images in HTML/CSS, encoding email attachments (MIME), HTTP Basic Authentication headers, encoding JWT payloads, and storing binary data in JSON or XML." },
            { question: "Does Base64 encoding make data secure?", answer: "No! Base64 is NOT encryption. It's a reversible encoding scheme that anyone can decode. Never use Base64 to protect sensitive information. Use proper encryption (AES, RSA) for security." },
            { question: "Why does Base64 increase file size?", answer: "Base64 encoding increases data size by approximately 33% because it represents every 3 bytes of binary data as 4 ASCII characters. This trade-off is accepted for the convenience of text-safe transmission." }
        ],
        relatedSlugs: ["url-encode-decode", "jwt-decoder", "json-formatter", "uuid-generator"]
    },
    {
        slug: "url-encode-decode",
        name: "URL Encoder / Decoder",
        description: "Safely encode URL components or decode URL-encoded strings.",
        category: "developer-tools",
        metaTitle: "URL Encoder & Decoder - Online Tool",
        metaDescription: "Free online URL encoder and decoder tool to encode reserved characters in URLs easily and decode percent-encoded strings.",
        howToUse: [
            "Enter the URL or text you want to encode in the input field.",
            "Click 'Encode' to convert special characters to percent-encoded format (%20, %3A, etc.), or paste an encoded URL and click 'Decode' to make it readable.",
            "Copy the result with the copy button."
        ],
        about: "The URL Encoder/Decoder converts text to and from percent-encoded (URL-encoded) format. URL encoding replaces unsafe characters with a '%' followed by their hexadecimal value, ensuring that URLs are transmitted correctly across the internet. This is essential when building query strings, passing parameters to APIs, encoding form data, or debugging URLs with special characters. Reserved characters like spaces, ampersands (&), question marks (?), equals signs (=), and hash symbols (#) have special meaning in URLs and must be encoded when used as data values. Our tool supports both `encodeURIComponent` (for query parameters) and full URL encoding, handling all international characters and emoji properly.",
        faqs: [
            { question: "When do I need to URL encode?", answer: "You need URL encoding whenever you're passing data through URLs that contains special characters — spaces become %20, ampersands become %26, etc. This is critical for query strings, form submissions, and API requests." },
            { question: "What's the difference between encodeURI and encodeURIComponent?", answer: "encodeURI encodes a full URL but preserves characters that have special meaning (like / and ?). encodeURIComponent encodes everything including those special characters, making it suitable for encoding individual query parameter values." },
            { question: "Why do spaces appear as %20 or +?", answer: "In URL encoding, spaces can be represented as %20 (standard percent-encoding) or as + (application/x-www-form-urlencoded format used in HTML forms). Both are valid; %20 is more universal and recommended for path segments." }
        ],
        relatedSlugs: ["base64-encode-decode", "json-formatter", "slug-generator", "html-minifier"]
    },
    {
        slug: "uuid-generator",
        name: "UUID / GUID Generator",
        description: "Generate random UUIDs (Universally Unique Identifiers) instantly.",
        category: "developer-tools",
        metaTitle: "Random UUID & GUID Generator Online",
        metaDescription: "Free online tool to quickly generate secure random UUIDs (v4) and GUIDs for your applications and databases.",
        howToUse: [
            "Click the 'Generate' button to create a new random UUID (Version 4).",
            "Use the bulk generate option to create multiple UUIDs at once — specify the number you need.",
            "Copy individual UUIDs or the entire batch to your clipboard with one click."
        ],
        about: "The UUID Generator creates cryptographically random Version 4 UUIDs (Universally Unique Identifiers) that are safe to use as database primary keys, session tokens, file identifiers, and tracking IDs. UUIDs are 128-bit identifiers presented as 32 hexadecimal digits in the format 8-4-4-4-12 (e.g., 550e8400-e29b-41d4-a716-446655440000). Version 4 UUIDs are generated using random or pseudo-random numbers, making collisions virtually impossible — the probability of generating two identical UUIDs is astronomically low. Our generator uses the browser's built-in crypto.getRandomValues() for true cryptographic randomness. Batch generation lets you create multiple UUIDs at once for database seeding, test data, or configuration files.",
        faqs: [
            { question: "What's the difference between UUID and GUID?", answer: "UUID (Universally Unique Identifier) and GUID (Globally Unique Identifier) are essentially the same thing. UUID is the standard term used in most programming contexts, while GUID is the term commonly used in Microsoft technologies." },
            { question: "Are the generated UUIDs truly unique?", answer: "Version 4 UUIDs use 122 bits of randomness, giving over 5.3 × 10^36 possible values. The probability of generating a duplicate is approximately 1 in 2.71 quintillion — effectively zero for any practical purpose." },
            { question: "Can I use these UUIDs as database primary keys?", answer: "Yes! UUIDs are widely used as primary keys in distributed databases. They allow records to be created independently on different servers without coordination. However, consider that UUID primary keys use more storage than auto-incrementing integers." }
        ],
        relatedSlugs: ["json-formatter", "base64-encode-decode", "jwt-decoder", "url-encode-decode"]
    },
    {
        slug: "html-minifier",
        name: "HTML Minifier",
        description: "Compress HTML code by removing whitespace and comments.",
        category: "developer-tools",
        metaTitle: "HTML Minifier & Compressor Online",
        metaDescription: "Minify HTML code online to reduce file size and improve website loading speed. Remove comments, whitespace, and optimize markup.",
        howToUse: [
            "Paste your HTML code in the left input panel.",
            "Configure minification options: remove comments, collapse whitespace, remove optional tags, etc.",
            "Click 'Minify' to compress your HTML. View the size reduction percentage and copy the minified output."
        ],
        about: "The HTML Minifier compresses your HTML code by removing unnecessary whitespace, comments, and redundant attributes to reduce file size and improve page load speed. Minified HTML loads faster because browsers need to download fewer bytes, which directly impacts Core Web Vitals and SEO rankings. Our minifier strips HTML comments, collapses consecutive whitespace into single spaces, removes whitespace around block-level elements, and trims trailing spaces. The result is functionally identical HTML that's significantly smaller. This tool is essential for web developers optimizing production builds, especially for sites not using a build tool with built-in minification. Every kilobyte saved compounds across millions of page views, reducing bandwidth costs and improving user experience.",
        faqs: [
            { question: "How much can HTML minification reduce file size?", answer: "Typical HTML files see 10-30% size reduction through minification. The savings depend on how much whitespace and comments your original HTML contains. Template-generated HTML with heavy indentation often sees even greater reductions." },
            { question: "Does minification affect how the page renders?", answer: "No! Minification only removes characters that browsers ignore anyway (extra whitespace, comments). The rendered output is visually identical. However, it does make the source code harder for humans to read, which is why minification is only recommended for production builds." },
            { question: "Should I minify HTML in addition to CSS and JavaScript?", answer: "Yes! While CSS and JavaScript minification typically provides larger savings, HTML minification adds an additional 10-30% size reduction that compounds across your entire site. Every optimization matters for page speed and SEO." }
        ],
        relatedSlugs: ["json-formatter", "text-to-html", "markdown-converter", "url-encode-decode"]
    },
    {
        slug: "jwt-decoder",
        name: "JWT Decoder",
        description: "Decode JSON Web Tokens and view header and payload data.",
        category: "developer-tools",
        metaTitle: "JWT Decoder & Viewer Online",
        metaDescription: "Free online tool to securely decode JWT tokens and inspect claims and payload information without sending to server.",
        howToUse: [
            "Paste your complete JWT token (the long string with two dots) into the input field.",
            "The tool automatically decodes and displays the Header (algorithm, type) and Payload (claims, expiration, issuer) in formatted JSON.",
            "Review the decoded information including token expiration time, issuer, subject, and custom claims."
        ],
        about: "The JWT Decoder lets you inspect and debug JSON Web Tokens (JWTs) without sending them to any server. JWTs are the standard for authentication and information exchange in modern web applications, used by OAuth 2.0, OpenID Connect, and virtually every API that requires authentication. Our decoder splits the token into its three components — Header, Payload, and Signature — and displays each as formatted, readable JSON. The Header reveals the signing algorithm (HS256, RS256, etc.) and token type. The Payload shows all claims including standard ones like expiration (exp), issued-at (iat), issuer (iss), and audience (aud), plus any custom claims. This is invaluable for debugging authentication issues, verifying token contents during development, and understanding API security flows. Crucially, all decoding happens client-side — your tokens never leave your browser.",
        faqs: [
            { question: "Is it safe to decode JWTs in this tool?", answer: "Yes! JWT decoding happens entirely in your browser. Your tokens are never sent to any server. This is critical because JWTs often contain sensitive information like user IDs, roles, and permissions." },
            { question: "Does this tool verify the JWT signature?", answer: "This tool decodes and displays the token's contents but does not verify the cryptographic signature (which requires the secret key or public key). It's designed for inspection and debugging, not signature validation." },
            { question: "What are common JWT claims?", answer: "Standard claims include: exp (expiration time), iat (issued at), nbf (not before), iss (issuer), sub (subject/user ID), aud (audience), and jti (unique token ID). Applications also add custom claims like roles, permissions, and user metadata." },
            { question: "Why does my JWT have three parts separated by dots?", answer: "A JWT consists of three Base64URL-encoded parts separated by dots: the Header (algorithm info), the Payload (claims/data), and the Signature (cryptographic verification). This structure allows the token to be self-contained and verifiable." }
        ],
        relatedSlugs: ["base64-encode-decode", "json-formatter", "uuid-generator", "url-encode-decode"]
    },
    {
        slug: "mermaid-converter",
        name: "Mermaid Diagram Converter",
        description: "Render Mermaid diagram code into downloadable PNG or SVG images.",
        category: "developer-tools",
        metaTitle: "Mermaid Diagram to Image Converter - PNG & SVG Online",
        metaDescription: "Free online Mermaid diagram converter. Write Mermaid code and instantly render flowcharts, sequence diagrams, and more as downloadable PNG or SVG images.",
        howToUse: [
            "Write or paste your Mermaid syntax code in the left editor panel. Use the quick examples dropdown for common diagram types.",
            "Click 'Render Diagram' to generate the visual diagram in the preview panel on the right.",
            "Download the rendered diagram as a high-resolution PNG image or scalable SVG file, or copy the SVG code directly."
        ],
        about: "The Mermaid Diagram Converter transforms Mermaid syntax code into beautiful, downloadable diagrams. Mermaid is a powerful 'diagrams as code' tool that lets you create flowcharts, sequence diagrams, class diagrams, state diagrams, Gantt charts, pie charts, and more — all from simple text descriptions. This is the preferred approach for technical documentation because diagrams can be version-controlled with Git, reviewed in pull requests, and maintained alongside code. Our converter renders your Mermaid code into SVG diagrams in real-time, and lets you download them as high-resolution PNG images (2x resolution for Retina displays) or scalable SVG files for use in documentation, presentations, README files, and wikis. Quick example templates help you get started with each diagram type.",
        faqs: [
            { question: "What diagram types does Mermaid support?", answer: "Mermaid supports flowcharts (graph TD/LR), sequence diagrams, class diagrams, state diagrams, entity-relationship diagrams, Gantt charts, pie charts, user journey maps, and Git graphs. Our tool supports all Mermaid diagram types." },
            { question: "Should I download PNG or SVG?", answer: "SVG is scalable and looks sharp at any size — ideal for documentation, wikis, and web pages. PNG is a raster format better for presentations, emails, and chat messages. Our PNG export uses 2x resolution for crisp display on Retina screens." },
            { question: "Can I use Mermaid diagrams in GitHub?", answer: "Yes! GitHub natively supports Mermaid diagrams in Markdown files. Just wrap your Mermaid code in a code block with the 'mermaid' language identifier. Our tool is perfect for previewing diagrams before committing." },
            { question: "What is 'Diagrams as Code'?", answer: "Diagrams as Code is the practice of defining diagrams using text/code instead of visual drag-and-drop editors. Benefits include version control, code review, automation, and consistency. Mermaid is the most popular tool for this approach." }
        ],
        relatedSlugs: ["json-formatter", "markdown-converter", "html-minifier", "color-converter"]
    },
    {
        slug: "unit-converter",
        name: "Unit Converter",
        description: "Convert between all units: length, weight, temperature, data, speed, time, volume, and more.",
        category: "developer-tools",
        metaTitle: "Unit Converter - Convert Length, Weight, Temperature & More Online",
        metaDescription: "Free all-in-one unit converter. Convert distance, weight, temperature, data storage, speed, time, volume, area, and calculate tips instantly.",
        howToUse: [
            "Select the conversion category from the tabs at the top: Length, Weight, Temperature, Data, Speed, Time, Volume, Area, or Tip Calculator.",
            "Choose the 'From' and 'To' units using the dropdown menus, then enter the value you want to convert.",
            "The result appears instantly. Use the swap button to reverse the conversion direction, or copy the result to your clipboard."
        ],
        about: "The Unit Converter is a comprehensive, all-in-one tool that handles conversions across 9 different categories with over 80 unit types. Convert between metric and imperial measurements for length (millimeters to miles), weight (grams to pounds), temperature (Celsius, Fahrenheit, Kelvin), digital data (bytes to terabytes, bits to megabits), speed (km/h to mph to knots), time (milliseconds to years), volume (milliliters to gallons, teaspoons to liters), and area (square meters to acres). The tool also includes a full-featured Tip Calculator with bill splitting, percentage presets, and per-person calculations. Every conversion uses precise mathematical formulas with smart number formatting that switches between decimal and scientific notation based on the magnitude of the result. All calculations happen instantly in your browser — no server, no delays, no rounding errors.",
        faqs: [
            { question: "How accurate are the conversions?", answer: "Our converter uses the official SI conversion factors with full floating-point precision (up to 12 significant digits). Results are formatted using smart precision to avoid unnecessary trailing zeros while maintaining accuracy." },
            { question: "Does the temperature converter handle negative values?", answer: "Yes! Temperature conversion correctly handles negative values for all three scales (Celsius, Fahrenheit, Kelvin). For example, -40°C correctly converts to -40°F — the point where both scales intersect." },
            { question: "What data units are supported?", answer: "We support both binary (1 KB = 1024 bytes) and bit-based units: Byte, Kilobyte, Megabyte, Gigabyte, Terabyte, Petabyte, Bit, Kilobit, and Megabit. This covers all common use cases from file sizes to network speeds." },
            { question: "How does the tip calculator work?", answer: "Enter your bill amount, select a tip percentage (or use presets for 10%, 15%, 18%, 20%, 25%), and optionally split between multiple people. The calculator shows the tip amount, total, per-person cost, and per-person tip." }
        ],
        relatedSlugs: ["color-converter", "uuid-generator", "json-formatter", "base64-encode-decode"]
    },
    {
        slug: "color-converter",
        name: "Color Code Converter",
        description: "Convert and pick colors between HEX, RGB, HSL, and CMYK formats.",
        category: "developer-tools",
        metaTitle: "Color Converter - HEX to RGB, HSL, CMYK Online Tool",
        metaDescription: "Free online color converter with visual picker. Convert between HEX, RGB, HSL, and CMYK color formats instantly with live preview.",
        howToUse: [
            "Enter a color value in any format — type a HEX code (#FF5733), set RGB values (255, 87, 51), adjust HSL values, or enter CMYK percentages.",
            "All other color formats update automatically and instantly. Use the visual color picker or HSL sliders for intuitive color selection.",
            "Copy any color format value with the copy button next to each format. The large color preview shows your selected color in context."
        ],
        about: "The Color Code Converter is a bi-directional color format converter and picker that lets you seamlessly work across HEX, RGB, HSL, and CMYK color spaces. Web developers, designers, and print professionals constantly need to convert between these formats: HEX for CSS and web design, RGB for digital screens, HSL for intuitive color manipulation, and CMYK for print production. Our tool provides a large visual color preview with a native color picker, individual input fields for each format, and interactive HSL sliders for fine-tuning hue, saturation, and lightness. Every input is bi-directional — change any value in any format and all others update in real-time. The one-click copy buttons next to each format make it effortless to grab the exact color code you need for your project.",
        faqs: [
            { question: "What's the difference between HEX and RGB?", answer: "HEX and RGB represent the same color model (Red, Green, Blue) in different notations. HEX uses hexadecimal (#FF5733), while RGB uses decimal values (255, 87, 51). They're interchangeable for digital screens — HEX is preferred in CSS shorthand, while RGB is used in CSS functions and design tools." },
            { question: "When should I use HSL vs RGB?", answer: "HSL (Hue, Saturation, Lightness) is more intuitive for humans because you can easily create lighter/darker tints or more/less saturated versions by adjusting a single value. RGB is more technical and maps directly to screen hardware. Use HSL for design work and RGB/HEX for code." },
            { question: "What is CMYK used for?", answer: "CMYK (Cyan, Magenta, Yellow, Key/Black) is the color model used in printing. When designing for print materials (business cards, brochures, posters), you need CMYK values. Note that the RGB-to-CMYK conversion is approximate since CMYK has a smaller color gamut than RGB." },
            { question: "Can I use the browser's native color picker?", answer: "Yes! Click the 'Pick Color' button on the color preview to open your browser's native color picker. This lets you visually select any color, and all format fields will update automatically." }
        ],
        relatedSlugs: ["mermaid-converter", "json-formatter", "uuid-generator", "unit-converter"]
    },
    {
        slug: "regex-tester",
        name: "Regex Tester",
        description: "Test and debug regular expressions in real-time with match highlighting.",
        category: "developer-tools",
        metaTitle: "Free Regex Tester & Debugger - Test Regular Expressions Online | DevPik",
        metaDescription: "Test and debug regular expressions in real-time. See matches highlighted instantly, with match details, group captures, and a quick reference cheat sheet. Free, no signup required.",
        howToUse: [
            "Enter your regular expression pattern in the regex input field.",
            "Select the appropriate flags (global, case insensitive, multiline, etc.).",
            "Type or paste your test string in the textarea below.",
            "View highlighted matches instantly, with detailed match information including capture groups and positions."
        ],
        about: "The Regex Tester is a free online tool for testing and debugging regular expressions in real-time. As you type your pattern and test string, matches are highlighted instantly with detailed information about each match including capture groups and character positions. Whether you're validating email formats, parsing log files, or extracting data from text, this tool helps you build and verify regex patterns quickly. Includes a built-in cheat sheet for quick reference.",
        faqs: [
            { question: "What regex flavor does this tool use?", answer: "This tool uses JavaScript's native RegExp engine, which supports ECMAScript regex syntax including lookahead, lookbehind, named groups, and Unicode properties." },
            { question: "Does my data leave my browser?", answer: "No. All regex processing happens entirely in your browser using JavaScript. No data is sent to any server." },
            { question: "What do the regex flags mean?", answer: "g (global) finds all matches instead of stopping at the first. i (case insensitive) ignores letter casing. m (multiline) makes ^ and $ match line starts/ends. s (dotAll) makes . match newlines. u (unicode) enables full Unicode matching." },
            { question: "Can I test regex for other languages like Python or PHP?", answer: "This tool uses JavaScript regex syntax, which is very similar to most languages. However, some advanced features like possessive quantifiers or recursive patterns (available in PCRE/PHP) are not supported in JavaScript." },
            { question: "Is there a limit on the test string size?", answer: "There's no hard limit, but very large strings (100,000+ characters) may slow down real-time highlighting. For best performance, test with representative samples." }
        ],
        relatedSlugs: ["json-formatter", "slug-generator", "text-diff", "code-share"]
    },
    // ==================== NETWORK TOOLS ====================
    {
        slug: "speed-test",
        name: "Internet Speed Test",
        description: "Measure your download speed, upload speed, and ping latency instantly.",
        category: "network-tools",
        metaTitle: "Internet Speed Test - Check Your Connection Speed Free",
        metaDescription: "Test your internet speed instantly. Measure download speed, upload speed, and ping latency. Free, accurate, and runs directly in your browser.",
        howToUse: [
            "Click the 'Start Test' button to begin measuring your internet connection.",
            "The test will automatically run through three phases: ping (latency), download speed, and upload speed.",
            "Wait for all phases to complete — results are displayed in real-time as each phase finishes.",
            "Review your results showing ping in milliseconds, and download/upload speeds in Mbps. Click 'Test Again' to re-run."
        ],
        about: "The Internet Speed Test measures your real-world connection performance by testing three key metrics: ping latency (how responsive your connection is), download speed (how fast you can receive data), and upload speed (how fast you can send data). The test works by transferring data between your browser and our server, using adaptive chunk sizing to ensure accurate results whether you're on a slow mobile connection or a high-speed fiber link. Unlike many speed test tools that rely on third-party servers, this test uses our own endpoints for consistent, reliable measurements. Results are displayed in industry-standard units — milliseconds for ping and megabits per second (Mbps) for throughput. The test uses incompressible random data to prevent network compression from inflating results, and runs multiple iterations to reduce variance from momentary network fluctuations.",
        faqs: [
            { question: "How accurate is this speed test?", answer: "The test provides a good approximation of your real-world internet speed. It uses multiple iterations with adaptive chunk sizing and incompressible data for accurate measurements. Results may vary slightly between tests due to network congestion, server load, and other factors — this is normal for any speed test." },
            { question: "What is a good internet speed?", answer: "For general browsing and streaming, 25 Mbps download is sufficient. For 4K video streaming, aim for 50+ Mbps. For gaming, low ping (under 30ms) matters more than raw speed. For remote work with video calls, 10+ Mbps upload is recommended." },
            { question: "Why is my speed lower than what my ISP advertises?", answer: "ISPs advertise 'up to' speeds under ideal conditions. Real-world speeds are affected by Wi-Fi interference, network congestion, distance from the router, the number of connected devices, and time of day. Try testing with a wired Ethernet connection for the most accurate comparison." },
            { question: "What does ping/latency mean?", answer: "Ping (or latency) measures the round-trip time for data to travel from your device to the server and back, measured in milliseconds (ms). Lower ping means a more responsive connection. Under 20ms is excellent, 20-50ms is good, 50-100ms is acceptable, and over 100ms may cause noticeable lag in real-time applications." }
        ],
        relatedSlugs: ["ip-check", "json-formatter", "base64-encode-decode"]
    },
    {
        slug: "ip-check",
        name: "IP Address Checker",
        description: "Check your public IP address, location, ISP, and network details.",
        category: "network-tools",
        metaTitle: "IP Address Checker - Find Your IP & Location Free",
        metaDescription: "Check your public IP address, geolocation, ISP, timezone, and network details instantly. Free IP lookup tool with no registration required.",
        howToUse: [
            "Your IP address and network information are loaded automatically when you open this tool.",
            "View your public IP address, country, city, ISP, timezone, coordinates, and other network details.",
            "Click the copy button next to your IP address to copy it to your clipboard.",
            "Use the 'Refresh' button to fetch updated information if your network has changed."
        ],
        about: "The IP Address Checker instantly reveals your public IP address along with detailed geolocation and network information. When you connect to the internet, your ISP assigns you a public IP address that websites and services use to communicate with your device. This tool looks up that address and provides associated metadata including your approximate geographic location (country, city, region), your Internet Service Provider (ISP), timezone, geographic coordinates, and autonomous system (AS) number. This information is useful for troubleshooting network issues, verifying VPN connections, checking your geographic IP location, or understanding how websites see your connection. The tool fetches data from a geolocation API and displays it in an easy-to-read format with one-click copy functionality.",
        faqs: [
            { question: "Is my IP address the same as my location?", answer: "Your IP address reveals your approximate location (usually city-level accuracy), not your exact address. IP geolocation databases map IP ranges to geographic regions based on ISP allocation data. The accuracy varies — it's typically within 10-50 miles of your actual location." },
            { question: "Why does my IP location show a different city?", answer: "IP geolocation is based on where your ISP routes traffic, not your physical location. Your ISP may route your connection through a hub in a nearby city. VPN and proxy users will see the location of their VPN/proxy server instead." },
            { question: "What can someone do with my IP address?", answer: "An IP address alone provides limited information — approximate location and ISP. It cannot reveal your identity, exact address, or personal data. However, it's still good practice to use a VPN on public networks for added privacy." },
            { question: "How do I change my IP address?", answer: "You can change your visible IP by using a VPN service, connecting to a different network, or restarting your router (which may assign a new dynamic IP). Most residential ISPs use dynamic IP addresses that change periodically on their own." }
        ],
        relatedSlugs: ["speed-test", "json-formatter", "url-encode-decode"]
    },
    {
        slug: "dns-lookup",
        name: "DNS Lookup",
        description: "Query DNS records for any domain — A, AAAA, CNAME, MX, TXT, NS, and SOA.",
        category: "network-tools",
        metaTitle: "Free DNS Lookup Tool - Query DNS Records Online | DevPik",
        metaDescription: "Look up DNS records for any domain. Query A, AAAA, CNAME, MX, TXT, NS, and SOA records instantly. Free DNS checker tool with no signup required.",
        howToUse: [
            "Enter the domain name you want to look up (e.g., example.com).",
            "Select the DNS record type you want to query, or choose 'ALL' to see all records.",
            "Click 'Lookup' to query the DNS records.",
            "View the results organized by record type, showing values, TTLs, and other details."
        ],
        about: "The DNS Lookup tool lets you query DNS records for any domain name. DNS (Domain Name System) is the internet's phone book — it translates human-readable domain names into IP addresses and other records that computers use to communicate. This tool queries public DNS servers to retrieve A, AAAA, CNAME, MX, TXT, NS, and SOA records, helping you troubleshoot DNS issues, verify configurations, or research domain infrastructure.",
        faqs: [
            { question: "What are DNS records?", answer: "DNS records are entries in the Domain Name System that map domain names to various types of data. They are the backbone of the internet's naming system, translating human-readable domains like example.com into IP addresses and other information that computers use to route traffic." },
            { question: "What is an A record?", answer: "An A record maps a domain name to an IPv4 address. It's the most fundamental DNS record type and is what allows browsers to find the server hosting a website." },
            { question: "What is an MX record?", answer: "MX (Mail Exchange) records specify the mail servers responsible for receiving email for a domain, along with priority values. Lower priority numbers indicate higher preference." },
            { question: "What is a TXT record?", answer: "TXT records store arbitrary text data associated with a domain. They're commonly used for email authentication (SPF, DKIM, DMARC), domain verification, and other purposes." },
            { question: "Which DNS server does this tool query?", answer: "This tool queries Google's public DNS servers (8.8.8.8) via their DNS-over-HTTPS API, providing fast and reliable results from one of the world's largest DNS resolvers." }
        ],
        relatedSlugs: ["ip-check", "speed-test", "url-shortener", "url-encode-decode"]
    },
    // ==================== BACKEND-POWERED TOOLS ====================
    {
        slug: "code-share",
        name: "Code Share",
        description: "Share code snippets online with syntax highlighting and short URLs.",
        category: "developer-tools",
        metaTitle: "Free Code Share Tool - Share Code Snippets Online | DevPik",
        metaDescription: "Share code snippets online for free. Supports 10+ languages with syntax highlighting, expiry options, and shareable short URLs.",
        howToUse: [
            "Paste or type your code into the editor.",
            "Select the programming language and optionally add a title and expiry time.",
            "Click 'Share Code' to generate a unique shareable link.",
            "Copy the link and share it with anyone — they'll see your code with syntax highlighting."
        ],
        about: "Code Share is a simple, fast way to share code snippets with anyone. Paste your code, choose a language, and get a shareable link instantly. Your snippet is stored securely and can be set to expire after a chosen duration. Perfect for sharing code during pair programming, code reviews, bug reports, or quick collaborations.",
        faqs: [
            { question: "How long are shared code snippets stored?", answer: "By default, snippets are stored indefinitely. You can optionally set an expiry time of 1 hour, 24 hours, 7 days, or 30 days when creating a snippet." },
            { question: "Is there a size limit for code snippets?", answer: "Snippets can be up to 100KB in size, which is more than enough for most code sharing needs." },
            { question: "Can I edit a shared snippet after creating it?", answer: "No, shared snippets are immutable once created. You can create a new snippet with the updated code." }
        ],
        relatedSlugs: ["json-formatter", "html-minifier", "markdown-converter", "url-shortener"]
    },
    {
        slug: "url-shortener",
        name: "URL Shortener",
        description: "Shorten long URLs into clean, shareable short links with QR codes.",
        category: "developer-tools",
        metaTitle: "Free URL Shortener - Shorten Links Online | DevPik",
        metaDescription: "Shorten long URLs for free. Get clean short links with QR code generation, click tracking, and optional expiry dates.",
        howToUse: [
            "Paste your long URL into the input field.",
            "Optionally set an expiry date for the short link.",
            "Click 'Shorten URL' to generate your short link.",
            "Copy the short URL or scan the QR code to share it."
        ],
        about: "The URL Shortener transforms long, unwieldy URLs into clean, short links that are easy to share. Each shortened URL comes with an auto-generated QR code for easy mobile sharing. Links can be set to expire after a chosen duration. Perfect for sharing links on social media, in emails, presentations, or anywhere character count matters.",
        faqs: [
            { question: "How long do shortened URLs last?", answer: "By default, shortened URLs are permanent. You can optionally set an expiry of 1 hour, 24 hours, 7 days, or 30 days." },
            { question: "Can I track clicks on my shortened URLs?", answer: "Click counts are tracked automatically. The click count is visible when you view the short URL details." },
            { question: "Is there a limit to how many URLs I can shorten?", answer: "There are no limits on URL shortening. The service is completely free to use." }
        ],
        relatedSlugs: ["code-share", "url-encode-decode", "base64-encode-decode", "json-formatter"]
    },
    // ==================== JSON TOOLS ====================
    {
        slug: "json-escape",
        name: "JSON Escape",
        description: "Escape special characters in JSON strings online. Convert raw text to valid JSON string format instantly.",
        category: "json-tools",
        metaTitle: "JSON Escape Online - Escape JSON Strings & Special Characters Free",
        metaDescription: "Free online JSON escape tool. Escape special characters in JSON strings including quotes, backslashes, newlines, and tabs. Instant, client-side processing.",
        howToUse: [
            "Paste or type your raw text or JSON string into the input panel on the left.",
            "The tool instantly escapes all special characters — double quotes, backslashes, newlines, tabs, and Unicode control characters — in real time.",
            "Copy the escaped output from the right panel, or click the Swap button to switch to JSON Unescape mode."
        ],
        about: "JSON Escape is a free online tool that converts special characters in your text into their JSON-safe escape sequences. When building JSON strings manually or embedding text inside JSON payloads, characters like double quotes (\"), backslashes (\\), newlines, tabs, and control characters must be properly escaped to produce valid JSON. This tool handles all JSON escape characters defined in the RFC 8259 specification, including \\\" for double quotes, \\\\ for backslashes, \\n for newlines, \\t for tabs, \\r for carriage returns, \\b for backspace, \\f for form feed, and \\uXXXX for Unicode control characters. Everything runs 100% client-side in your browser — your data is never sent to any server. Developers, API engineers, and anyone working with JSON data use this tool to quickly escape JSON strings for embedding in code, API requests, configuration files, and database queries.",
        faqs: [
            { question: "What characters need to be escaped in JSON?", answer: "According to the JSON specification (RFC 8259), you must escape double quotes (\\\"), backslashes (\\\\), and all control characters (U+0000 through U+001F). This includes newlines (\\n), tabs (\\t), carriage returns (\\r), backspace (\\b), and form feed (\\f). Forward slashes (/) may optionally be escaped as \\/ but this is not required." },
            { question: "How do I escape double quotes in JSON?", answer: "To escape a double quote inside a JSON string, prefix it with a backslash: \\\". For example, the text He said \"hello\" becomes He said \\\"hello\\\" when properly escaped for use inside a JSON string value." },
            { question: "Does JSON need to be escaped?", answer: "Yes — any string value inside JSON that contains special characters must have those characters escaped. If you don't escape characters like quotes or backslashes, the JSON will be invalid and parsers like JSON.parse() will throw a syntax error. This tool automates the escaping process so you don't have to do it manually." },
            { question: "What is the difference between JSON escape and JSON unescape?", answer: "JSON escape converts raw text into a JSON-safe format by adding backslash escape sequences before special characters. JSON unescape does the reverse — it converts escaped sequences back into their original characters. Use escape when preparing text for JSON, and unescape when reading escaped JSON string data." },
            { question: "How do I escape a backslash in JSON?", answer: "A single backslash (\\) in JSON must be escaped as a double backslash (\\\\). This is because the backslash is the escape character itself in JSON, so it needs to be escaped to be treated as a literal backslash." },
            { question: "Is my data safe when using this tool?", answer: "Absolutely. This JSON escape tool runs entirely in your browser using client-side JavaScript. Your text is never transmitted to any server, ensuring complete privacy and data security." }
        ],
        relatedSlugs: ["json-unescape", "json-formatter", "json-minifier", "json-compare"]
    },
    {
        slug: "json-unescape",
        name: "JSON Unescape",
        description: "Unescape JSON strings online. Convert escaped JSON text back to readable format instantly.",
        category: "json-tools",
        metaTitle: "JSON Unescape Online - Unescape JSON Strings Free",
        metaDescription: "Free online JSON unescape tool. Remove escape sequences from JSON strings and convert them back to readable text. Fast, free, and runs in your browser.",
        howToUse: [
            "Paste your escaped JSON string into the input panel on the left.",
            "The tool instantly converts all escape sequences — \\n, \\t, \\\", \\\\, and Unicode escapes — back to their original characters in real time.",
            "Copy the unescaped output from the right panel, or click the Swap button to switch to JSON Escape mode."
        ],
        about: "JSON Unescape is a free online tool that converts JSON escape sequences back into their original, human-readable characters. When you receive JSON data from APIs, log files, or databases, strings often contain escape sequences like \\n for newlines, \\\" for quotes, and \\\\ for backslashes. This tool reverses all standard JSON escape sequences defined in RFC 8259, making the text readable again. It also handles quoted JSON string values — if your input is wrapped in double quotes, the tool will strip the outer quotes and unescape the contents. Perfect for debugging API responses, reading log output, cleaning up JSON data, and removing escape characters from JSON strings. All processing happens 100% client-side in your browser with zero data sent to any server.",
        faqs: [
            { question: "What does JSON unescape do?", answer: "JSON unescape reverses the escaping process by converting escape sequences back to their original characters. For example, \\n becomes an actual newline, \\\" becomes a double quote, \\\\ becomes a single backslash, and \\t becomes a tab character. It makes escaped JSON strings human-readable again." },
            { question: "How do I unescape a JSON string?", answer: "Paste your escaped JSON string into this tool and the unescaped output appears instantly. Programmatically, you can use JSON.parse() in JavaScript (wrapping the string in quotes first), json.loads() in Python, or equivalent functions in other languages." },
            { question: "How do I remove escape characters from JSON?", answer: "Use this JSON unescape tool to instantly remove all escape characters from a JSON string. Simply paste the escaped text and get clean, readable output. The tool handles all standard JSON escape sequences including \\n, \\t, \\\", \\\\, \\r, \\b, \\f, and \\uXXXX Unicode escapes." },
            { question: "What is the difference between JSON unescape and JSON parse?", answer: "JSON unescape specifically reverses escape sequences in a string value, while JSON parse (JSON.parse) converts an entire JSON text into a JavaScript object or value. JSON.parse will also unescape strings as part of the parsing process, but this tool focuses on string-level unescaping without full JSON parsing." },
            { question: "Can I unescape JSON with Unicode characters?", answer: "Yes. This tool fully supports Unicode escape sequences in the format \\uXXXX (e.g., \\u0041 becomes A, \\u00e9 becomes e with acute accent). It also handles surrogate pairs for characters outside the Basic Multilingual Plane." },
            { question: "Is my data safe when using this tool?", answer: "Yes. This JSON unescape tool processes everything locally in your browser. No data is ever sent to a server, ensuring complete privacy." }
        ],
        relatedSlugs: ["json-escape", "json-formatter", "json-minifier", "json-compare"]
    },
    {
        slug: "json-minifier",
        name: "JSON Minifier",
        description: "Minify and compress JSON by removing all whitespace, newlines, and indentation. Reduce JSON file size instantly with real-time compression stats.",
        category: "json-tools",
        metaTitle: "JSON Minifier Online - Minify & Compress JSON Free | DevPik",
        metaDescription: "Free online JSON minifier tool. Compress JSON by removing whitespace, newlines, and indentation. See original vs minified size stats. 100% client-side, no data sent to servers.",
        howToUse: [
            "Paste or type your formatted JSON into the input area on the left.",
            "The tool automatically minifies your JSON in real-time as you type.",
            "View compression stats showing original size, minified size, and percentage saved.",
            "Click the Copy button to copy the minified JSON to your clipboard.",
            "Use the Sample button to load example JSON and see minification in action."
        ],
        about: "JSON Minifier is a free online tool that compresses JSON data by removing all unnecessary whitespace, newlines, tabs, and indentation. Minified JSON is functionally identical to the original — it contains the same data structure and values — but takes up significantly less space. This is essential for reducing payload sizes in APIs, configuration files, and data storage. The tool processes everything locally in your browser with zero server requests, ensuring your data stays completely private. It also validates your JSON and shows clear error messages if the input is malformed.",
        faqs: [
            { question: "What does a JSON minifier do?", answer: "A JSON minifier removes all unnecessary whitespace characters from JSON data — including spaces, tabs, newlines, and indentation — without changing the actual data or structure. The result is a compact, single-line JSON string that is functionally identical to the original but smaller in file size." },
            { question: "Does minifying JSON change the data?", answer: "No. Minifying JSON only removes formatting characters (whitespace, newlines, indentation). The actual data structure, keys, values, arrays, and objects remain exactly the same. A minified JSON string will parse to the identical object as the original formatted version." },
            { question: "When should I minify JSON?", answer: "Minify JSON for production environments: API responses, configuration files deployed to servers, data stored in databases, and any JSON transmitted over the network. Smaller payloads mean faster load times and lower bandwidth costs. Avoid minifying JSON you need to read or debug — use a JSON formatter instead." },
            { question: "How much space does JSON minification save?", answer: "Savings depend on the original formatting. Typically, minification reduces JSON file size by 10-40%. Heavily indented JSON with many nested objects can see even greater reductions. Our tool shows exact byte counts and percentage savings in real-time." },
            { question: "Is my JSON data safe with this tool?", answer: "Yes. This JSON minifier runs 100% in your browser. No data is ever sent to any server. Your JSON is processed locally using JavaScript, ensuring complete privacy and security." },
            { question: "What is the difference between JSON minify and JSON compress?", answer: "JSON minify and JSON compress are often used interchangeably. Both refer to removing whitespace from JSON. However, true compression (like gzip or brotli) applies binary compression algorithms to reduce file size further. This tool performs minification — whitespace removal — which is the first step before optional binary compression." },
            { question: "Can I minify invalid JSON?", answer: "No. The JSON must be valid for minification to work. If your input has syntax errors, the tool will display an error message indicating the problem. Fix the JSON syntax first, then minify." }
        ],
        relatedSlugs: ["json-formatter", "json-escape", "json-unescape", "html-minifier"]
    },
    {
        slug: "json-compare",
        name: "JSON Compare",
        description: "Compare two JSON objects side by side and find every difference. Visual tree diff and text diff views with additions, deletions, and modifications highlighted.",
        category: "json-tools",
        metaTitle: "JSON Compare & Diff Online - Compare JSON Objects Free | DevPik",
        metaDescription: "Free online JSON compare tool. Find differences between two JSON objects with visual tree diff and line-by-line text diff. Shows additions, deletions, modifications. 100% client-side.",
        howToUse: [
            "Paste your original JSON into the left panel and the modified JSON into the right panel.",
            "Click the Compare button to analyze differences between the two JSON objects.",
            "View results in Tree View mode to see differences highlighted in a collapsible tree structure.",
            "Switch to Text Diff mode for a line-by-line comparison similar to GitHub diff view.",
            "Use the Swap button to switch the left and right panels. Copy the diff summary with one click."
        ],
        about: "JSON Compare is a free online tool that finds and visualizes differences between two JSON objects. It performs a deep, structural comparison — not just a text-level diff — which means it correctly identifies added keys, removed keys, modified values, and type changes at every level of nesting. The tool offers two viewing modes: a Tree View that shows the merged JSON structure with color-coded differences at each node, and a Text Diff view that provides a line-by-line comparison similar to code diffs on GitHub. All processing happens locally in your browser, making it safe for comparing sensitive data like API responses, configuration files, and database records.",
        faqs: [
            { question: "How does JSON compare work?", answer: "JSON Compare parses both JSON inputs into JavaScript objects, then recursively walks through every key, value, and array element in both structures simultaneously. It tracks four types of differences: additions (keys that exist only in the right JSON), deletions (keys only in the left JSON), modifications (same key but different value), and type changes (same key but different data type). Results are displayed with JSON paths like data.users[0].name so you can locate each difference precisely." },
            { question: "Does JSON compare ignore formatting differences?", answer: "Yes. Because the tool parses JSON into objects before comparing, all formatting differences (whitespace, indentation, key ordering within objects) are automatically ignored. Only actual data differences are shown. Two JSON objects with different formatting but identical data will show as 'identical'." },
            { question: "Can I compare large JSON files?", answer: "Yes. The tool handles JSON files of any reasonable size since it runs locally in your browser. For very large files (10MB+), comparison may take a moment. The tool compares by structure, not by line, so it works well even with deeply nested or complex JSON data." },
            { question: "What is the difference between tree view and text diff?", answer: "Tree View shows the merged JSON structure as a collapsible tree where each node is color-coded: green for additions, red for deletions, and yellow/amber for modifications. Text Diff shows a line-by-line comparison of the pretty-printed JSON, similar to a GitHub pull request diff, with + and - prefixes for added and removed lines." },
            { question: "How does JSON diff handle arrays?", answer: "Arrays are compared by index position. Element at index 0 in the left JSON is compared with element at index 0 in the right JSON, and so on. If one array is longer, the extra elements are shown as additions or deletions. This index-based comparison is the standard approach for JSON diffing." },
            { question: "Is my data safe when comparing JSON?", answer: "Yes. This JSON compare tool processes everything 100% in your browser. No JSON data is ever sent to any server. You can safely compare sensitive API responses, credentials (if needed), and private configuration files." },
            { question: "Can I compare JSON with different key orders?", answer: "Yes. Since the tool performs structural comparison (not text comparison), different key ordering does not affect the result. Two objects with the same keys and values but in different order will show as identical." }
        ],
        relatedSlugs: ["json-formatter", "json-minifier", "text-diff", "json-escape"]
    },
    {
        slug: "json-to-csv",
        name: "JSON to CSV Converter",
        description: "Convert JSON arrays to CSV format instantly. Supports nested objects, custom delimiters, and file download.",
        category: "json-tools",
        metaTitle: "JSON to CSV Converter Online Free - Convert JSON to CSV | DevPik",
        metaDescription: "Free online JSON to CSV converter. Transform JSON arrays into CSV format with nested object flattening, custom delimiters, and instant download. 100% client-side, private and fast.",
        howToUse: [
            "Paste your JSON array into the input area or upload a .json file using the Upload button.",
            "The tool automatically converts your JSON to CSV in real-time as you type or paste.",
            "Adjust options: choose a delimiter (comma, semicolon, tab, pipe), toggle headers, or enable nested object flattening.",
            "Copy the CSV output to your clipboard or download it as a .csv file.",
            "Use the Swap button to switch to CSV to JSON conversion mode."
        ],
        about: "JSON to CSV Converter is a free online tool that transforms JSON arrays into CSV (Comma Separated Values) format. It handles complex JSON structures including nested objects (flattened with dot notation like address.city), arrays within values, null values, and mixed data types. The tool supports multiple delimiters — comma, semicolon, tab, and pipe — making it compatible with different regional CSV standards and applications. Whether you need to export API response data to a spreadsheet, prepare data for database import, or share structured data with non-technical team members, this converter handles it all. Every conversion runs 100% in your browser — your JSON data never leaves your device.",
        faqs: [
            { question: "How do I convert JSON to CSV?", answer: "Paste your JSON array of objects into the input field. The tool automatically extracts all keys as CSV column headers and converts each object into a CSV row. Click Copy or Download CSV to get the result. For nested objects, enable 'Flatten nested objects' to convert them to dot-notation columns like address.city." },
            { question: "Can I convert nested JSON to CSV?", answer: "Yes. Enable the 'Flatten nested objects' option (on by default) and the tool will convert nested properties to dot-notation columns. For example, {\"address\": {\"city\": \"NYC\"}} becomes a column header address.city with value NYC." },
            { question: "What JSON format does this tool accept?", answer: "The tool accepts a JSON array of objects, like [{\"name\":\"John\",\"age\":30},{\"name\":\"Jane\",\"age\":25}]. Each object in the array becomes one row in the CSV. The tool automatically collects all unique keys across all objects as column headers." },
            { question: "Can I change the CSV delimiter?", answer: "Yes. Choose from four delimiter options: Comma (default, standard CSV), Semicolon (common in European countries), Tab (TSV format), or Pipe. Select the delimiter that matches your target application or regional standard." },
            { question: "Is my JSON data safe with this converter?", answer: "Yes. This JSON to CSV converter runs 100% client-side in your browser. No data is ever uploaded to any server. Your JSON stays on your device, making it safe for converting sensitive or proprietary data." },
            { question: "How does the tool handle arrays inside JSON values?", answer: "Arrays within JSON values are joined with semicolons by default. For example, {\"skills\": [\"JS\", \"Python\"]} becomes JS;Python in the CSV output. This preserves all data while maintaining CSV compatibility." },
            { question: "Can I convert large JSON files to CSV?", answer: "Yes. The tool processes JSON locally in your browser and can handle files with thousands of rows. For very large files, use the Upload button to load a .json file directly instead of pasting." }
        ],
        relatedSlugs: ["csv-to-json", "json-formatter", "json-minifier", "json-compare"]
    },
    {
        slug: "csv-to-json",
        name: "CSV to JSON Converter",
        description: "Convert CSV data to JSON format instantly. Auto-detects delimiters, parses types, and supports file upload.",
        category: "json-tools",
        metaTitle: "CSV to JSON Converter Online Free - Convert CSV to JSON | DevPik",
        metaDescription: "Free online CSV to JSON converter. Transform CSV data into JSON arrays with automatic delimiter detection, type parsing, and instant download. 100% client-side, fast and private.",
        howToUse: [
            "Paste your CSV data into the input area or upload a .csv file using the Upload button.",
            "The tool automatically detects the delimiter and converts CSV to JSON in real-time.",
            "Adjust options: toggle first row as headers, enable auto-detect types (numbers, booleans), or choose output format.",
            "Copy the JSON output to your clipboard or download it as a .json file.",
            "Use the Swap button to switch to JSON to CSV conversion mode."
        ],
        about: "CSV to JSON Converter is a free online tool that transforms CSV (Comma Separated Values) data into structured JSON format. It features automatic delimiter detection (comma, semicolon, tab, pipe), intelligent type parsing that converts numeric strings to numbers and boolean strings to true/false, and proper handling of quoted fields with escaped characters. Output as an array of objects (with column headers as keys) or an array of arrays. The tool correctly handles edge cases like newlines within quoted fields, escaped quotes, inconsistent column counts, and empty values. Perfect for importing spreadsheet data into web applications, preparing data for APIs, or converting tabular data for JavaScript processing. All conversion happens in your browser — your CSV data stays private.",
        faqs: [
            { question: "How do I convert CSV to JSON?", answer: "Paste your CSV data into the input field or upload a .csv file. The tool automatically detects the delimiter and converts each row into a JSON object using the first row as property keys. The result is a JSON array of objects that you can copy or download." },
            { question: "Does the tool auto-detect the CSV delimiter?", answer: "Yes. The auto-detect feature analyzes the first line of your CSV to determine whether it uses commas, semicolons, tabs, or pipes as delimiters. You can also disable auto-detection and manually select a delimiter if needed." },
            { question: "What does auto-detect types do?", answer: "When enabled, the tool converts string values to their appropriate JSON types: numeric strings like \"30\" become the number 30, \"true\"/\"false\" become booleans, and \"null\" becomes null. Disable this option if you want all values to remain as strings." },
            { question: "Can I convert CSV without headers?", answer: "Yes. Uncheck 'First row as headers' and the tool will generate automatic column names (column_1, column_2, etc.) instead of using the first row as property keys. All rows including the first will be treated as data." },
            { question: "Is my CSV data safe with this tool?", answer: "Yes. This CSV to JSON converter runs 100% client-side in your browser using JavaScript. No data is sent to any server. Your CSV data remains on your device throughout the entire conversion process." },
            { question: "How does the tool handle quoted CSV fields?", answer: "The parser correctly handles RFC 4180 compliant CSV: fields wrapped in double quotes can contain commas, newlines, and other special characters without breaking the parse. Double quotes within quoted fields are escaped as two consecutive quotes (\"\")." },
            { question: "What output formats are available?", answer: "Two output formats: 'Array of objects' creates [{\"name\":\"John\",\"age\":30},...] using headers as keys (most common), while 'Array of arrays' creates [[\"name\",\"age\"],[\"John\",30],...] preserving the tabular structure." }
        ],
        relatedSlugs: ["json-to-csv", "json-formatter", "json-minifier", "json-compare"]
    },
    {
        slug: "json-to-yaml",
        name: "JSON to YAML Converter",
        description: "Convert JSON to YAML and YAML to JSON online. Bidirectional converter with indent options, inline arrays, and instant download.",
        category: "json-tools",
        metaTitle: "JSON to YAML Converter Online Free - Convert JSON to YAML & YAML to JSON | DevPik",
        metaDescription: "Free online JSON to YAML converter. Convert JSON to YAML or YAML to JSON instantly with customizable indentation, inline arrays, and download. 100% client-side, no data sent to servers.",
        howToUse: [
            "Paste your JSON into the left input panel. The tool converts it to YAML in real-time as you type.",
            "Adjust formatting options: choose 2 or 4 space indentation, enable inline short arrays, or toggle string quoting.",
            "Click the Swap button to switch to YAML → JSON mode and convert YAML back to JSON.",
            "Copy the output to your clipboard or download it as a .yaml or .json file."
        ],
        about: "The JSON to YAML Converter is a free online tool that converts between JSON and YAML formats instantly. JSON (JavaScript Object Notation) and YAML (YAML Ain't Markup Language) are both popular data serialization formats, but they serve different purposes. JSON is the standard for APIs and data exchange, while YAML is preferred for configuration files like Docker Compose, Kubernetes manifests, GitHub Actions workflows, and CI/CD pipelines because of its human-readable syntax and support for comments. This bidirectional converter handles nested objects, arrays, null values, booleans, multiline strings, and all standard YAML features. Customize the output with indent size options and inline array formatting. Everything runs 100% client-side in your browser — your data never leaves your device.",
        faqs: [
            { question: "How do I convert JSON to YAML?", answer: "Paste your JSON into the left input panel and the tool instantly converts it to YAML in the right panel. You can customize the output with 2 or 4 space indentation, inline short arrays, and string quoting options. Copy or download the result when ready." },
            { question: "Can I convert YAML to JSON?", answer: "Yes! Click the Swap button to switch to YAML → JSON mode. Paste your YAML in the left panel and get clean, formatted JSON output. The tool handles YAML features like comments (stripped in JSON output), anchors, and multiline strings." },
            { question: "What is the difference between JSON and YAML?", answer: "JSON uses braces {} and brackets [] with strict syntax, while YAML uses indentation-based structure that's more human-readable. YAML supports comments, JSON doesn't. JSON is standard for APIs and JavaScript, while YAML is preferred for configuration files (Docker, Kubernetes, GitHub Actions). Both represent the same data structures." },
            { question: "Does the converter handle nested objects and arrays?", answer: "Yes. The converter fully supports deeply nested objects, arrays of objects, mixed types, null values, booleans, numbers, and multiline strings. Nested YAML structures are properly indented, and nested JSON is correctly formatted with braces and brackets." },
            { question: "Is YAML a superset of JSON?", answer: "Technically yes — valid JSON is also valid YAML (since YAML 1.2). However, they have different conventions and strengths. YAML adds features like comments, anchors/aliases, and multiline strings that JSON doesn't support. This tool converts between their conventional formats." },
            { question: "Is my data safe when converting?", answer: "Yes. This JSON to YAML converter runs 100% client-side in your browser. No data is ever transmitted to any server. Your JSON and YAML content stays completely private on your device." }
        ],
        relatedSlugs: ["json-formatter", "json-minifier", "json-to-csv", "json-compare"]
    },
    // ==================== TEXT GENERATORS ====================
    {
        slug: "upside-down-text",
        name: "Upside Down Text Generator",
        description: "Flip your text upside down using Unicode characters. Copy and paste upside down text anywhere — social media, messages, usernames.",
        category: "text-tools",
        metaTitle: "Upside Down Text Generator - Flip Text Upside Down Online Free | DevPik",
        metaDescription: "Free upside down text generator. Flip text upside down, backwards, or mirrored using Unicode characters. Copy and paste flipped text to social media, messages, and more. Instant, no signup.",
        howToUse: [
            "Type or paste your text in the input area above. The upside down text appears instantly below.",
            "Choose a transformation mode: Upside Down, Backwards, Flipped Only, or Mirror.",
            "Click the Copy button to copy the transformed text, then paste it anywhere — social media posts, messages, usernames, or emails."
        ],
        about: "The Upside Down Text Generator flips your text upside down using special Unicode characters that look like inverted versions of regular letters. Unlike image-based text flippers, the output is real text that you can copy, paste, and use anywhere — Facebook posts, Twitter/X tweets, Instagram bios, Discord usernames, WhatsApp messages, emails, and more. The tool supports multiple transformation modes: Upside Down (flips and reverses for true upside-down reading), Backwards (reverses character order), Flipped Only (maps characters without reversing), and Mirror (horizontal reversal). All 26 lowercase letters, 26 uppercase letters, numbers 0-9, and common punctuation marks have carefully selected Unicode equivalents. Processing happens instantly in your browser with zero server requests — your text is never stored or transmitted.",
        faqs: [
            { question: "How does upside down text work?", answer: "Upside down text uses special Unicode characters that look like flipped versions of regular letters. For example, 'a' becomes 'ɐ', 'b' becomes 'q', and 'e' becomes 'ǝ'. The text is also reversed so it reads correctly when viewed upside down. These are real characters in the Unicode standard, not images." },
            { question: "Can I use upside down text on social media?", answer: "Yes! Since the output uses standard Unicode characters, you can paste upside down text into Facebook posts, Twitter/X tweets, Instagram bios and comments, TikTok captions, Discord messages, Reddit posts, and virtually any platform that supports Unicode text." },
            { question: "Does upside down text work on all devices?", answer: "Most modern devices and browsers support the Unicode characters used for upside down text. Some older phones or apps may display certain flipped characters as empty boxes. The most common letters (a-z) have the best support across all devices." },
            { question: "What is the difference between upside down and backwards text?", answer: "Upside down text replaces each character with its flipped Unicode equivalent AND reverses the string so it reads correctly when literally turned upside down. Backwards text simply reverses the character order without changing the characters themselves — 'hello' becomes 'olleh'." },
            { question: "Why do some characters look the same upside down?", answer: "Some letters are naturally symmetrical — like 'o', 'x', 's', and 'H' — so they look identical when flipped. Others like 'l' have very similar upside-down equivalents. The tool uses the closest matching Unicode character for each letter." },
            { question: "Is my text stored or tracked?", answer: "No. The Upside Down Text Generator runs 100% client-side in your browser. Your text is never sent to any server, stored in any database, or tracked in any way. Complete privacy is guaranteed." }
        ],
        relatedSlugs: ["unicode-text-converter", "case-converter", "word-counter", "text-repeater"]
    },
];

export function getToolsByCategory(category: ToolCategory): ToolItem[] {
    return toolsData.filter((tool) => tool.category === category);
}

export function getToolBySlug(slug: string): ToolItem | undefined {
    return toolsData.find((tool) => tool.slug === slug);
}
