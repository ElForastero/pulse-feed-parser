import fs from 'fs';
import path from 'path';
import { Parser } from '../src';

const wrongXml = fs.readFileSync(path.resolve(__dirname, './stubs/wrong.xml'), {
  encoding: 'utf8',
});

it('should throw on broken xml document', () => {
  const doc = new DOMParser().parseFromString(wrongXml, 'application/xml');

  expect(() => {
    new Parser().parseDocument(doc);
  }).toThrowError();
});
