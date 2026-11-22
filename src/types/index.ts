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

export type TEquipmentProps = {
  _id: string;
  name: string;
  description: string;
  location: string;
  price: string;
  quantity: string;
  brand: string;
  model: string;
  image: string;
  category: string;
  condition: "Brand new" | "Like new" | "Excellent" | "Good" | "Fair";
  rentalType: "daily" | "weekly" | "monthly";
  rentalTerms: string;
  ownerName: string;
  ownerEmail: string;
  ownerImage: string;
  status: "pending" | "approved" | "rejected";
  paymentStatus: "unpaid" | "pending" | "paid" | "failed";

};

export type TBookingProps = {
  equipmentId: string;
  name: string;
  description: string;
  brand: string;
  model: string;
  category: string;
  condition: string;
  image: string;
  location: string;
  price: string;
  rentalType: "daily" | "weekly" | "monthly";
  startDate: string;
  endDate: string;
  quantity: number;
  contact: string;
  address: string;
  notes?: string;
  status: "pending" | "approved" | "rejected";
  ownerName: string;
  ownerEmail: string;
  ownerImage: string;
  userName: string;
  userEmail: string;
  userImage: string | null;
  
};

export type TBookingData = {
  _id: string;
  equipmentId: string;
  name: string;
  description: string;
  brand: string;
  model: string;
  category: string;
  condition: string;
  image: string;
  location: string;
  price: string;
  rentalType: "daily" | "weekly" | "monthly";
  startDate: string;
  endDate: string;
  quantity: number;
  totalAmount: number;
  contact: string;
  address: string;
  notes?: string;
  status: "pending" | "approved" | "rejected";
  ownerName: string;
  ownerEmail: string;
  ownerImage: string;
  userName: string;
  userEmail: string;
  userImage: string | null;
  paymentStatus: "unpaid" | "pending" | "paid" | "failed";
  bookingDate: string;
  bookingStatus: "pending" | "approved" | "rejected";
}

