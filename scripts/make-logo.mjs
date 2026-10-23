// One-off: turns the black-background JPEG logo into a transparent PNG.
// "CANTERBURY" is solid black in the source and can't be recovered, so it is
// removed here and drawn as live text by the <Logo> component instead.
import sharp from 'sharp';

const src = 'assets/logo light.jpeg';
const out = 'app/assets/brand/logo.png';
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
const px = Buffer.alloc(info.width * info.height * 4);
for (let i = 0, o = 0; i < data.length; i += 3, o += 4) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const y = Math.floor(i / 3 / info.width);
  const grey = max < 90 && max - min < 14;
  const a = grey && y > 330 ? 0 : smooth(14, 130, max);
  const k = a > 0 ? 1 / a : 0;
  px[o] = Math.min(255, r * k); px[o + 1] = Math.min(255, g * k); px[o + 2] = Math.min(255, b * k);
  px[o + 3] = Math.round(a * 255);
}
const info2 = await sharp(px, { raw: { width: info.width, height: info.height, channels: 4 } }).trim().png().toFile(out);
console.log('wrote', out, info2.width, info2.height);
