
"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CheckCircle2,
  Info,
  AlertTriangle,
  XCircle,
  Loader2,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      closeButton
      richColors={false}
      expand={true}
      visibleToasts={3}
      duration={4000}
      gap={12}
      offset={20}
      mobileOffset={16}
      className="toaster group"
      icons={{
        success: (
          <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
        ),
        info: <Info className="size-5 shrink-0 text-blue-500" />,
        warning: (
          <AlertTriangle className="size-5 shrink-0 text-amber-500" />
        ),
        error: <XCircle className="size-5 shrink-0 text-red-500" />,
        loading: (
          <Loader2 className="size-5 shrink-0 animate-spin text-primary" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--card)",
          "--normal-text": "var(--card-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "16px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "!flex !items-center !gap-3 !rounded-2xl !border !border-border/70 !bg-card !px-4 !py-3 !shadow-lg !shadow-black/5 dark:!shadow-black/20",

          content: "!flex !min-w-0 !flex-1 !flex-col !gap-0.5",

          title:
            "!text-sm !font-semibold !leading-5 !tracking-tight !text-card-foreground",

          description:
            "!text-xs !leading-5 !text-muted-foreground",

          icon: "!flex !shrink-0 !items-center !justify-center",

          actionButton:
            "!rounded-lg !bg-primary !px-3 !py-1.5 !text-xs !font-semibold !text-primary-foreground",

          cancelButton:
            "!rounded-lg !bg-muted !px-3 !py-1.5 !text-xs !text-muted-foreground",

          closeButton:
            "!absolute !right-2 !top-2 !flex !size-6 !items-center !justify-center !rounded-full !border-0 !bg-transparent !text-muted-foreground hover:!bg-muted",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
