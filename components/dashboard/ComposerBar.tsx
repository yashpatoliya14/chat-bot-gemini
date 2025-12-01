"use client"
import { Dispatch, SetStateAction } from "react";
import { Box, TextField, IconButton, Paper, CircularProgress } from "@mui/material";
import { Send } from "@mui/icons-material";

export default function ComposerBar({ prompt, onPromptChange, onSend, isLoading }: {
  prompt: string,
  onPromptChange: (v: string) => void,
  onSend: () => void,
  isLoading: boolean,
  setIsLoading: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        width: { xs: "90%", sm: "70%", md: "60%", lg: "50%" },
        maxWidth: 900,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          borderRadius: 4,
          p: { xs: 1, sm: 1.5 },
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          bgcolor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={4}
          variant="standard"
          placeholder="Ask something…"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          InputProps={{
            disableUnderline: true,
            sx: {
              px: 1.5,
              py: 1,
              fontSize: { xs: "0.9rem", sm: "1rem" },
            },
          }}
          disabled={isLoading}
        />
        <IconButton
          onClick={onSend}
          disabled={isLoading || !prompt.trim()}
          color="primary"
          sx={{
            bgcolor: "primary.main",
            color: "white",
            "&:hover": {
              bgcolor: "primary.dark",
            },
            "&:disabled": {
              bgcolor: "action.disabledBackground",
            },
            width: { xs: 40, sm: 44 },
            height: { xs: 40, sm: 44 },
          }}
          aria-label="Send"
        >
          {isLoading ? (
            <CircularProgress size={20} sx={{ color: "white" }} />
          ) : (
            <Send sx={{ fontSize: { xs: 18, sm: 20 } }} />
          )}
        </IconButton>
      </Paper>
    </Box>
  );
};
