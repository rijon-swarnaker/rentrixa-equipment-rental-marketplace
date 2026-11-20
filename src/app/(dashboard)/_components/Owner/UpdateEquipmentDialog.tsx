"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, PackageCheck, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

import type { TEquipment } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateEquipment } from "@/lib/actions/equipment";

export type TEquipmentWithId = TEquipment & {
  _id: string;
};

export type TEquipmentForm = {
  brand: string;
  category: string;
  condition: string;
  description: string;
  image: string;
  location: string;
  model: string;
  name: string;
  price: string;
  quantity: string;
  rentalTerms: string;
  rentalType: "daily" | "weekly" | "monthly";
};

type Props = {
  equipment: TEquipmentWithId;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: (updated: TEquipmentWithId) => void;
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

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function UpdateEquipmentDialog({
  equipment,
  open,
  onOpenChange,
  onUpdated,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<TEquipmentForm>(() => ({
    brand: equipment.brand || "",
    category: equipment.category || "",
    condition: equipment.condition || "",
    description: equipment.description || "",
    image: equipment.image || "",
    location: equipment.location || "",
    model: equipment.model || "",
    name: equipment.name || "",
    price: String(equipment.price ?? ""),
    quantity: String(equipment.quantity ?? ""),
    rentalTerms: equipment.rentalTerms || "",
    rentalType: equipment.rentalType || "daily",
  }));

  const handleChange = (field: keyof TEquipmentForm, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    if (Number(formData.price) <= 0 || Number(formData.quantity) < 1) {
      toast.error("Please enter a valid price and quantity.");
      return;
    }

    try {
      setLoading(true);

      const response = await updateEquipment(equipment._id, formData);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update equipment.");
      }

      const updatedEquipment: TEquipmentWithId = {
        ...equipment,
        ...formData,
      };

      onUpdated(updatedEquipment);

      toast.success("Equipment updated successfully.");

      onOpenChange(false);

      router.refresh();
    } catch (error) {
      console.error("Update Equipment Error:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to update equipment.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <PackageCheck className="size-5" />
          </div>

          <DialogTitle className="text-xl font-semibold">
            Update Equipment
          </DialogTitle>

          <DialogDescription>
            Update your equipment information and rental details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-3">
          {/* Basic Information */}

          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">Basic Information</h3>
              <p className="text-xs text-muted-foreground">
                Update your equipment details.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Equipment Name */}

              <div className="space-y-2">
                <Label htmlFor="equipment-name">Equipment Name</Label>

                <Input
                  id="equipment-name"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Equipment name"
                />
              </div>

              {/* Brand */}

              <div className="space-y-2">
                <Label htmlFor="equipment-brand">Brand</Label>

                <Input
                  id="equipment-brand"
                  required
                  value={formData.brand}
                  onChange={(e) => handleChange("brand", e.target.value)}
                  placeholder="Brand name"
                />
              </div>

              {/* Model */}

              <div className="space-y-2">
                <Label htmlFor="equipment-model">Model</Label>

                <Input
                  id="equipment-model"
                  required
                  value={formData.model}
                  onChange={(e) => handleChange("model", e.target.value)}
                  placeholder="Model name"
                />
              </div>

              {/* Category */}

              <div className="space-y-2">
                <Label>Category</Label>

                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleChange("category", value as string)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>

                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Condition */}

              <div className="space-y-2">
                <Label>Condition</Label>

                <Select
                  value={formData.condition}
                  onValueChange={(value) =>
                    handleChange("condition", value as string)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>

                  <SelectContent>
                    {CONDITIONS.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}

              <div className="space-y-2">
                <Label htmlFor="equipment-location">Location</Label>

                <Input
                  id="equipment-location"
                  required
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="Equipment location"
                />
              </div>
            </div>

            {/* Description */}

            <div className="space-y-2">
              <Label htmlFor="equipment-description">Description</Label>

              <Textarea
                id="equipment-description"
                required
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe your equipment..."
                className="resize-none"
              />
            </div>

            {/* Image */}

            <div className="space-y-2">
              <Label htmlFor="equipment-image">Equipment Image URL</Label>

              <div className="relative">
                <ImageIcon className="absolute left-3 top-3 size-4 text-muted-foreground" />

                <Input
                  id="equipment-image"
                  required
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleChange("image", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="pl-9"
                />
              </div>
            </div>
          </section>

          <div className="border-t" />

          {/* Rental Information */}

          <section className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">Rental Information</h3>

              <p className="text-xs text-muted-foreground">
                Manage pricing and rental conditions.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Price */}

              <div className="space-y-2">
                <Label htmlFor="equipment-price">Rental Price (৳)</Label>

                <Input
                  id="equipment-price"
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  placeholder="Enter rental price"
                />
              </div>

              {/* Quantity */}

              <div className="space-y-2">
                <Label htmlFor="equipment-quantity">Available Quantity</Label>

                <Input
                  id="equipment-quantity"
                  required
                  type="number"
                  min="1"
                  step="1"
                  value={formData.quantity}
                  onChange={(e) => handleChange("quantity", e.target.value)}
                  placeholder="Enter quantity"
                />
              </div>

              {/* Rental Type */}

              <div className="space-y-2">
                <Label>Rental Type</Label>

                <Select
                  value={formData.rentalType}
                  onValueChange={(value) =>
                    handleChange("rentalType", value as string)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Rental type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>

                    <SelectItem value="weekly">Weekly</SelectItem>

                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Rental Terms */}

            <div className="space-y-2">
              <Label htmlFor="rental-terms">Rental Terms</Label>

              <Textarea
                id="rental-terms"
                rows={3}
                value={formData.rentalTerms}
                onChange={(e) => handleChange("rentalTerms", e.target.value)}
                placeholder="Enter rental terms and conditions..."
                className="resize-none"
              />
            </div>
          </section>

          {/* Footer */}

          <div className="flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <PackageCheck className="mr-2 size-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
