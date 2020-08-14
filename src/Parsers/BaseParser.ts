export type ParserOptions = {
  sanitization?: boolean;
};

const DEFAULT_OPTIONS = {
  sanitization: true,
};

export abstract class BaseParser {
  protected options: ParserOptions;

  protected constructor(options?: ParserOptions) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }
}
