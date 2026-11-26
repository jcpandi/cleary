import { mkdir, copyFile, cp, stat } from 'node:fs/promises';
const files = ['index.html', 'styles.css', 'app.js'];
await mkdir('dist', { recursive: true });
for (const file of files) await copyFile(file, `dist/${file}`);
await cp('assets', 'dist/assets', { recursive: true });
for (const file of ['dist/index.html', 'dist/assets/cleaning-hero.png', 'dist/assets/cleaning-sequence.mp4', 'dist/assets/inter-latin.woff2']) {
  if (!(await stat(file)).size) throw new Error(`Missing or empty required file: ${file}`);
}
console.log('Built Cleary hero in dist/');
