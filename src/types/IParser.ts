export type ParserOptions = {
  sanitization: boolean;
};

export interface IParser {
  constructor(options: ParserOptions): void;

  parse(doc: Document): any;
}
