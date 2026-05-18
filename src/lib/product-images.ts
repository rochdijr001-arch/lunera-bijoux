// Maps the image_url stored in the database (a stable key) to bundled assets.
import bangle from "@/assets/p-bangle.jpg";
import collier from "@/assets/p-collier.jpg";
import bague from "@/assets/p-bague.jpg";
import bracelet from "@/assets/p-bracelet.jpg";
import tulipe from "@/assets/p-tulipe.jpg";
import pack from "@/assets/p-pack.jpg";
import series from "@/assets/p-series.jpg";
import montre from "@/assets/p-montre.jpg";
import fallback from "@/assets/p-bangle.jpg";

const map: Record<string, string> = {
  "p-bangle": bangle,
  "p-collier": collier,
  "p-bague": bague,
  "p-bracelet": bracelet,
  "p-tulipe": tulipe,
  "p-pack": pack,
  "p-series": series,
  "p-montre": montre,
};

export function resolveProductImage(key: string): string {
  if (key.startsWith("http") || key.startsWith("/")) return key;
  return map[key] ?? fallback;
}
