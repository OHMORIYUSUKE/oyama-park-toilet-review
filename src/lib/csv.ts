import { promises as fs } from "fs";
import path from "path";
import { Park } from "@/types/park";
import { Toilet, Availability } from "@/types/toilet";
import { isValidCoordinates } from "@/utils/map";

/**
 * CSVファイルからデータを読み込んで解析する
 * @param filePath - CSVファイルのパス
 * @returns 解析されたCSVデータの配列
 */
async function readCsvFile(filePath: string): Promise<string[]> {
  const data = await fs.readFile(filePath, "utf8");
  return data.split("\n").slice(1); // ヘッダーを除外
}

/**
 * 公園データをCSVから取得する
 * @returns 公園データの配列
 */
export async function getParkData(): Promise<Park[]> {
  try {
    const parkPath = path.join(process.cwd(), "data", "park.csv");
    const rows = await readCsvFile(parkPath);

    return rows
      .map((row) => {
        const columns = row.split(",");
        const park = {
          id: columns[1],
          name: columns[3],
          address: columns[6],
          latitude: columns[9],
          longitude: columns[8],
        };
        return park;
      })
      .filter((park) => park.name && isValidCoordinates(park));
  } catch (error) {
    console.error("Failed to load park data:", error);
    return [];
  }
}

/**
 * トイレデータをCSVから取得する
 * @returns トイレデータの配列
 */
export async function getToiletData(): Promise<Toilet[]> {
  const toiletPath = path.join(process.cwd(), "data", "public_toilet.csv");
  const rows = await readCsvFile(toiletPath);

  return rows
    .map((row) => {
      const columns = row.split(",");
      return {
        id: columns[1],
        name: columns[4],
        address: columns[7],
        latitude: columns[10],
        longitude: columns[11],
        menTotal: columns[12],
        menUrinal: columns[13],
        menJapanese: columns[14],
        menWestern: columns[15],
        womenTotal: columns[16],
        womenJapanese: columns[17],
        womenWestern: columns[18],
        unisexTotal: columns[19],
        unisexJapanese: columns[20],
        unisexWestern: columns[21],
        multifunction: columns[22],
        wheelchair: columns[23] as Availability,
        babyroom: columns[24] as Availability,
        ostomy: columns[25] as Availability,
      };
    })
    .filter((toilet) => toilet.name);
}
