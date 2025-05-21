"use client";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, User as UserIcon } from "lucide-react";
import { Message } from "./dashboard";

export default function MessageSection({ messages }: { messages: Message[] }) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="
    flex-1
    px-4
    py-4
    my-24
    space-y-4
    overflow-y-auto
    overflow-x-hidden  /* <-- prevent whole page horizontal scroll */
    max-h-[calc(100vh-5rem)]
    sm:px-6
    md:px-10
  "
    >
      {messages.map(({ role, text }, i) => (
        <div
  key={i}
  className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}
>
  <div className="flex items-start gap-2 w-full max-w-full min-w-0 sm:max-w-md md:max-w-lg lg:max-w-xl">
    {role === "assistant" && (
      <div className="mt-1 flex-shrink-0">
        <Bot className="w-5 h-5 text-gray-500" />
      </div>
    )}

    <div
      className={`
        rounded-2xl
        px-4
        py-2
        text-sm
        whitespace-pre-wrap
        shadow
        break-words
        wrap
        w-full
        min-w-0
        ${role === "user"
          ? "bg-blue-600 text-white rounded-br-none"
          : "bg-gray-100 text-gray-900 rounded-bl-none"
        }
      `}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className, children, ...props }) {
            const isBlock = !className;
            return isBlock ? (
              <pre className="bg-gray-800 text-white p-4 rounded my-2 max-w-full overflow-x-auto whitespace-pre-wrap">
                <code>{children}</code>
              </pre>
            ) : (
              <code
                className="bg-gray-200 px-1 py-0.5 rounded text-sm break-words whitespace-pre-wrap"
                {...props}
              >
                {children}
              </code>
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-words whitespace-pre-wrap"
              >
                {children}
              </a>
            );
          },
          p({ children }) {
            return <p className="my-2 leading-relaxed break-words whitespace-pre-wrap">{children}</p>;
          },
          strong({ children }) {
            return <strong className="font-semibold whitespace-pre-wrap">{children}</strong>;
          },
          li({ children }) {
            return <li className="ml-6 list-disc break-words whitespace-pre-wrap">{children}</li>;
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>

    {role === "user" && (
      <div className="mt-1 flex-shrink-0">
        <UserIcon className="w-5 h-5 text-blue-600" />
      </div>
    )}
  </div>
</div>

      ))}
      <div ref={bottomRef} />
    </div>
  );
}
