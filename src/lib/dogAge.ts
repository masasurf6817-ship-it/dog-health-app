import { DogSize } from "@/types/database";

/**
 * 犬の年齢を人間換算年齢に変換する
 *
 * 小型犬（~10kg）: 最初の2年=24歳、以降1年=4歳
 * 中型犬（10~25kg）: 最初の2年=24歳、以降1年=5歳
 * 大型犬（25kg~）:  最初の2年=24歳、以降1年=6歳
 */
export function calcHumanAge(dogAgeYears: number, size: DogSize): number {
  const rateMap: Record<DogSize, number> = {
    small: 4,
    medium: 5,
    large: 6,
  };

  if (dogAgeYears <= 0) return 0;

  const rate = rateMap[size];

  if (dogAgeYears <= 2) {
    return Math.round((dogAgeYears / 2) * 24);
  }

  return 24 + Math.round((dogAgeYears - 2) * rate);
}

/** 誕生日から現在の年齢（年・月）を計算する */
export function calcDogAge(birthdate: string): {
  years: number;
  months: number;
  totalMonths: number;
} {
  const birth = new Date(birthdate);
  const now = new Date();

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (now.getDate() < birth.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months += 12;
    }
  }

  return { years, months, totalMonths: years * 12 + months };
}

export function sizeLabel(size: DogSize): string {
  const labels: Record<DogSize, string> = {
    small: "小型犬",
    medium: "中型犬",
    large: "大型犬",
  };
  return labels[size];
}

export function getSizeFromWeight(weight: number): DogSize {
  if (weight < 10) return "small";
  if (weight < 25) return "medium";
  return "large";
}
