// One-shot: rasterize the purple SVG logos at 2x density for use in email
// headers, where Gmail Web in particular strips inline SVG. We commit the
// PNGs to public/ so emails reference them via absolute URL.
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

const SRC = path.resolve('public/assets/images/logo');
const OUT = path.resolve('public/assets/images/logo/email');

await mkdir(OUT, { recursive: true });

// Display sizes: symbol ≈ 24px tall, name ≈ 24px tall. Generated at 2x for
// retina sharpness in email clients.
await sharp(path.join(SRC, 'logo_symbol_primary.svg'), { density: 600 })
  .resize({ height: 56, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ quality: 95, compressionLevel: 9 })
  .toFile(path.join(OUT, 'logo_symbol_primary@2x.png'));

await sharp(path.join(SRC, 'logo_name_primary.svg'), { density: 600 })
  .resize({ height: 56, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ quality: 95, compressionLevel: 9 })
  .toFile(path.join(OUT, 'logo_name_primary@2x.png'));

console.log('✔ wrote logo_symbol_primary@2x.png, logo_name_primary@2x.png');
