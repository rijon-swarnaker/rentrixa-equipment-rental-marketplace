
import Link from "next/link";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PaymentFailedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-[#09090b]">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg shadow-gray-200/50 dark:border-white/10 dark:bg-[#18181b] dark:shadow-black/20">
        {/* Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <AlertCircle size={34} />
        </div>

        {/* Status */}
        <p className="mb-2 text-sm font-bold tracking-[0.2em] text-red-600 dark:text-red-400">
          PAYMENT FAILED
        </p>

        {/* Title */}
        <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
          Payment Unsuccessful!
        </h1>

        {/* Description */}
        <p className="mb-7 text-sm leading-6 text-gray-500 dark:text-gray-400">
          Unfortunately, your payment could not be processed.
          Please try again or contact support if the problem continues.
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
        </Link>

        <p className="mt-6 text-xs font-medium tracking-widest text-gray-400 dark:text-gray-500">
          RENTRIXA
        </p>
      </div>
    </main>
  );
}
