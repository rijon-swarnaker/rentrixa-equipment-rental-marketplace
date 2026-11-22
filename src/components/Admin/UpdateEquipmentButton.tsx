"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Save } from "lucide-react";
import { toast } from "sonner";

import StatusSelect, {
  normalizeEquipmentStatus,
  type TEquipmentStatus,
} from "@/components/Admin/StatusSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { updateEquipment } from "@/lib/api/equipment";
import type { TEquipment } from "@/types";

type TAdminEquipment = TEquipment & {
  _id: string;
};

type EquipmentForm = {
  name: string;
  brand: string;
  model: string;
  category: string;
  location: string;
  price: string;
  quantity: string;
  description: string;
  image: string;
  rentalType: "daily" | "weekly" | "monthly";
  status: TEquipmentStatus;
};

type UpdateEquipmentButtonProps = {
  equipment: TAdminEquipment;
};

const UpdateEquipmentButton = ({ equipment }: UpdateEquipmentButtonProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState<EquipmentForm>(() => ({
    name: equipment.name || "",
    brand: equipment.brand || "",
    model: equipment.model || "",
    category: equipment.category || "",
    location: equipment.location || "",
    price: String(equipment.price ?? ""),
    quantity: String(equipment.quantity ?? ""),
    description: equipment.description || "",
    image: equipment.image || "",
    rentalType:
      equipment.rentalType === "weekly" || equipment.rentalType === "monthly"
        ? equipment.rentalType
        : "daily",
    status: normalizeEquipmentStatus(equipment.status),
  }));

  const updateField = (field: keyof EquipmentForm, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    if (!form.name.trim() || !form.brand.trim() || !form.model.trim()) {
      toast.error("Name, brand and model are required.");
      return;
    }

    if (Number(form.price) <= 0 || Number(form.quantity) < 1) {
      toast.error("Please enter a valid price and quantity.");
      return;
    }

    setIsSaving(true);

    try {
      await updateEquipment(equipment._id, {
        name: form.name.trim(),
        brand: form.brand.trim(),
        model: form.model.trim(),
        category: form.category.trim(),
        location: form.location.trim(),
        price: form.price,
        quantity: form.quantity,
        description: form.description,
        image: form.image.trim(),
        rentalType: form.rentalType,
        status: form.status,
      });

      toast.success(`${form.name.trim()} updated successfully.`);
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update equipment."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        aria-label={`Update ${equipment.name}`}
        className="h-8 gap-1.5 rounded-full border-sky-500/40 px-3 text-xs font-medium text-sky-600 hover:bg-sky-500/10 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-400"
      >
        <Pencil className="size-3.5" />
        Update
      </Button>

      <Dialog open={open} onOpenChange={(nextOpen) => !isSaving && setOpen(nextOpen)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <div className="mb-1 flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
              <Pencil className="size-5" />
            </div>

            <DialogTitle className="text-lg font-semibold">
              Update Equipment
            </DialogTitle>

            <DialogDescription>
              Edit the equipment details and save your changes.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="update-name">Equipment Name</Label>
                <Input
                  id="update-name"
                  required
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Equipment name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="update-brand">Brand</Label>
                <Input
                  id="update-brand"
                  required
                  value={form.brand}
                  onChange={(event) => updateField("brand", event.target.value)}
                  placeholder="Brand"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="update-model">Model</Label>
                <Input
                  id="update-model"
                  required
                  value={form.model}
                  onChange={(event) => updateField("model", event.target.value)}
                  placeholder="Model"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="update-category">Category</Label>
                <Input
                  id="update-category"
                  value={form.category}
                  onChange={(event) =>
                    updateField("category", event.target.value)
                  }
                  placeholder="Category"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="update-location">Location</Label>
                <Input
                  id="update-location"
                  value={form.location}
                  onChange={(event) =>
                    updateField("location", event.target.value)
                  }
                  placeholder="Location"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="update-price">Price (৳)</Label>
                <Input
                  id="update-price"
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.price}
                  onChange={(event) => updateField("price", event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="update-quantity">Quantity</Label>
                <Input
                  id="update-quantity"
                  required
                  type="number"
                  min="1"
                  step="1"
                  value={form.quantity}
                  onChange={(event) =>
                    updateField("quantity", event.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Rental Type</Label>
                <Select
                  value={form.rentalType}
                  onValueChange={(value) =>
                    updateField("rentalType", value as string)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Rental type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <StatusSelect
                  value={form.status}
                  onChange={(status) =>
                    setForm((previous) => ({ ...previous, status }))
                  }
                  ariaLabel="Equipment status"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="update-image">Image URL</Label>
                <Input
                  id="update-image"
                  value={form.image}
                  onChange={(event) => updateField("image", event.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="update-description">Description</Label>
                <Textarea
                  id="update-description"
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  placeholder="Describe the equipment..."
                  className="resize-none"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateEquipmentButton;
