// assets/images/<category>/originals/ にある元画像を読み込み、
// リサイズ・圧縮した結果を assets/images/<category>/ 直下に書き出すスクリプト。
//
// 元画像には一切手を加えません(毎回きれいな元データから作り直すので、
// 何度ビルドしても画質が劣化していきません)。
//
// 使い方: 新しいキャラ立ち絵を追加したい時は、
//   assets/images/characters/originals/新キャラ名.jpg
// に置いてpushするだけ。GitHub Actionsが自動でリサイズ・WebP化してくれます。

import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

const TARGETS = [
  { dir: "assets/images/works/originals", out: "assets/images/works", maxWidth: 1920, quality: 82 },
  { dir: "assets/images/characters/originals", out: "assets/images/characters", maxWidth: 900, quality: 85 },
];

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png"]);

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function processTarget({ dir, out, maxWidth, quality }) {
  if (!(await exists(dir))) {
    console.log(`skip (not found): ${dir}`);
    return;
  }
  await fs.mkdir(out, { recursive: true });
  const files = await fs.readdir(dir);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!IMAGE_EXT.has(ext)) continue;

    const srcPath = path.join(dir, file);
    const baseName = path.basename(file, ext);
    const destPath = path.join(out, `${baseName}${ext}`);
    const webpPath = path.join(out, `${baseName}.webp`);

    const image = sharp(srcPath);
    const meta = await image.metadata();
    const shouldResize = meta.width && meta.width > maxWidth;

    let pipeline = sharp(srcPath);
    if (shouldResize) pipeline = pipeline.resize({ width: maxWidth });

    if (ext === ".png") {
      await pipeline.clone().png({ compressionLevel: 9 }).toFile(destPath);
    } else {
      await pipeline.clone().jpeg({ quality, mozjpeg: true }).toFile(destPath);
    }
    await pipeline.clone().webp({ quality }).toFile(webpPath);

    console.log(`optimized: ${srcPath} -> ${destPath} (+ .webp)${shouldResize ? ` [resized to ${maxWidth}px]` : ""}`);
  }
}

for (const target of TARGETS) {
  await processTarget(target);
}
