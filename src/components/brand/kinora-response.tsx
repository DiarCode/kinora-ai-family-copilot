"use client";

import Link from "next/link";
import { MessageResponse } from "@/components/ai-elements/message";
import { cn } from "@/lib/utils";

/**
 * Streamdown's default link UI opens a safety confirmation. Kinora's markdown
 * is generated from our own prompts, and we want the citations and next-step
 * links to behave like links. Internal routes use the Next router; external
 * sources open in a new tab.
 */
export function KinoraResponse({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <MessageResponse
      className={cn("kinora-response", className)}
      linkSafety={{ enabled: false }}
      components={{
        a: ({ href, children: linkChildren }) => {
          const url = typeof href === "string" ? href : "";
          if (url.startsWith("/")) {
            return (
              <Link href={url} className="font-medium text-kinora-800 underline">
                {linkChildren}
              </Link>
            );
          }
          if (/^https?:\/\//.test(url)) {
            return (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-kinora-800 underline"
              >
                {linkChildren}
              </a>
            );
          }
          return <span>{linkChildren}</span>;
        },
      }}
    >
      {children}
    </MessageResponse>
  );
}
