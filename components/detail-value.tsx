import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
export function DetailValue({ value }: { value: unknown }) {
  if (value === null) return <span className="muted">null</span>;
  if (typeof value === "string")
    return (
      <Markdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
          table: ({ node, ...props }) => (
            <div className="markdown-table">
              <table {...props} />
            </div>
          ),
        }}
      >
        {value}
      </Markdown>
    );
  if (typeof value !== "object") return <span>{String(value)}</span>;
  if (Array.isArray(value))
    return value.length ? (
      <ul className="nested-values">
        {value.map((item, i) => (
          <li key={i}>
            <DetailValue value={item} />
          </li>
        ))}
      </ul>
    ) : (
      <span>[]</span>
    );
  const entries = Object.entries(value as Record<string, unknown>);
  return entries.length ? (
    <dl className="nested-values">
      {entries.map(([key, item]) => (
        <div key={key}>
          <dt>{key}</dt>
          <dd>
            <DetailValue value={item} />
          </dd>
        </div>
      ))}
    </dl>
  ) : (
    <span>{"{}"}</span>
  );
}
export function dateLabel(value: unknown, includeTime = true) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(
      value,
    ) ||
    !Number.isFinite(Date.parse(value))
  )
    return "Unknown";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(includeTime
      ? { hour: "numeric" as const, minute: "2-digit" as const, hour12: true }
      : {}),
  }).format(new Date(value));
}
