const sharp = require("sharp");
const path = require("path");

async function main() {
  const src = path.join("public", "landing", "hero-portrait-v3.png");
  const meta = await sharp(src).metadata();
  const side = Math.min(meta.width, meta.height);
  const left = Math.max(0, Math.floor((meta.width - side) / 2));
  const square = await sharp(src)
    .extract({ left, top: 0, width: side, height: side })
    .png()
    .toBuffer();

  // Google requires favicon size to be a multiple of 48px
  await sharp(square).resize(48, 48).png().toFile("src/app/icon.png");
  await sharp(square).resize(180, 180).png().toFile("src/app/apple-icon.png");
  await sharp(square).resize(96, 96).png().toFile("public/favicon-96x96.png");
  await sharp(square).resize(48, 48).png().toFile("public/favicon.png");

  const portraitPanel = await sharp(src)
    .resize(560, 630, { fit: "cover", position: "top" })
    .png()
    .toBuffer();

  const textSvg = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#12121a"/>
        <stop offset="100%" stop-color="#0a0a0a"/>
      </linearGradient>
    </defs>
    <rect x="560" y="0" width="640" height="630" fill="url(#g)"/>
    <rect x="560" y="0" width="4" height="630" fill="#6366f1"/>
    <text x="620" y="250" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="700">Ratul Saha Roy</text>
    <text x="620" y="310" fill="#a1a1aa" font-family="Arial, Helvetica, sans-serif" font-size="26">Full Stack Web Developer (MERN)</text>
    <text x="620" y="370" fill="#c4b5fd" font-family="Arial, Helvetica, sans-serif" font-size="20">React · Node.js · MongoDB · TypeScript</text>
    <text x="620" y="520" fill="#71717a" font-family="Arial, Helvetica, sans-serif" font-size="18">ratul-saha-roy.pro.bd</text>
  </svg>`);

  await sharp({
    create: { width: 1200, height: 630, channels: 3, background: "#0a0a0a" },
  })
    .composite([
      { input: portraitPanel, left: 0, top: 0 },
      { input: textSvg, left: 0, top: 0 },
    ])
    .png()
    .toFile("src/app/opengraph-image.png");

  await sharp("src/app/opengraph-image.png").png().toFile("src/app/twitter-image.png");
  await sharp("src/app/opengraph-image.png").png().toFile("public/og-default.png");

  const iconMeta = await sharp("src/app/icon.png").metadata();
  const ogMeta = await sharp("src/app/opengraph-image.png").metadata();
  console.log("SEO images written");
  console.log(`icon ${iconMeta.width}x${iconMeta.height}`);
  console.log(`og ${ogMeta.width}x${ogMeta.height}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
