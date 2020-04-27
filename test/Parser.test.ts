import fs from 'fs';
import path from 'path';
import { Parser } from '../src';

const wrongXml = fs.readFileSync(path.resolve(__dirname, './stubs/wrong.xml'), {
  encoding: 'utf8',
});

it('Should throw on broken xml document', () => {
  expect(() => {
    new Parser().parseXMLFeed(wrongXml);
    // @todo solve the error constructor matching
  }).toThrowError();
});
