
import Link from "next/link";
import { ArrowLeft, Home, SearchX } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-[#09090b]">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg shadow-gray-200/50 dark:border-white/10 dark:bg-[#18181b] dark:shadow-black/20">
        {/* Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400">
          <SearchX size={32} />
        </div>

        {/* Error Code */}
        <p className="mb-2 text-sm font-bold tracking-[0.2em] text-green-600 dark:text-green-400">
          ERROR 404
        </p>

        {/* Title */}
        <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
          Page Not Found!
        </h1>

        {/* Description */}
        <p className="mb-7 text-sm leading-6 text-gray-500 dark:text-gray-400">
          Oops! The page you&apos;re looking for doesn&apos;t exist
          or may have been moved. Let&apos;s get you back to Rentrixa.
        </p>

        {/* Home Button */}
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "default" }),
            "w-full rounded-xl bg-green-600 text-white hover:bg-green-700"
          )}
        >
          <Home className="mr-2 h-4 w-4" />
          Back to Home
          <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
        </Link>

        <p className="mt-6 text-xs font-medium tracking-widest text-gray-400 dark:text-gray-500">
          RENTRIXA
        </p>
      </div>
    </main>
  );
}
