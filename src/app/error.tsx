
"use client";

import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Home,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-slate-50 px-4 py-10 text-slate-900 transition-colors dark:bg-[#020817] dark:text-white">
      <Card className="w-full max-w-md rounded-3xl border-slate-200 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">

        <CardHeader className="items-center pt-8 text-center sm:pt-10">
          {/* Error Icon */}
          <div className="relative mb-4 flex size-20 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-500/10">
            <AlertTriangle className="size-10 text-red-500" />

            <span className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full border-4 border-white bg-orange-500 dark:border-slate-900">
              <ShieldAlert className="size-3 text-white" />
            </span>
          </div>

          <Badge
            variant="destructive"
            className="mb-2 rounded-full px-3 py-1"
          >
            Something Went Wrong
          </Badge>

          <CardTitle className="text-2xl font-bold sm:text-3xl">
            Unexpected Error!
          </CardTitle>

          <CardDescription className="mt-2 max-w-sm text-sm leading-6">
            Sorry! Something went wrong while loading this page.
            Please try again or return to the homepage.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error.digest && (
            <div className="rounded-lg bg-slate-100 px-3 py-2 text-center text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              Error ID: {error.digest}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-5 flex flex-col gap-3">
            <Button
              onClick={reset}
              className="h-11 w-full bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
            >
              <RefreshCw className="mr-2 size-4" />
              Try Again
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="h-11 w-full"
            >
              <Home className="mr-2 size-4" />
              Back to Home
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col border-t border-slate-100 pt-5">
          <p className="text-xs text-slate-400">
            Need help? We&apos;re here to support you.
          </p>

          <p className="mt-1 text-sm font-bold text-emerald-600">
            Rentrixa
          </p>

          <p className="text-xs text-slate-400">
            Rent Smarter. Work Better.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
