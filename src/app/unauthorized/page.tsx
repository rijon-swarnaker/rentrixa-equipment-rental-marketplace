import Link from "next/link";
import { Home, ShieldAlert } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-[#09090b]">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg dark:border-white/10 dark:bg-[#18181b]">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <ShieldAlert size={32} />
        </div>

        <p className="mb-2 text-sm font-semibold tracking-widest text-red-500">
          ERROR 403
        </p>

        <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
          Unauthorized Access!
        </h1>

        <p className="mb-7 text-sm leading-6 text-gray-500 dark:text-gray-400">
          Sorry, you don&apos;t have permission to access this page.
          Please return to the homepage.
        </p>

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
      </div>
    </main>
  );
}