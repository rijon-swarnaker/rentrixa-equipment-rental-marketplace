"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

const BackToEquipment = () => {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => {
        // Fall back to the home page when the tab was opened directly.
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push("/");
        }
      }}
      className="h-10 gap-2 rounded-full border-border bg-background/80 px-4 text-sm font-medium shadow-sm backdrop-blur transition-all duration-200 hover:-translate-x-0.5 hover:border-primary/40 hover:text-primary"
    >
      <ArrowLeft className="size-4" />
      Back to Equipment
    </Button>
  );
};

export default BackToEquipment;
