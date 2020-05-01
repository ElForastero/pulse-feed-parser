// @ts-nocheck
import fs from 'fs';
import path from 'path';
import { RSSParser } from '../src/Parsers/RSSParser';
import { Parser } from '../src';

const github = fs.readFileSync(path.join(__dirname, './stubs/rss/github.xml'));
const trello = fs.readFileSync(
  path.join(__dirname, './stubs/rss/blog.trello.xml')
);
const smashingmagazine = fs.readFileSync(
  path.join(__dirname, './stubs/rss/smashingmagazine.xml')
);
const alistapart = fs.readFileSync(
  path.join(__dirname, './stubs/rss/alistapart.xml')
);
const devzen = fs.readFileSync(path.join(__dirname, './stubs/rss/devzen.xml'));

it('should parse RSS feeds', () => {
  const doc = new DOMParser().parseFromString(alistapart, 'application/xml');
  const parser = new RSSParser(doc);

  console.log(parser.parse().items[0].extensions);
});

it('should parse canonical feed', () => {
  const xml = fs.readFileSync(
    path.join(__dirname, './stubs/canonical/basic.xml'),
    { encoding: 'utf8' }
  );

  const data = new Parser().parseXMLFeed(xml).items[0];
  console.log(data);

  // fs.writeFileSync(
  //   path.join(__dirname, './stubs/canonical/expected.json'),
  //   JSON.stringify(data)
  // );
});
