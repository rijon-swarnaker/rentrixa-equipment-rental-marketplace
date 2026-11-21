
import EquipmentCard from "@/components/HomePage/EquipmentCard";
import { allEquipment } from "@/lib/api/equipment";
import { TEquipmentProps } from "@/types";
import React from "react";

const AllEquipmentPage = async({ searchParams }: {searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) => {
    const search = await searchParams;
    const urlSearch = new URLSearchParams(search as Record<string, string>);
    const query = urlSearch.toString();

    console.log("Query String:", query);

   const equipments: TEquipmentProps[] = await allEquipment(query);
  return (
    <div>
      <h1>All Equipment</h1>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {equipments.map((equipment, index) => (
            <EquipmentCard
              key={equipment._id}
              equipment={equipment}
              index={index}
            />
          ))}
        </div>
    </div>
  );
};

export default AllEquipmentPage;
