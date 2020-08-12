import fs from 'fs';
import path from 'path';
import { sanitize } from '../src/utils/sanitizing';

const content = fs.readFileSync(
  path.resolve(__dirname, './stubs/content/web.dev.html'),
  { encoding: 'utf8' }
);

describe('Content sanitization', () => {
  it('should sanitize HTML', () => {
    const doc = new DOMParser().parseFromString(content, 'text/html');
    const sanitized = sanitize(doc);

    console.log(sanitized.innerHTML);
  });
});
