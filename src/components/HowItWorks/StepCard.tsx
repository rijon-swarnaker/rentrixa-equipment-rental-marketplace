import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type StepCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  note: string;
  index: number;
};

const StepCard = ({
  icon: Icon,
  title,
  description,
  note,
  index,
}: StepCardProps) => {
  return (
    <Card
      style={{ animationDelay: `${120 + index * 90}ms` }}
      className="group animate-fade-up h-full border border-border/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
    >
      <CardHeader>
        <span
          aria-hidden="true"
          className="relative flex size-12 w-fit items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 transition-transform duration-300 group-hover:scale-105"
        >
          <Icon className="size-6" strokeWidth={1.8} />

          <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ring-2 ring-card shadow-sm">
            {index + 1}
          </span>
        </span>

        <CardTitle className="mt-4 text-lg font-semibold">{title}</CardTitle>

        <CardDescription className="text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-auto pt-2">
        <div className="h-px w-full bg-gradient-to-r from-primary/50 to-transparent" />
        <p className="mt-3 text-xs font-medium text-primary">{note}</p>
      </CardContent>
    </Card>
  );
};

export default StepCard;
