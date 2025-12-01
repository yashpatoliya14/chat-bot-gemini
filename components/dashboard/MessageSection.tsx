"use client";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "./Dashboard";
import { Box, Paper, Avatar, Typography } from "@mui/material";
import { SmartToy, Person } from "@mui/icons-material";

export default function MessageSection({ messages }: { messages: Message[] }) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box
      sx={{
        flex: 1,
        px: { xs: 2, sm: 3, md: 4 },
        py: 3,
        mt: 10,
        mb: 12,
        overflowY: "auto",
        overflowX: "hidden",
        maxHeight: "calc(100vh - 5rem)",
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
      }}
    >
      {messages.map(({ role, text }, i) => (
        <Box
          key={i}
          sx={{
            display: "flex",
            justifyContent: role === "user" ? "flex-end" : "flex-start",
            animation: "fadeIn 0.3s ease-in",
            "@keyframes fadeIn": {
              from: { opacity: 0, transform: "translateY(10px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
              maxWidth: { xs: "95%", sm: "80%", md: "70%", lg: "60%" },
              flexDirection: role === "user" ? "row-reverse" : "row",
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: role === "user" ? "#3b82f6" : "#64748b",
                flexShrink: 0,
              }}
            >
              {role === "user" ? <Person sx={{ fontSize: 20 }} /> : <SmartToy sx={{ fontSize: 20 }} />}
            </Avatar>

            <Paper
              elevation={2}
              sx={{
                px: 2.5,
                py: 1.5,
                borderRadius: 2.5,
                bgcolor: role === "user" ? "#3b82f6" : "#f1f5f9",
                color: role === "user" ? "white" : "text.primary",
                borderBottomRightRadius: role === "user" ? 0 : 20,
                borderBottomLeftRadius: role === "assistant" ? 0 : 20,
                wordBreak: "break-word",
                "& code": {
                  fontFamily: "'Courier New', monospace",
                },
              }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children }) {
                    const isBlock = !className;
                    return isBlock ? (
                      <Box
                        component="pre"
                        sx={{
                          bgcolor: "#1e293b",
                          color: "white",
                          p: 2,
                          borderRadius: 1.5,
                          my: 1.5,
                          overflowX: "auto",
                          fontSize: "0.875rem",
                        }}
                      >
                        <code>{children}</code>
                      </Box>
                    ) : (
                      <Box
                        component="code"
                        sx={{
                          display: "inline-block",
                          px: 0.8,
                          py: 0.3,
                          borderRadius: 1,
                          fontSize: "0.85em",
                          fontFamily: "'Courier New', monospace",
                          bgcolor: role === "user" ? "rgba(255,255,255,0.2)" : "#e2e8f0",
                          color: role === "user" ? "white" : "text.primary",
                        }}
                      >
                        {children}
                      </Box>
                    );
                  },
                  a({ href, children }) {
                    return (
                      <Typography
                        component="a"
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: role === "user" ? "#bfdbfe" : "primary.main",
                          textDecoration: "underline",
                          "&:hover": { textDecoration: "none" },
                        }}
                      >
                        {children}
                      </Typography>
                    );
                  },
                  p({ children }) {
                    return (
                      <Typography variant="body2" sx={{ my: 0.5, lineHeight: 1.6 }}>
                        {children}
                      </Typography>
                    );
                  },
                  strong({ children }) {
                    return (
                      <Typography component="strong" sx={{ fontWeight: 600 }}>
                        {children}
                      </Typography>
                    );
                  },
                  li({ children }) {
                    return (
                      <Typography component="li" variant="body2" sx={{ ml: 3 }}>
                        {children}
                      </Typography>
                    );
                  },
                }}
              >
                {text}
              </ReactMarkdown>
            </Paper>
          </Box>
        </Box>
      ))}
      <div ref={bottomRef} />
    </Box>
  );
}
