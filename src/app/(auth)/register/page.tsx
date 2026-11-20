"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  Check,
  CircleHelp,
  Eye,
  EyeOff,
  Handshake,
  Image as ImageIcon,
  Lock,
  Mail,
  ShieldCheck,
  UploadCloud,
  User,
  UserPlus,
  Zap,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, signUp } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  imageUrl: string;
  address: string;
  phone: string;
};

type FormErrors = Partial<Record<keyof FormValues | "image", string>>;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

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

// Password validation rules
const PASSWORD_RULES = [
  {
    label: "At least 8 characters",
    test: (password: string) => password.length >= 8,
  },
  {
    label: "One uppercase letter (A-Z)",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    label: "One lowercase letter (a-z)",
    test: (password: string) => /[a-z]/.test(password),
  },
  {
    label: "One number (0-9)",
    test: (password: string) => /[0-9]/.test(password),
  },
  {
    label: "One special character (@$!%*?&)",
    test: (password: string) => /[@$!%*?&]/.test(password),
  },
];

// Check whether password satisfies every rule
function isPasswordValid(password: string) {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}

// Form validation
function validateForm(values: FormValues, imageFile: File | null): FormErrors {
  const errors: FormErrors = {};

  // Name validation
  if (!values.name.trim()) {
    errors.name = "Full name is required.";
  } else if (values.name.trim().length < 2) {
    errors.name = "Full name must be at least 2 characters.";
  }

  // Email validation
  if (!values.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  // Password validation
  if (!values.password) {
    errors.password = "Password is required.";
  } else if (!isPasswordValid(values.password)) {
    errors.password = "Please meet all password requirements.";
  }

  // Confirm password validation
  if (!values.confirmPassword) {
    errors.confirmPassword = "Please re-type your password.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  // ID image validation
  if (!imageFile) {
    errors.image = "Please upload your ID image.";
  } else if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
    errors.image = "Please use a JPG, PNG or WebP image.";
  } else if (imageFile.size > MAX_IMAGE_SIZE) {
    errors.image = "Image must be 5MB or smaller.";
  }

  return errors;
}

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
    imageUrl: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // Password rule status
  const passwordRules = PASSWORD_RULES.map((rule) => ({
    label: rule.label,
    valid: rule.test(form.password),
  }));

  const passwordIsValid = isPasswordValid(form.password);

  // Update form fields
  function updateField(field: keyof FormValues, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));

    setServerError("");
  }

  // Handle image upload
  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setImageFile(file);
    const formData = new FormData();
    formData.append("image", file as Blob);

    const imgbbAPI = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`;

    const res = await fetch(imgbbAPI, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    const imageUrl = data.data.url;

    setForm((previous) => ({
      ...previous,
      imageUrl: imageUrl,
    }));

    console.log("Image Upload Response:", data);
  }

  // Handle registration
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm(form, imageFile);

    setErrors(nextErrors);
    setServerError("");

    if (Object.keys(nextErrors).length > 0) return;

    console.log("Registration Form Data:", {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
      imageUrl: form.imageUrl,
    });

    setLoading(true);

    try {
      const { data, error } = await signUp.email({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        image: form.imageUrl,
        address: form.address.trim(),
        phone: form.phone.trim(),
      });

      if (error) {
        const message =
          error.message ||
          "We could not create your account. Please try again.";

        setServerError(message);
        toast.error("Registration failed", {
          description: message,
        });
        return;
      }

      toast.success(`Hello ${data.user.name} Account created!`, {
        description: "Welcome to Rentrixa. Your account is ready.",
      });

      router.push("/");
    } catch {
      const message = "Something went wrong. Please try again.";

      setServerError(message);

      toast.error("Something went wrong!", {
        description: message,
      });
    } finally {
      setLoading(false);
    }
  }

  // Social login
  async function handleSocialLogin(provider: "google" | "github") {
    setServerError("");
    setSocialLoading(true);

    try {
      const { error } = await signIn.social({
        provider,
        callbackURL: "/",
      });

      if (error) {
        setServerError(error.message || `Could not continue with ${provider}.`);
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setSocialLoading(false);
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

        <div className="relative grid gap-8 p-4 sm:p-6 lg:min-h-[780px] lg:grid-cols-[1fr_520px] lg:items-center lg:gap-10 lg:p-10 xl:p-14">
          {/* Left brand content */}
          <div className="hidden text-white lg:block">
            <Link href="/" aria-label="Rentrixa home" className="inline-flex">
              <Image
                src="/assets/Logo.png"
                alt="Rentrixa"
                width={2172}
                height={724}
                className="h-25 w-auto "
              />
            </Link>

            <h1 className="mt-8 text-5xl font-bold tracking-tight xl:text-6xl">
              Join <span className="text-green-400">Rentrixa</span>
            </h1>

            <p className="mt-4 max-w-md text-lg leading-relaxed text-white/75">
              Start renting or listing equipment and be a part of our growing
              marketplace.
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

          {/* Registration form card */}
          <div className="mx-auto w-full max-w-md rounded-2xl border border-border/60 bg-card p-5 shadow-2xl shadow-black/25 sm:p-7 lg:max-w-none lg:p-8">
            {/* Mobile logo */}
            <div className="mb-6 flex justify-center lg:hidden">
              <Image
                src="/assets/Logo.png"
                alt="Rentrixa"
                width={2172}
                height={724}
                className="h-9 w-auto dark:brightness-0 dark:invert"
              />
            </div>

            <h2 className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Create Your Account
            </h2>

            <p className="mt-2 text-center text-sm text-muted-foreground">
              Get started with Rentrixa today
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
              {/* Full name */}
              <div>
                <div className="relative">
                  <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    aria-label="Full Name"
                    aria-invalid={!!errors.name}
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    className="h-11 pl-10"
                  />
                </div>

                {errors.name && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {errors.name}
                  </p>
                )}
              </div>

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

              {/* ID image upload */}
              <div>
                <div
                  className={cn(
                    "overflow-hidden rounded-xl border",
                    errors.image ? "border-destructive" : "border-input",
                  )}
                >
                  <div className="flex items-center justify-between gap-2 bg-muted/40 px-3 py-2.5">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ImageIcon className="size-4" />
                      Upload Your ID Image
                    </span>

                    <CircleHelp
                      aria-label="Your ID image is used to verify your account"
                      className="size-4 text-primary"
                    />
                  </div>

                  <label
                    htmlFor="idImage"
                    className="flex cursor-pointer flex-col items-center justify-center gap-1 border-t border-dashed border-border px-4 py-6 text-center transition-colors hover:bg-muted/40 focus-within:ring-3 focus-within:ring-ring/50 focus-within:outline-none"
                  >
                    <UploadCloud className="size-6 text-primary" />

                    <span className="text-sm font-medium text-foreground">
                      {imageFile
                        ? imageFile.name
                        : "Click to upload or drag and drop"}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      Supports: JPG, PNG, WebP — max 5MB
                    </span>

                    <input
                      id="idImage"
                      name="idImage"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                </div>

                {errors.image && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {errors.image}
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
                    autoComplete="new-password"
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

                {/* Live password requirements */}
                {form.password.length > 0 && (
                  <div className="mt-3 rounded-xl border border-border bg-muted/30 p-3">
                    <p className="mb-2 text-xs font-semibold text-foreground">
                      Password requirements
                    </p>

                    <div className="grid gap-2 sm:grid-cols-2">
                      {passwordRules.map((rule) => (
                        <div
                          key={rule.label}
                          className={cn(
                            "flex items-center gap-2 text-xs transition-colors",
                            rule.valid
                              ? "text-green-600 dark:text-green-400"
                              : "text-muted-foreground",
                          )}
                        >
                          {rule.valid ? (
                            <Check className="size-3.5 shrink-0" />
                          ) : (
                            <X className="size-3.5 shrink-0" />
                          )}

                          <span>{rule.label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          passwordRules.filter((rule) => rule.valid).length ===
                            5
                            ? "bg-green-500"
                            : "bg-primary",
                        )}
                        style={{
                          width: `${
                            (passwordRules.filter((rule) => rule.valid).length /
                              PASSWORD_RULES.length) *
                            100
                          }%`,
                        }}
                      />
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {passwordIsValid
                        ? "Strong password. All requirements met!"
                        : `${
                            passwordRules.filter((rule) => rule.valid).length
                          } of 5 requirements completed`}
                    </p>
                  </div>
                )}

                {errors.password && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    aria-label="Re-type Password"
                    aria-invalid={!!errors.confirmPassword}
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Re-type Password"
                    value={form.confirmPassword}
                    onChange={(event) =>
                      updateField("confirmPassword", event.target.value)
                    }
                    className="h-11 pr-10 pl-10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>

                {/* Live password match indicator */}
                {form.confirmPassword.length > 0 && (
                  <p
                    className={cn(
                      "mt-1.5 flex items-center gap-1.5 text-xs",
                      form.confirmPassword === form.password
                        ? "text-green-600 dark:text-green-400"
                        : "text-destructive",
                    )}
                  >
                    {form.confirmPassword === form.password ? (
                      <>
                        <Check className="size-3.5" />
                        Passwords match
                      </>
                    ) : (
                      <>
                        <X className="size-3.5" />
                        Passwords do not match
                      </>
                    )}
                  </p>
                )}

                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-destructive">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Server error */}
              {serverError && (
                <p
                  role="alert"
                  className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {serverError}
                </p>
              )}

              {/* Register button */}
              <Button
                type="submit"
                size="lg"
                disabled={loading || socialLoading}
                className="h-12 w-full gap-2 rounded-full text-base shadow-lg shadow-primary/20"
              >
                <UserPlus className="size-5" />

                {loading ? "Creating account..." : "Register Account"}

                {!loading && <ArrowRight className="size-4" />}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />

              <span className="text-xs text-muted-foreground">
                or continue with
              </span>

              <span className="h-px flex-1 bg-border" />
            </div>

            {/* Social login */}
            <div className="flex flex-col gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={loading || socialLoading}
                onClick={() => handleSocialLogin("google")}
                className="h-11 gap-2 rounded-full"
              >
                <GoogleIcon className="size-4" />
                Continue with Google
              </Button>
            </div>

            {/* Sign in link */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Google icon */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29A11.99 11.99 0 0 0 0 12c0 1.94.46 3.77 1.29 5.38l3.98-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}
