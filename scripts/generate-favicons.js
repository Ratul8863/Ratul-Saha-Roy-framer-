const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

async function main() {
  const src = path.join("public", "landing", "hero-portrait-v3.png");
  const meta = await sharp(src).metadata();
  const side = Math.min(meta.width, meta.height);
  const left = Math.max(0, Math.floor((meta.width - side) / 2));

  // Face-forward square on solid bg (Google prefers clear, square, stable icons)
  const square = await sharp(src)
    .extract({ left, top: 0, width: side, height: side })
    .resize(512, 512)
    .flatten({ background: { r: 17, g: 17, b: 17 } })
    .png()
    .toBuffer();

  const sizes = [16, 32, 48, 96, 192, 512];
  for (const px of sizes) {
    await sharp(square)
      .resize(px, px)
      .png()
      .toFile(path.join("public", `favicon-${px}x${px}.png`));
  }

  // Primary crawl targets Google looks for
  await sharp(square).resize(48, 48).png().toFile("public/favicon.png");
  await sharp(square).resize(48, 48).png().toFile("src/app/icon.png");
  await sharp(square).resize(180, 180).png().toFile("src/app/apple-icon.png");
  await sharp(square).resize(192, 192).png().toFile("public/icon-192.png");

  // Real multi-size ICO (16 + 32 + 48)
  const png16 = await sharp(square).resize(16, 16).png().toBuffer();
  const png32 = await sharp(square).resize(32, 32).png().toBuffer();
  const png48 = await sharp(square).resize(48, 48).png().toBuffer();

  // Minimal ICO writer (PNG-compressed icon entries)
  function icoFromPngs(pngs) {
    const count = pngs.length;
    const headerSize = 6 + count * 16;
    let offset = headerSize;
    const entries = [];
    for (const png of pngs) {
      const size = png.length;
      // Read IHDR for width/height
      const w = png[16] === 0 && png[17] === 0 && png[18] === 0 && png[19] === 0 ? 256 : png[19] || png[16];
      // For our known sizes, pass explicitly via sharp meta instead:
      entries.push({ png, offset, size });
      offset += size;
    }
    // Rebuild with known dimensions
    const dims = [16, 32, 48];
    const bufs = [Buffer.alloc(6)];
    bufs[0].writeUInt16LE(0, 0);
    bufs[0].writeUInt16LE(1, 2);
    bufs[0].writeUInt16LE(count, 4);
    let off = headerSize;
    const dir = [];
    for (let i = 0; i < count; i++) {
      const d = Buffer.alloc(16);
      const dim = dims[i];
      d[0] = dim >= 256 ? 0 : dim;
      d[1] = dim >= 256 ? 0 : dim;
      d[2] = 0;
      d[3] = 0;
      d.writeUInt16LE(1, 4);
      d.writeUInt16LE(32, 6);
      d.writeUInt32LE(pngs[i].length, 8);
      d.writeUInt32LE(off, 12);
      dir.push(d);
      off += pngs[i].length;
    }
    return Buffer.concat([bufs[0], ...dir, ...pngs]);
  }

  fs.writeFileSync("public/favicon.ico", icoFromPngs([png16, png32, png48]));
  console.log("Wrote favicon.ico + PNG set");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
