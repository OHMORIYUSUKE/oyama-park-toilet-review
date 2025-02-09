import { useState } from "react";
import { SelectedFacility, FacilityType } from "@/types/map";
import { Park } from "@/types/park";
import { Toilet } from "@/types/toilet";
import { useRouter } from "next/navigation";

type UseMapStateProps = {
  router: ReturnType<typeof useRouter>;
  searchParams: URLSearchParams;
};

export function useMapState({ router, searchParams }: UseMapStateProps) {
  const [selectedFacility, setSelectedFacility] =
    useState<SelectedFacility | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleFacilitySelect = (type: FacilityType, data: Park | Toilet) => {
    setSelectedFacility({ type, data } as SelectedFacility);
    setDrawerOpen(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", type);
    params.set("id", data.id);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedFacility(null);
    router.push("/", { scroll: false });
  };

  return {
    selectedFacility,
    setSelectedFacility,
    drawerOpen,
    setDrawerOpen,
    handleFacilitySelect,
    handleCloseDrawer,
  };
}
