"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import StatusSelect, {
  equipmentStatusMeta,
  normalizeEquipmentStatus,
  type TEquipmentStatus,
} from "@/components/Admin/StatusSelect";
import { updateEquipment } from "@/lib/api/equipment";

type EquipmentStatusDropdownProps = {
  equipmentId: string;
  equipmentName: string;
  status?: string;
};

const EquipmentStatusDropdown = ({
  equipmentId,
  equipmentName,
  status,
}: EquipmentStatusDropdownProps) => {
  const router = useRouter();
  const [value, setValue] = useState(normalizeEquipmentStatus(status));
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = async (next: TEquipmentStatus) => {
    if (next === value || isSaving) {
      return;
    }

    const previous = value;
    setValue(next);
    setIsSaving(true);

    try {
      await updateEquipment(equipmentId, { status: next });

      toast.success(
        `${equipmentName} marked as ${equipmentStatusMeta[next].label}.`
      );
      router.refresh();
    } catch (error) {
      setValue(previous);
      toast.error(
        error instanceof Error ? error.message : "Failed to update status."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <StatusSelect
      value={value}
      onChange={handleChange}
      loading={isSaving}
      ariaLabel={`Change status for ${equipmentName}`}
    />
  );
};

export default EquipmentStatusDropdown;
