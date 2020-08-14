// @ts-nocheck
import { BaseParser, ParserOptions } from './BaseParser';
import { IParser } from '../types';

/**
 * @todo
 */
export class JSONParser extends BaseParser implements IParser {
  constructor(options: ParserOptions) {
    super(options);
  }
}
