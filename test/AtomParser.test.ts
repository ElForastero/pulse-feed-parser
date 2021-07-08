import fs from 'fs';
import path from 'path';
import { AtomParser } from '../src';

const feedPaths = [
  path.join(__dirname, './stubs/atom/gitlab.xml'),
  path.join(__dirname, './stubs/atom/reddit.xml'),
];

it('should parse RSS feeds', async function () {
  feedPaths.forEach(p => {
    const xml = fs.readFileSync(p, { encoding: 'utf8' });
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    const parser = new AtomParser(doc);

    expect(() => parser.parse()).not.toThrowError();
  });
});
