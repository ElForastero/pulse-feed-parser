// @ts-nocheck
import fs from 'fs';
import path from 'path';
import { AtomParser } from '../src/Parsers/AtomParser';

const gitlabXml = fs.readFileSync(
  path.join(__dirname, './stubs/atom/gitlab.xml')
);
const redditXml = fs.readFileSync(
  path.join(__dirname, './stubs/atom/reddit.xml')
);

it('should parse RSS feeds', async function () {
  const doc = new DOMParser().parseFromString(gitlabXml, 'application/xml');
  const parser = new AtomParser(doc);

  // console.log(parser.parse());
});
