import fs from "fs";
import path from "path";
import sharp from "sharp";

const root = path.resolve(process.cwd());

const heroDir = path.join(root, "public", "hero");
const temelDir = path.join(root, "public", "temel");

[heroDir, temelDir].forEach((dir) => fs.mkdirSync(dir, { recursive: true }));

const images = [
  {
    label: "hero-desktop",
    input: path.join(heroDir, "Dashboard.png"),
    baseDir: heroDir,
    outputs: [{ filename: "Dashboard.webp", format: "webp", width: 1920, quality: 86 }],
  },
  {
    label: "hero-mobile",
    input: path.join(heroDir, "Dashboard-mobile.png"),
    baseDir: heroDir,
    outputs: [{ filename: "Dashboard-mobile.webp", format: "webp", width: 900, quality: 86 }],
  },
  {
    label: "temel-kisiler-desktop",
    input: path.join(temelDir, "kisiler-desktop-2.png"),
    baseDir: temelDir,
    outputs: [{ filename: "kisiler-desktop-2.webp", format: "webp", width: 1920, quality: 86 }],
  },
  {
    label: "temel-kisiler-mobile",
    input: path.join(temelDir, "kisiler-mobile.png"),
    baseDir: temelDir,
    outputs: [{ filename: "kisiler-mobile.webp", format: "webp", width: 1000, quality: 86 }],
  },
];

const formatOptions = {
  webp: (quality) => ({ quality, effort: 5 }),
};

async function optimizeImage({ input, outputs, label, baseDir }) {
  if (!fs.existsSync(input)) {
    console.warn(`[skip] ${label}: source not found at ${input}`);
    return;
  }

  const source = sharp(input);
  const metadata = await source.metadata();

  for (const { filename, format, width, quality } of outputs) {
    const targetWidth = Math.min(width, metadata.width || width);
    const pipeline = sharp(input).resize({
      width: targetWidth,
      withoutEnlargement: true,
    });

    const optionsFn = formatOptions[format];
    const options = optionsFn ? optionsFn(quality) : {};

    const outputPath = path.join(baseDir, filename);
    await pipeline.toFormat(format, options).toFile(outputPath);
    console.log(
      `[ok] ${label} -> ${filename} (${format.toUpperCase()}, width ${targetWidth}, quality ${quality})`
    );
  }
}

async function run() {
  for (const image of images) {
    try {
      await optimizeImage(image);
    } catch (error) {
      console.error(`[error] ${image.label}:`, error);
      process.exitCode = 1;
    }
  }
}

run();
