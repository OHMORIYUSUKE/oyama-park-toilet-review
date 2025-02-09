import { useState } from "react";
import { SelectedFacility, FacilityType } from "@/types/map";
import { Park } from "@/types/park";
import { Toilet } from "@/types/toilet";
import { useRouter } from "next/navigation";

/**
 * useMapStateフックのプロパティ
 */
type UseMapStateProps = {
  /** Next.jsのルーターインスタンス */
  router: ReturnType<typeof useRouter>;
  /** URLのクエリパラメータ */
  searchParams: URLSearchParams;
};

/**
 * マップの状態を管理するカスタムフック
 * @param router - Next.jsのルーターインスタンス
 * @param searchParams - URLのクエリパラメータ
 * @returns マップの状態と操作関数
 */
export function useMapState({ router, searchParams }: UseMapStateProps) {
  const [selectedFacility, setSelectedFacility] =
    useState<SelectedFacility | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  /**
   * 施設を選択したときの処理
   * @param type - 施設タイプ（"park" | "toilet"）
   * @param data - 施設データ
   */
  const handleFacilitySelect = (type: FacilityType, data: Park | Toilet) => {
    setSelectedFacility({ type, data } as SelectedFacility);
    setDrawerOpen(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", type);
    params.set("id", data.id);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  /**
   * 詳細ドロワーを閉じるときの処理
   */
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
