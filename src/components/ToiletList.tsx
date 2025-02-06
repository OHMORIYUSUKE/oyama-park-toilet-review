"use client";

import { Toilet } from "@/types/toilet";
import styles from "@/app/page.module.css";
import { useState } from "react";

/**
 * トイレリストのプロパティ
 */
type ToiletListProps = {
  /** 表示するトイレデータの配列 */
  toilets: Toilet[];
};

/**
 * 公衆トイレリストを表示するコンポーネント
 */
export function ToiletList({ toilets }: ToiletListProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleDetails = (id: string) => {
    const newExpandedIds = new Set(expandedIds);
    if (expandedIds.has(id)) {
      newExpandedIds.delete(id);
    } else {
      newExpandedIds.add(id);
    }
    setExpandedIds(newExpandedIds);
  };

  return (
    <section>
      <h2>公衆トイレ一覧 ({toilets.length}件)</h2>
      <div className={styles.list}>
        {toilets.map((toilet) => (
          <div key={toilet.no} className={styles.card}>
            <h3>{toilet.name}</h3>
            <p>{toilet.address}</p>
            <button
              onClick={() => toggleDetails(toilet.no)}
              className={styles.detailsButton}
            >
              {expandedIds.has(toilet.no) ? "詳細を閉じる" : "詳細を見る"}
            </button>
            {expandedIds.has(toilet.no) && (
              <div className={styles.details}>
                <div>
                  <h4>男性トイレ</h4>
                  <p>総数: {toilet.menTotal}個</p>
                  <p>- 小便器: {toilet.menUrinal}個</p>
                  <p>- 和式: {toilet.menJapanese}個</p>
                  <p>- 洋式: {toilet.menWestern}個</p>
                </div>
                <div>
                  <h4>女性トイレ</h4>
                  <p>総数: {toilet.womenTotal}個</p>
                  <p>- 和式: {toilet.womenJapanese}個</p>
                  <p>- 洋式: {toilet.womenWestern}個</p>
                </div>
                <div>
                  <h4>共用トイレ</h4>
                  <p>総数: {toilet.unisexTotal}個</p>
                  <p>- 和式: {toilet.unisexJapanese}個</p>
                  <p>- 洋式: {toilet.unisexWestern}個</p>
                </div>
                <div>
                  <h4>設備</h4>
                  <p>多機能トイレ: {toilet.multifunction}個</p>
                  <p>車椅子対応: {toilet.wheelchair}</p>
                  <p>乳幼児設備: {toilet.babyroom}</p>
                  <p>オストメイト: {toilet.ostomy}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
