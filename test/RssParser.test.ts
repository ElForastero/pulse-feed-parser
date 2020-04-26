// @ts-nocheck
import fs from 'fs';
import path from 'path';
import { RSSParser } from '../src/RSS/RssParser';

const github = fs.readFileSync(
  path.join(__dirname, './stubs/rss/github.blog.xml')
);
const trello = fs.readFileSync(
  path.join(__dirname, './stubs/rss/blog.trello.com.xml')
);
const smashingmagazine = fs.readFileSync(
  path.join(__dirname, './stubs/rss/smashingmagazine.com.xml')
);
const alistapart = fs.readFileSync(
  path.join(__dirname, './stubs/rss/alistapart.com.xml')
);
const devzen = fs.readFileSync(path.join(__dirname, './stubs/rss/devzen.xml'));

it('should parse RSS feeds', async function () {
  const doc = new DOMParser().parseFromString(devzen, 'application/xml');
  const parser = new RSSParser(doc);

  // console.log(parser.parse());
});
