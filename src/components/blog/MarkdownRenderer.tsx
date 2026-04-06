import React from "react";

/**
 * Renders markdown-formatted blog content body as styled HTML.
 * Supports: **bold**, *italic*, `inline code`, [links](url), **[bold links](url)**,
 * bullet lists (- ), numbered lists, blockquotes (> ), markdown tables, and paragraphs.
 */
export function MarkdownRenderer({ content }: { content: string }) {
    // Split content into blocks, but keep table rows together
    const blocks = splitIntoBlocks(content);

    return (
        <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
            {blocks.map((block, bIndex) => {
                if (block.type === "table") {
                    return <MarkdownTable key={bIndex} rows={block.lines} />;
                }

                if (block.type === "code") {
                    return (
                        <div key={bIndex} className="relative my-4 rounded-xl overflow-hidden border border-border/60">
                            {block.language && (
                                <div className="flex items-center justify-between bg-slate-800 px-4 py-2 border-b border-slate-700">
                                    <span className="text-xs font-mono text-slate-400">{block.language}</span>
                                </div>
                            )}
                            <pre className={`overflow-x-auto bg-slate-900 p-4 text-sm leading-relaxed ${!block.language ? 'rounded-xl' : ''}`}>
                                <code className="font-mono text-slate-200 whitespace-pre">{block.code}</code>
                            </pre>
                        </div>
                    );
                }

                const trimmed = block.text.trim();
                if (!trimmed) return null;

                const lines = trimmed.split("\n");

                // Check if this is a blockquote
                const isBlockquote = lines.every(
                    (line) => line.trim().startsWith("> ") || line.trim() === ""
                );

                if (isBlockquote) {
                    const quoteContent = lines
                        .filter((line) => line.trim().startsWith("> "))
                        .map((line) => line.trim().replace(/^>\s+/, ""))
                        .join("\n");
                    return (
                        <blockquote
                            key={bIndex}
                            className="border-l-4 border-primary/40 pl-4 py-2 my-2 bg-primary/5 rounded-r-md"
                        >
                            <div className="text-muted-foreground italic">
                                <InlineMarkdown text={quoteContent} />
                            </div>
                        </blockquote>
                    );
                }

                // Check if this is a bullet list
                const isBulletList = lines.every(
                    (line) => line.trim().startsWith("- ") || line.trim() === ""
                );
                const isNumberedList = lines.every(
                    (line) => /^\d+\.\s/.test(line.trim()) || line.trim() === ""
                );

                if (isBulletList) {
                    return (
                        <ul key={bIndex} className="list-disc list-inside space-y-1.5 pl-1">
                            {lines
                                .filter((line) => line.trim().startsWith("- "))
                                .map((line, lIndex) => (
                                    <li key={lIndex} className="text-muted-foreground">
                                        <InlineMarkdown
                                            text={line.trim().replace(/^-\s+/, "")}
                                        />
                                    </li>
                                ))}
                        </ul>
                    );
                }

                if (isNumberedList) {
                    return (
                        <ol key={bIndex} className="list-decimal list-inside space-y-1.5 pl-1">
                            {lines
                                .filter((line) => /^\d+\.\s/.test(line.trim()))
                                .map((line, lIndex) => (
                                    <li key={lIndex} className="text-muted-foreground">
                                        <InlineMarkdown
                                            text={line.trim().replace(/^\d+\.\s+/, "")}
                                        />
                                    </li>
                                ))}
                        </ol>
                    );
                }

                // Check if this is a heading (### or ####)
                if (lines.length === 1) {
                    const h4Match = trimmed.match(/^####\s+(.+)$/);
                    if (h4Match) {
                        return (
                            <h4 key={bIndex} className="text-base font-bold text-foreground mt-2">
                                <InlineMarkdown text={h4Match[1]} />
                            </h4>
                        );
                    }
                    const h3Match = trimmed.match(/^###\s+(.+)$/);
                    if (h3Match) {
                        return (
                            <h3 key={bIndex} className="text-lg font-bold text-foreground mt-4">
                                <InlineMarkdown text={h3Match[1]} />
                            </h3>
                        );
                    }
                }

                // Regular paragraph
                return (
                    <p key={bIndex}>
                        {lines.map((line, lIndex) => (
                            <React.Fragment key={lIndex}>
                                {lIndex > 0 && <br />}
                                <InlineMarkdown text={line.trim()} />
                            </React.Fragment>
                        ))}
                    </p>
                );
            })}
        </div>
    );
}

/**
 * Splits content into blocks, grouping consecutive pipe-delimited table rows together.
 */
type Block = { type: "text"; text: string } | { type: "table"; lines: string[] } | { type: "code"; language: string; code: string };

function isTableRow(line: string): boolean {
    const t = line.trim();
    return t.startsWith("|") && t.endsWith("|") && t.length > 2;
}

function isSeparatorRow(line: string): boolean {
    const t = line.trim();
    return /^\|[\s\-:|]+\|$/.test(t);
}

function splitIntoBlocks(content: string): Block[] {
    const allLines = content.split("\n");
    const blocks: Block[] = [];
    let currentText: string[] = [];
    let currentTable: string[] = [];
    let inCodeBlock = false;
    let codeLanguage = "";
    let codeLines: string[] = [];

    const flushText = () => {
        if (currentText.length > 0) {
            const joined = currentText.join("\n");
            const paragraphs = joined.split("\n\n");
            for (const p of paragraphs) {
                if (!p.trim()) continue;
                // Split out heading lines (### or ####) into their own blocks
                const pLines = p.split("\n");
                let buffer: string[] = [];
                for (const line of pLines) {
                    if (/^#{3,4}\s+/.test(line.trim())) {
                        if (buffer.length > 0) {
                            blocks.push({ type: "text", text: buffer.join("\n") });
                            buffer = [];
                        }
                        blocks.push({ type: "text", text: line.trim() });
                    } else {
                        buffer.push(line);
                    }
                }
                if (buffer.length > 0) {
                    const text = buffer.join("\n").trim();
                    if (text) blocks.push({ type: "text", text });
                }
            }
            currentText = [];
        }
    };

    const flushTable = () => {
        if (currentTable.length >= 2) {
            blocks.push({ type: "table", lines: currentTable });
        } else if (currentTable.length > 0) {
            currentText.push(...currentTable);
        }
        currentTable = [];
    };

    const flushCode = () => {
        blocks.push({ type: "code", language: codeLanguage, code: codeLines.join("\n") });
        codeLanguage = "";
        codeLines = [];
        inCodeBlock = false;
    };

    for (const line of allLines) {
        // Detect fenced code block start/end
        if (line.trim().startsWith("```")) {
            if (!inCodeBlock) {
                // Start of code block
                flushTable();
                flushText();
                inCodeBlock = true;
                codeLanguage = line.trim().replace(/^```/, "").trim();
                codeLines = [];
            } else {
                // End of code block
                flushCode();
            }
            continue;
        }

        if (inCodeBlock) {
            codeLines.push(line);
            continue;
        }

        if (isTableRow(line)) {
            if (currentTable.length === 0) {
                flushText();
            }
            currentTable.push(line);
        } else {
            if (currentTable.length > 0) {
                flushTable();
            }
            currentText.push(line);
        }
    }

    // Flush remaining (handle unclosed code blocks gracefully)
    if (inCodeBlock) {
        flushCode();
    }
    flushTable();
    flushText();

    return blocks;
}

/**
 * Renders a markdown table as a styled HTML table.
 */
function MarkdownTable({ rows }: { rows: string[] }) {
    const parseRow = (row: string): string[] => {
        return row
            .trim()
            .replace(/^\|/, "")
            .replace(/\|$/, "")
            .split("|")
            .map((cell) => cell.trim());
    };

    // Find header and data rows (skip separator row)
    const headerCells = parseRow(rows[0]);
    const dataRows = rows
        .slice(1)
        .filter((row) => !isSeparatorRow(row))
        .map(parseRow);

    return (
        <div className="overflow-x-auto my-4 rounded-xl border border-border/60">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-muted/50 border-b border-border/60">
                        {headerCells.map((cell, i) => (
                            <th
                                key={i}
                                className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap"
                            >
                                <InlineMarkdown text={cell} />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {dataRows.map((cells, rIndex) => (
                        <tr
                            key={rIndex}
                            className={`border-b border-border/30 ${rIndex % 2 === 0 ? "bg-background" : "bg-muted/20"
                                } hover:bg-muted/30 transition-colors`}
                        >
                            {cells.map((cell, cIndex) => (
                                <td
                                    key={cIndex}
                                    className="px-4 py-3 text-muted-foreground"
                                >
                                    <InlineMarkdown text={cell} />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/**
 * Renders inline markdown: **bold**, *italic*, `code`, [links](url),
 * **[bold links](url)**, and nested combinations.
 */
function InlineMarkdown({ text }: { text: string }) {
    const parts: React.ReactNode[] = [];

    // Order matters: match more complex patterns first
    // 1. **[bold link text](url)** — bold wrapping a link
    // 2. [link text](url) — plain link
    // 3. **bold text** — bold
    // 4. *italic text* — italic (single asterisk, not preceded by another *)
    // 5. `inline code` — code
    const regex =
        /(\*\*\[(.+?)\]\(((?:https?:\/\/[^\s)]+|\/[^\s)]+))\)\*\*)|(\[(.+?)\]\(((?:https?:\/\/[^\s)]+|\/[^\s)]+))\))|(\*\*(.+?)\*\*)|(?<!\*)(\*([^*]+?)\*)(?!\*)|(`(.+?)`)/g;

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
        // Push text before the match
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }

        if (match[2] && match[3]) {
            // **[bold link text](url)** — bold link
            const isInternalBl = match[3].startsWith("/") || match[3].includes("devpik.com");
            parts.push(
                <a
                    key={`bl-${match.index}`}
                    href={match[3]}
                    target={isInternalBl ? undefined : "_blank"}
                    rel={isInternalBl ? undefined : "noopener noreferrer"}
                    className="font-semibold text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
                >
                    {match[2]}
                </a>
            );
        } else if (match[5] && match[6]) {
            // [link text](url) — plain link
            const isInternal = match[6].startsWith("/") || match[6].includes("devpik.com");
            parts.push(
                <a
                    key={`l-${match.index}`}
                    href={match[6]}
                    target={isInternal ? undefined : "_blank"}
                    rel={isInternal ? undefined : "noopener noreferrer"}
                    className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
                >
                    {match[5]}
                </a>
            );
        } else if (match[8]) {
            // **bold** match — may contain links inside
            const boldContent = match[8];
            // Check if the bold content itself has a link
            const linkInBold = /^\[(.+?)\]\(((?:https?:\/\/[^\s)]+|\/[^\s)]*))\)$/.exec(boldContent);
            if (linkInBold) {
                const isInternalBld = linkInBold[2].startsWith("/") || linkInBold[2].includes("devpik.com");
                parts.push(
                    <a
                        key={`bld-${match.index}`}
                        href={linkInBold[2]}
                        target={isInternalBld ? undefined : "_blank"}
                        rel={isInternalBld ? undefined : "noopener noreferrer"}
                        className="font-semibold text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
                    >
                        {linkInBold[1]}
                    </a>
                );
            } else {
                parts.push(
                    <strong key={`b-${match.index}`} className="font-semibold text-foreground">
                        {boldContent}
                    </strong>
                );
            }
        } else if (match[10]) {
            // *italic* match
            parts.push(
                <em key={`i-${match.index}`} className="italic text-foreground/90">
                    {match[10]}
                </em>
            );
        } else if (match[12]) {
            // `code` match
            parts.push(
                <code
                    key={`c-${match.index}`}
                    className="px-1.5 py-0.5 rounded-md bg-muted text-foreground text-[13px] font-mono"
                >
                    {match[12]}
                </code>
            );
        }

        lastIndex = match.index + match[0].length;
    }

    // Push remaining text
    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return <>{parts}</>;
}
