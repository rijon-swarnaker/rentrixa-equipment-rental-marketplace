"use client";

import * as React from "react";
import NextImage from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  Boxes,
  CalendarClock,
  CircleDollarSign,
  FileText,
  ImagePlus,
  Info,
  Loader2,
  MapPin,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Truck,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "cn";
import { addEquipment } from "@/lib/actions/equipment";
import { TEquipment } from "@/types";
import { useRouter } from "next/navigation";

type Owner = {
  name: string;
  email: string;
  image: string | null;
};

const CATEGORIES = [
  "Construction Equipment",
  "Photography Equipment",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

const CONDITIONS = ["Brand new", "Like new", "Excellent", "Good", "Fair"];

const RENTAL_TYPES = [
  { value: "daily", label: "Daily", suffix: "day" },
  { value: "weekly", label: "Weekly", suffix: "week" },
  { value: "monthly", label: "Monthly", suffix: "month" },
] as const;

type RentalType = (typeof RENTAL_TYPES)[number]["value"];

const STATUSES = ["pending", "approved", "rejected"] as const;
type EquipmentStatus = (typeof STATUSES)[number];
const DEFAULT_STATUS: EquipmentStatus = "pending";

const MAX_DESCRIPTION_LENGTH = 500;
const MAX_TERMS_LENGTH = 1000;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const INITIAL_FORM = {
  name: "",
  description: "",
  location: "",
  price: "",
  quantity: "1",
  brand: "",
  model: "",
  // Rental terms and conditions written by the owner for this equipment.
  rentalTerms: "",
  // Hosted URL returned by the image upload. Empty until an upload succeeds.
  image: "",
};

type FormState = typeof INITIAL_FORM;
type FormErrors = Partial<
  Record<keyof FormState | "category" | "condition", string>
>;

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function SectionCard({
  icon: Icon,
  title,
  description,
  className,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6",
        className,
      )}
    >
      <div className="mb-5 flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-4.5" />
        </span>

        <div className="min-w-0">
          <h2 className="text-base font-semibold leading-tight">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>

      {children}
    </section>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor} className="gap-1 text-sm font-medium">
        <span>{label}</span>
        {required ? <span className="text-destructive">*</span> : null}
      </Label>

      {children}

      {error ? (
        <p className="text-xs font-medium text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function AddEquipmentForm({ owner }: { owner: Owner }) {
  const [form, setForm] = React.useState<FormState>(INITIAL_FORM);
  const [category, setCategory] = React.useState("");
  const [condition, setCondition] = React.useState("");
  const [rentalType, setRentalType] = React.useState<RentalType>("daily");
  const [errors, setErrors] = React.useState<FormErrors>({});

  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const router = useRouter();

  // Identifies the latest upload so a slow, outdated response (the user picked
  // another file or removed the image meanwhile) can be ignored.
  const uploadIdRef = React.useRef(0);

  // Release the object URL when the preview changes or the page unmounts.
  React.useEffect(() => {
    if (!previewUrl) return;

    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const ownerInitials =
    owner.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "R";

  const priceSuffix =
    RENTAL_TYPES.find((type) => type.value === rentalType)?.suffix ?? "day";

  function clearError(field: keyof FormErrors) {
    setErrors((previous) => {
      if (!(field in previous)) return previous;

      const next = { ...previous };
      delete next[field];
      return next;
    });
  }

  function updateField(field: keyof FormState, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
    clearError(field);
  }

  function openFileDialog() {
    fileInputRef.current?.click();
  }

  function resetFileInput() {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // Uploads the file to imgbb and stores the hosted URL in the form state.
  async function uploadImage(file: File) {
    const uploadId = ++uploadIdRef.current;
    setIsUploading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!apiKey) {
        throw new Error("NEXT_PUBLIC_IMGBB_API_KEY is not set.");
      }

      const body = new FormData();
      body.append("image", file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body,
      });
      const data = await res.json();

      const imageUrl = data?.data?.url;
      console.log(imageUrl);

      if (!res.ok || !data?.success) {
        throw new Error(data?.error?.message ?? "Image upload failed.");
      }

      // A newer pick or a removal happened while this request was in flight.
      if (uploadId !== uploadIdRef.current) return;

      updateField("image", data.data.url as string);
    } catch (error) {
      if (uploadId !== uploadIdRef.current) return;

      console.error("Image upload error:", error);
      removeImage();
      toast.error("Image upload failed", {
        description: "Check your connection and try again.",
      });
    } finally {
      if (uploadId === uploadIdRef.current) {
        setIsUploading(false);
      }
    }
  }

  // Single entry point for both the file dialog and drag and drop.
  function applyImage(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("That file is not an image", {
        description: "Choose a PNG, JPG or WEBP file.",
      });
      resetFileInput();
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image is too large", {
        description: "Please choose an image smaller than 5 MB.",
      });
      resetFileInput();
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    updateField("image", ""); // drop any previously uploaded URL
    void uploadImage(file);
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    // Cancelling the dialog gives no file, so keep whatever is already selected.
    if (file) applyImage(file);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (file) applyImage(file);
  }

  function handleDropzoneKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFileDialog();
    }
  }

  function removeImage() {
    uploadIdRef.current += 1; // ignore any upload that is still running
    setIsUploading(false);
    setImageFile(null);
    setPreviewUrl(null);
    updateField("image", "");
    resetFileInput();
  }

  function validate() {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Enter the equipment name.";
    }

    if (!category) {
      nextErrors.category = "Select a category.";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Add a short description.";
    }

    if (!form.brand.trim()) {
      nextErrors.brand = "Enter the equipment brand.";
    }

    if (!form.model.trim()) {
      nextErrors.model = "Enter the equipment model.";
    }

    if (!form.image.trim()) {
      nextErrors.image = "Please add an image of the equipment.";
    }

    if (!form.location.trim()) {
      nextErrors.location = "Where is the equipment located?";
    }

    if (!form.price.trim()) {
      nextErrors.price = "Enter a rental price.";
    } else if (Number(form.price) <= 0) {
      nextErrors.price = "Price must be greater than 0.";
    }

    if (!form.quantity.trim()) {
      nextErrors.quantity = "Enter the available quantity.";
    } else if (
      !Number.isInteger(Number(form.quantity)) ||
      Number(form.quantity) < 1
    ) {
      nextErrors.quantity = "Quantity must be a whole number, at least 1.";
    }

    if (!condition) {
      nextErrors.condition = "Select the equipment condition.";
    }

    if (!form.rentalTerms.trim()) {
      nextErrors.rentalTerms = "Add your rental terms and conditions.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isUploading) {
      toast.error("Please wait for the image to finish uploading.");
      return;
    }

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please complete the highlighted fields.");
      return;
    }

    const ownerName = owner.name;
    const ownerEmail = owner.email;
    const ownerImage = owner.image;

    // `form.image` already holds the hosted image URL and `form.rentalTerms`
    // the owner's terms, so both are included by the spread below.
    const payload: TEquipment = {
      ...form,
      category,
      condition,
      rentalType,
      ownerName,
      ownerEmail,
      ownerImage,
      status: DEFAULT_STATUS,
    };
    console.log("Form data:", payload);

    const result = await addEquipment(payload);

    if (!result) {
      toast.error("Failed to add equipment.");
      return;
    }

    toast.success("Equipment added successfully!");
    router.push("/dashboard/owner/my-equipment");
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/dashboard" className="hover:text-foreground">
                Dashboard
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>Owner</li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-foreground">Add equipment</li>
          </ol>
        </nav>

        <Link
          href="/dashboard/owner/my-equipment"
          className="hidden items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
        >
          <ArrowLeft className="size-4" />
          My equipment
        </Link>
      </div>

      {/* Page header */}
      <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-800 to-emerald-950 px-5 py-7 text-white shadow-lg sm:px-8 sm:py-9">
        {/* Excavator photo, faded into the green panel */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] sm:block"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.55) 40%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.55) 40%, black 100%)",
          }}
        >
          <NextImage
            src="/assets/Hero-layer-1.png"
            alt=""
            fill
            sizes="(max-width: 1024px) 55vw, 700px"
            className="object-cover object-right opacity-55"
          />
          <div className="absolute inset-0 bg-emerald-950/35" />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-emerald-300/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-1/3 size-56 rounded-full bg-lime-300/20 blur-3xl"
        />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="size-3.5" />
              Owner dashboard
            </span>

            <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Add new equipment
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-emerald-50/85 sm:text-base">
              Share the details of your equipment and start receiving rental
              requests from verified renters.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur sm:max-w-60">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <Truck className="size-5" />
            </span>

            <div>
              <p className="text-sm font-semibold">Get discovered</p>
              <p className="mt-0.5 text-xs leading-snug text-emerald-50/80">
                Complete listings get up to 3× more booking requests.
              </p>
            </div>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          {/* Main column */}
          <div className="space-y-6">
            <SectionCard
              icon={Boxes}
              title="Equipment details"
              description="Tell renters exactly what you are listing."
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Equipment name"
                  htmlFor="equipment-name"
                  required
                  error={errors.name}
                >
                  <Input
                    id="equipment-name"
                    className="h-10"
                    placeholder="e.g. CAT 320 Excavator"
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    aria-invalid={Boolean(errors.name)}
                  />
                </Field>

                <Field
                  label="Category"
                  htmlFor="equipment-category"
                  required
                  error={errors.category}
                >
                  <Select
                    value={category}
                    onValueChange={(value) => {
                      setCategory(value ?? "");
                      clearError("category");
                    }}
                  >
                    <SelectTrigger
                      id="equipment-category"
                      className="w-full data-[size=default]:h-10"
                      aria-invalid={Boolean(errors.category)}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>

                    <SelectContent>
                      {CATEGORIES.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field
                  label="Description"
                  htmlFor="equipment-description"
                  required
                  error={errors.description}
                  className="sm:col-span-2"
                >
                  <Textarea
                    id="equipment-description"
                    rows={5}
                    maxLength={MAX_DESCRIPTION_LENGTH}
                    placeholder="Describe the equipment, its features, attachments and anything renters should know."
                    value={form.description}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    aria-invalid={Boolean(errors.description)}
                    className="min-h-32 resize-y"
                  />

                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      Up to {MAX_DESCRIPTION_LENGTH} characters.
                    </p>
                    <p
                      className={cn(
                        "text-xs tabular-nums",
                        form.description.length >= MAX_DESCRIPTION_LENGTH
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-muted-foreground",
                      )}
                    >
                      {form.description.length}/{MAX_DESCRIPTION_LENGTH}
                    </p>
                  </div>
                </Field>

                <Field
                  label="Brand"
                  htmlFor="equipment-brand"
                  required
                  error={errors.brand}
                >
                  <Input
                    id="equipment-brand"
                    className="h-10"
                    placeholder="e.g. Caterpillar"
                    value={form.brand}
                    onChange={(event) =>
                      updateField("brand", event.target.value)
                    }
                    aria-invalid={Boolean(errors.brand)}
                  />
                </Field>

                <Field
                  label="Model"
                  htmlFor="equipment-model"
                  required
                  error={errors.model}
                >
                  <Input
                    id="equipment-model"
                    className="h-10"
                    placeholder="e.g. 320 GC"
                    value={form.model}
                    onChange={(event) =>
                      updateField("model", event.target.value)
                    }
                    aria-invalid={Boolean(errors.model)}
                  />
                </Field>
              </div>
            </SectionCard>

            <SectionCard
              icon={CalendarClock}
              title="Rental details"
              description="Set your price, availability and pickup location."
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Location"
                  htmlFor="equipment-location"
                  required
                  error={errors.location}
                  className="sm:col-span-2"
                >
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="equipment-location"
                      className="h-10 pl-9"
                      placeholder="City, state"
                      value={form.location}
                      onChange={(event) =>
                        updateField("location", event.target.value)
                      }
                      aria-invalid={Boolean(errors.location)}
                    />
                  </div>
                </Field>

                <Field
                  label="Rental price"
                  htmlFor="equipment-price"
                  required
                  error={errors.price}
                >
                  <div className="relative">
                    <CircleDollarSign className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="equipment-price"
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      className="h-10 pl-9 pr-16"
                      placeholder="0.00"
                      value={form.price}
                      onChange={(event) =>
                        updateField("price", event.target.value)
                      }
                      aria-invalid={Boolean(errors.price)}
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                      /{priceSuffix}
                    </span>
                  </div>
                </Field>

                <Field
                  label="Available quantity"
                  htmlFor="equipment-quantity"
                  required
                  error={errors.quantity}
                >
                  <Input
                    id="equipment-quantity"
                    type="number"
                    min="1"
                    step="1"
                    inputMode="numeric"
                    className="h-10"
                    value={form.quantity}
                    onChange={(event) =>
                      updateField("quantity", event.target.value)
                    }
                    aria-invalid={Boolean(errors.quantity)}
                  />
                </Field>

                <Field
                  label="Equipment condition"
                  htmlFor="equipment-condition"
                  required
                  error={errors.condition}
                >
                  <Select
                    value={condition}
                    onValueChange={(value) => {
                      setCondition(value ?? "");
                      clearError("condition");
                    }}
                  >
                    <SelectTrigger
                      id="equipment-condition"
                      className="w-full data-[size=default]:h-10"
                      aria-invalid={Boolean(errors.condition)}
                    >
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>

                    <SelectContent>
                      {CONDITIONS.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <div className="space-y-2">
                  <span
                    id="rental-type-label"
                    className="flex text-sm font-medium"
                  >
                    Rental type <span className="ml-1 text-destructive">*</span>
                  </span>

                  <div
                    role="radiogroup"
                    aria-labelledby="rental-type-label"
                    className="grid grid-cols-3 gap-1.5 rounded-xl border border-border bg-muted/40 p-1.5"
                  >
                    {RENTAL_TYPES.map((type) => {
                      const isActive = rentalType === type.value;

                      return (
                        <button
                          key={type.value}
                          type="button"
                          role="radio"
                          aria-checked={isActive}
                          onClick={() => setRentalType(type.value)}
                          className={cn(
                            "flex flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:bg-background hover:text-foreground",
                          )}
                        >
                          <span>{type.label}</span>
                          <span
                            className={cn(
                              "whitespace-nowrap text-[11px] font-normal",
                              isActive
                                ? "text-primary-foreground/80"
                                : "text-muted-foreground",
                            )}
                          >
                            per {type.suffix}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              icon={FileText}
              title="Rental terms and conditions"
              description="Set the rules renters must follow when they rent this equipment."
            >
              <Field
                label="Terms and conditions"
                htmlFor="equipment-terms"
                required
                error={errors.rentalTerms}
              >
                <Textarea
                  id="equipment-terms"
                  rows={6}
                  maxLength={MAX_TERMS_LENGTH}
                  placeholder="e.g. Security deposit, fuel policy, late return fee, damage liability, operator requirements, cancellation policy."
                  value={form.rentalTerms}
                  onChange={(event) =>
                    updateField("rentalTerms", event.target.value)
                  }
                  aria-invalid={Boolean(errors.rentalTerms)}
                  className="min-h-36 resize-y"
                />

                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    Up to {MAX_TERMS_LENGTH} characters.
                  </p>
                  <p
                    className={cn(
                      "text-xs tabular-nums",
                      form.rentalTerms.length >= MAX_TERMS_LENGTH
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-muted-foreground",
                    )}
                  >
                    {form.rentalTerms.length}/{MAX_TERMS_LENGTH}
                  </p>
                </div>
              </Field>
            </SectionCard>
          </div>

          {/* Side column */}
          <div className="space-y-6">
            <SectionCard
              icon={ImagePlus}
              title="Equipment image"
              description="A clear cover photo builds trust."
            >
              <input
                ref={fileInputRef}
                id="equipment-image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />

              {previewUrl ? (
                <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
                  <div className="relative aspect-[4/3] w-full">
                    <NextImage
                      src={previewUrl}
                      alt={imageFile?.name ?? "Selected equipment preview"}
                      fill
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 352px"
                      className="object-cover"
                    />

                    {isUploading ? (
                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/70 text-sm font-medium">
                        <Loader2 className="size-4 animate-spin" />
                        Uploading…
                      </div>
                    ) : null}

                    <button
                      type="button"
                      onClick={removeImage}
                      aria-label="Remove image"
                      className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm ring-1 ring-border transition-colors hover:bg-destructive hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-border p-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">
                        {imageFile?.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {imageFile ? formatFileSize(imageFile.size) : null}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={openFileDialog}
                    >
                      Replace
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={openFileDialog}
                  onKeyDown={handleDropzoneKeyDown}
                  onDragEnter={() => setIsDragging(true)}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={cn(
                    "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 px-4 py-10 text-center transition-colors outline-none hover:border-primary/50 hover:bg-primary/5 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/50",
                    isDragging && "border-primary bg-primary/10",
                  )}
                >
                  <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Upload className="size-5" />
                  </span>

                  <div>
                    <p className="text-sm font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      PNG, JPG or WEBP (max. 5 MB)
                    </p>
                  </div>

                  <span className="inline-flex h-7 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-[0.8rem] font-medium">
                    Choose file
                  </span>
                </div>
              )}

              {errors.image ? (
                <p className="mt-2 text-xs font-medium text-destructive">
                  {errors.image}
                </p>
              ) : null}

              <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="mt-0.5 size-3.5 shrink-0" />
                You will be able to preview and replace the image before saving.
              </p>
            </SectionCard>

            <SectionCard
              icon={UserRound}
              title="Owner information"
              description="Renters will use these details to reach you."
            >
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                <Avatar className="size-11">
                  <AvatarImage src={owner.image ?? undefined} alt="" />
                  <AvatarFallback>{ownerInitials}</AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{owner.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {owner.email}
                  </p>
                </div>

                <BadgeCheck className="size-5 shrink-0 text-primary" />
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                Pulled from your profile.{" "}
                <Link
                  href="/dashboard/owner/profile"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Edit profile
                </Link>
              </p>
            </SectionCard>

            <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                Your listing is reviewed by our team before it goes live.
              </div>
            </section>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-xs text-muted-foreground sm:max-w-md">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" />
            You can update these details any time from My Equipment.
          </p>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Link
              href="/dashboard/owner/my-equipment"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-10 justify-center px-5",
              )}
            >
              Cancel
            </Link>

            <Button type="submit" className="h-10 px-5" disabled={isUploading}>
              {isUploading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <PlusCircle />
              )}
              {isUploading ? "Uploading image…" : "Add equipment"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}