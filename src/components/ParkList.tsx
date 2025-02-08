import { Park } from "@/types/park";
import { Card, CardContent, Typography, Box } from "@mui/material";

/**
 * 公園リストのプロパティ
 */
type ParkListProps = {
  /** 表示する公園データの配列 */
  parks: Park[];
};

/**
 * 公園リストを表示するコンポーネント
 */
export function ParkList({ parks }: ParkListProps) {
  return (
    <Box component="section" sx={{ width: "100%" }}>
      <Typography variant="h4" component="h2" gutterBottom>
        公園一覧 ({parks.length}件)
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {parks.map((park) => (
          <Card key={park.id}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                {park.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                住所: {park.address}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
