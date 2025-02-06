import { Toilet } from "@/types/toilet";
import { AVAILABILITY_DISPLAY } from "@/constants/facilities";
import styles from "./ToiletDetails.module.css";

type ToiletDetailsProps = {
  toilet: Toilet;
};

export function ToiletDetails({ toilet }: ToiletDetailsProps) {
  return (
    <div className={styles.details}>
      <div>
        <h4>男性トイレ</h4>
        <p>総数: {toilet.menTotal}個</p>
        <p>- 小便器: {toilet.menUrinal}個</p>
        <p>- 和式: {toilet.menJapanese}個</p>
        <p>- 洋式: {toilet.menWestern}個</p>
      </div>
      {/* ... 他のセクション ... */}
      <div>
        <h4>設備</h4>
        <p>多機能トイレ: {toilet.multifunction}個</p>
        <p>車椅子対応: {AVAILABILITY_DISPLAY[toilet.wheelchair]}</p>
        <p>乳幼児設備: {AVAILABILITY_DISPLAY[toilet.babyroom]}</p>
        <p>オストメイト: {AVAILABILITY_DISPLAY[toilet.ostomy]}</p>
      </div>
    </div>
  );
}
