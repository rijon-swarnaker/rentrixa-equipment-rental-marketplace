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