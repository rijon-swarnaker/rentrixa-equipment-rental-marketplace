export type TUserRole = "Customer" | "Admin" | "Owner";

export type TUser = {
  name: string;
  email: string;
  image: string;
  role?: TUserRole | null;
};

export type TDashboardSidebarItem = {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  role?: TUserRole[];
};


export type TEquipment = {
  brand: string;
  category: string;
  condition: string;
  description: string;
  image: string;
  location: string;
  model: string;
  name: string;
  ownerEmail: string;
  ownerImage: string | null;
  ownerName: string;
  price: string;
  quantity: string;
  rentalTerms: string;
  rentalType: "daily" | "weekly" | "monthly";
  status: "pending" | "approved" | "rejected";
};