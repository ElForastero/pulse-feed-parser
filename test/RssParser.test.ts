import fs from 'fs';
import path from 'path';
import { RSSParser } from '../src/Parsers/RSSParser';

const feedPaths = [
  path.join(__dirname, './stubs/rss/github.xml'),
  path.join(__dirname, './stubs/rss/blog.trello.xml'),
  path.join(__dirname, './stubs/rss/smashingmagazine.xml'),
  path.join(__dirname, './stubs/rss/alistapart.xml'),
  path.join(__dirname, './stubs/rss/devzen.xml'),
  path.join(__dirname, './stubs/rss/web-standards.xml'),
];

const canonicalFeedPath = path.join(__dirname, './stubs/canonical/rss.xml');
const canonicalExpectation = path.join(
  __dirname,
  './stubs/canonical/rss-expected.json'
);

it('should parse RSS feeds', () => {
  feedPaths.forEach(p => {
    const xml = fs.readFileSync(p, { encoding: 'utf8' });
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    const parser = new RSSParser(doc);

    expect(() => parser.parse()).not.toThrowError();
  });
});

it('should parse canonical feed', () => {
  const canonical = fs.readFileSync(canonicalFeedPath, { encoding: 'utf8' });
  const expected = fs.readFileSync(canonicalExpectation, { encoding: 'utf8' });
  const doc = new DOMParser().parseFromString(canonical, 'application/xml');
  const parser = new RSSParser(doc);
  const data = parser.parse();

  expect(data).toEqual(JSON.parse(expected));
});
