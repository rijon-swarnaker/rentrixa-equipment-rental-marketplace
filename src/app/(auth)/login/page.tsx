"use client";

import { type FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Handshake,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
  Zap,
} from "lucide-react";

import {  GoogleIcon } from "@/components/shared/brand-icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";

type FormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Trusted & Secure",
    subtitle: "Platform",
  },
  {
    icon: Handshake,
    title: "Connect with",
    subtitle: "Verified Users",
  },
  {
    icon: Zap,
    title: "Rent or Earn",
    subtitle: "with Ease",
  },
];

// Simple login validation.
function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  }

  return errors;
}

export default function LogInPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormValues>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // Update a field and clear its old error.
  function updateField(field: keyof FormValues, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    setServerError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm(form);
    setErrors(nextErrors);
    setServerError("");

    if (Object.keys(nextErrors).length > 0) return;

    // Remember me validation
    if (!rememberMe) {
      toast.error("Please confirm Remember me", {
        description: "You must select Remember me before signing in.",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signIn.email({
        email: form.email.trim(),
        password: form.password,
        rememberMe,
      });

      if (error) {
        const message = error.message || "Login failed. Please try again.";
        setServerError(message);
        toast.error(message);
        return;
      }

      toast.success("Welcome back!", {
        description: "You have successfully signed in.",
      });

      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      setServerError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }
  async function handleSocialLogin() {
    setServerError("");
    const { error } = await signIn.social({ provider: "google", callbackURL: "/" });

    if (error) {
      setServerError(error.message || `Could not continue with Google.`);
    }
  }

  return (
    <section className="px-3 py-8 sm:px-5 lg:py-12">
      {/* Background artwork panel */}
      <div className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-3xl border border-white/10 shadow-xl shadow-black/10">
        <Image
          src="/assets/Signup-bg-img.png"
          alt=""
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover object-center"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-r from-black/45 via-black/15 to-transparent"
        />

        <div className="relative grid gap-8 p-4 sm:p-6 lg:min-h-[720px] lg:grid-cols-[1fr_520px] lg:items-center lg:gap-10 lg:p-10 xl:p-14">
          {/* ---------------- Left brand content ---------------- */}
          <div className="hidden text-white lg:block">
            <Link href="/" aria-label="Rentrixa home" className="inline-flex">
              <Image
                src="/assets/Logo.png"
                alt="Rentrixa"
                width={2172}
                height={724}
                className="h-11 w-auto brightness-0 invert"
              />
            </Link>

            <h1 className="mt-8 text-5xl font-bold tracking-tight xl:text-6xl">
              Welcome <span className="text-green-400">Back!</span>
            </h1>

            <p className="mt-4 max-w-md text-lg leading-relaxed text-white/75">
              Sign in to your Rentrixa account and continue your journey in the
              equipment rental marketplace.
            </p>

            <ul className="mt-10 flex flex-col gap-5">
              {FEATURES.map(({ icon: Icon, title, subtitle }) => (
                <li key={title} className="flex items-center gap-4">
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-green-400">
                    <Icon className="size-6" />
                  </span>
                  <div>
                    <p className="font-semibold text-white">{title}</p>
                    <p className="text-sm text-white/60">{subtitle}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------------- Form card ---------------- */}
          <div className="mx-auto w-full max-w-md rounded-2xl border border-border/60 bg-card p-5 shadow-2xl shadow-black/25 sm:p-7 lg:max-w-none lg:p-8">
            <div className="mb-6 flex justify-center lg:hidden">
              <Image
                src="/assets/Logo.png"
                alt="Rentrixa"
                width={2172}
                height={724}
                className="h-9 w-auto dark:brightness-0 dark:invert"
              />
            </div>

            <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">
              Sign In
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Welcome back! Please sign in to your account.
            </p>
            <span
              aria-hidden="true"
              className="mx-auto mt-4 block h-1 w-16 rounded-full bg-primary"
            />

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
              {/* Email */}
              <div>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    aria-label="Email Address"
                    aria-invalid={!!errors.email}
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    className="h-11 pl-10"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    aria-label="Password"
                    aria-invalid={!!errors.password}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(event) =>
                      updateField("password", event.target.value)
                    }
                    className="h-11 pr-10 pl-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember me + forgot password */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <label
                  htmlFor="remember"
                  className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground select-none"
                >
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked === true)
                    }
                  />
                  Remember me
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {serverError && (
                <p
                  role="alert"
                  className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {serverError}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="h-12 w-full gap-2 rounded-full text-base shadow-lg shadow-primary/20"
              >
                <LogIn className="size-5" />
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">
                or continue with
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <div className="flex flex-col gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialLogin()}
                className="h-11 gap-2 rounded-full"
              >
                <GoogleIcon className="size-4" />
                Continue with Google
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
