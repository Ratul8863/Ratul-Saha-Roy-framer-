import fs from "fs";

const raw = fs.readFileSync(
  new URL("./content/projects.ts", import.meta.url),
  "utf8",
);

const re =
  /\{\s*slug:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]+)"[\s\S]*?description:\s*"([^"]+)"[\s\S]*?link:\s*"([^"]+)"[\s\S]*?image:\s*"([^"]+)"[\s\S]*?category:\s*"([^"]+)"[\s\S]*?role:\s*"([^"]+)"[\s\S]*?year:\s*"([^"]+)"/g;

const blocks = [...raw.matchAll(re)];
const overview = [...raw.matchAll(/overview:\s*\[\s*"([^"]+)/g)].map(
  (m) => m[1],
);

const out = blocks.map((m, i) => ({
  slug: m[1],
  title: m[2],
  description: m[3],
  link: m[4],
  image: m[5],
  category: m[6],
  role: m[7],
  year: m[8],
  overview0: overview[i] || m[3],
}));

fs.writeFileSync(
  new URL("./content/projects.extracted.json", import.meta.url),
  JSON.stringify(out, null, 2),
);
console.log(`Extracted ${out.length} projects`);
