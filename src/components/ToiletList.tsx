"use client";

import { Toilet } from "@/types/toilet";
import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Collapse,
  Divider,
} from "@mui/material";
import { AVAILABILITY_DISPLAY } from "@/constants/facilities";

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
    <Box component="section" sx={{ width: "100%" }}>
      <Typography variant="h4" component="h2" gutterBottom>
        公衆トイレ一覧 ({toilets.length}件)
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {toilets.map((toilet) => (
          <Card key={toilet.no}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                {toilet.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {toilet.address}
              </Typography>
              <Button
                onClick={() => toggleDetails(toilet.no)}
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
              >
                {expandedIds.has(toilet.no) ? "詳細を閉じる" : "詳細を見る"}
              </Button>
              <Collapse in={expandedIds.has(toilet.no)}>
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    男性トイレ
                  </Typography>
                  <Typography variant="body2">
                    総数: {toilet.menTotal}個
                  </Typography>
                  <Typography variant="body2">
                    - 小便器: {toilet.menUrinal}個
                  </Typography>
                  <Typography variant="body2">
                    - 和式: {toilet.menJapanese}個
                  </Typography>
                  <Typography variant="body2">
                    - 洋式: {toilet.menWestern}個
                  </Typography>

                  <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>
                    女性トイレ
                  </Typography>
                  <Typography variant="body2">
                    総数: {toilet.womenTotal}個
                  </Typography>
                  <Typography variant="body2">
                    - 和式: {toilet.womenJapanese}個
                  </Typography>
                  <Typography variant="body2">
                    - 洋式: {toilet.womenWestern}個
                  </Typography>

                  <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>
                    共用トイレ
                  </Typography>
                  <Typography variant="body2">
                    総数: {toilet.unisexTotal}個
                  </Typography>
                  <Typography variant="body2">
                    - 和式: {toilet.unisexJapanese}個
                  </Typography>
                  <Typography variant="body2">
                    - 洋式: {toilet.unisexWestern}個
                  </Typography>

                  <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>
                    設備
                  </Typography>
                  <Typography variant="body2">
                    多機能トイレ: {toilet.multifunction}個
                  </Typography>
                  <Typography variant="body2">
                    車椅子対応: {AVAILABILITY_DISPLAY[toilet.wheelchair]}
                  </Typography>
                  <Typography variant="body2">
                    乳幼児設備: {AVAILABILITY_DISPLAY[toilet.babyroom]}
                  </Typography>
                  <Typography variant="body2">
                    オストメイト: {AVAILABILITY_DISPLAY[toilet.ostomy]}
                  </Typography>
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
