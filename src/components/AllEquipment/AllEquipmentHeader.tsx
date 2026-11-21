import { Shovel, Tractor, Truck } from "lucide-react";

const AllEquipmentHeader = () => {
  return (
    <section className="relative overflow-hidden border-b border-primary/15 bg-gradient-to-r from-primary/[0.08] via-primary/[0.03] to-primary/[0.12]">
      {/* Light machinery illustration on the right, like the mockup. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden items-center gap-4 pr-6 text-primary/15 sm:flex lg:gap-8 lg:pr-10"
      >
        <Truck className="size-16 -rotate-6 lg:size-24" />
        <Tractor className="size-20 lg:size-32" />
        <Shovel className="size-14 rotate-6 lg:size-20" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <h1 className="animate-fade-up text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          All Equipment
        </h1>

        <p className="animate-fade-up mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
          Find and rent the best equipment for your needs
        </p>
      </div>
    </section>
  );
};

export default AllEquipmentHeader;
