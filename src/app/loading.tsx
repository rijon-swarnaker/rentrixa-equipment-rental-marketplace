
import { LoaderCircle, Package, ShieldCheck } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-white px-4 py-8 text-slate-900 transition-colors duration-300 dark:bg-[#020817] dark:text-white sm:px-6">

      <div className="flex w-full max-w-sm flex-col items-center text-center">

        {/* Logo */}
        <div className="mb-7 flex items-center gap-2 sm:mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white shadow-lg shadow-green-600/20 sm:h-12 sm:w-12">
            <Package className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>

          <span className="text-xl font-bold tracking-tight sm:text-2xl">
            Rentri<span className="text-green-600">xa</span>
          </span>
        </div>

        {/* Animated Loader */}
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center sm:mb-7 sm:h-24 sm:w-24">

          <div className="absolute inset-0 rounded-full border-4 border-green-600/10 dark:border-green-500/10" />

          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-green-600 border-r-green-600 dark:border-t-green-500 dark:border-r-green-500" />

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600/10 text-green-600 dark:bg-green-500/10 dark:text-green-500 sm:h-14 sm:w-14">
            <LoaderCircle className="h-6 w-6 animate-pulse sm:h-7 sm:w-7" />
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-lg font-bold tracking-tight sm:text-xl">
          Getting things ready...
        </h2>

        <p className="mt-2 max-w-[280px] text-xs leading-6 text-slate-500 dark:text-slate-400 sm:max-w-xs sm:text-sm">
          Please wait while we prepare your rental experience.
        </p>

        {/* Loading Dots */}
        <div className="mt-5 flex items-center gap-1.5 sm:mt-6">
          <span className="h-2 w-2 animate-bounce rounded-full bg-green-600 [animation-delay:-0.3s] dark:bg-green-500" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-green-600 [animation-delay:-0.15s] dark:bg-green-500" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-green-600 dark:bg-green-500" />
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-center text-[11px] text-slate-500 dark:text-slate-400 sm:mt-10 sm:text-xs">
          <ShieldCheck className="h-4 w-4 shrink-0 text-green-600 dark:text-green-500" />
          <span>Your rental journey starts here</span>
        </div>

      </div>
    </div>
  );
}
