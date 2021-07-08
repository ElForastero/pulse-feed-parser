import { Feed } from './types';
import { FeedType, XmlFeedTypeDetector } from './XmlFeedTypeDetector';
import { RSSParser } from './Parsers/RSSParser';
import { AtomParser } from './Parsers/AtomParser';
import { RSSFeedAdapter } from './Adapter/RSSFeedAdapter';
import { AtomFeedAdapter } from './Adapter/AtomFeedAdapter';
import { NetworkError } from './Errors/NetworkError';
import { FeedTypeError } from './Errors/FeedTypeError';
// @ts-ignore
import { version } from '../package.json';

export type PFPOptions = {
  /**
   * Enables HTML content sanitization.
   * Default sanitization rules will strip unwanted tags, attributes, comments
   * and empty paragraphs. You can change this behavior with a function.
   */
  sanitization?: boolean;
  /**
   * Options that will be passed to fetch() while parsing feeds from URLs.
   * Default options contain a User-Agent string specific to PFP.
   */
  fetchOptions?: RequestInit;
};

const DEFAULT_OPTIONS = {
  sanitization: true,
  fetchOptions: {
    headers: {
      'User-Agent': `pulse-feed-parser/${version}`,
    },
  },
};

/**
 * Pulse Feed Parser Factory
 */
export class Parser {
  options: PFPOptions;

  /**
   * Changed options will be merged with the defaults.
   */
  constructor(options?: PFPOptions) {
    this.options = options ? mergeOptions(options) : DEFAULT_OPTIONS;
  }

  /**
   * Try to parse a feed from the given URL.
   */
  public async parseURL(url: string): Promise<Feed> {
    const response = await fetch(url, this.options.fetchOptions);

    if (response.status < 200 || response.status >= 300) {
      throw new NetworkError(`The feed is unreachable`, response.status);
    }

    const doc = new DOMParser().parseFromString(
      await response.text(),
      'application/xml'
    );

    return this.parseDocument(doc);
  }

  /**
   * Parse a feed from the given XML document.
   */
  public parseDocument(doc: Document): Feed {
    const { sanitization } = this.options;
    const type = XmlFeedTypeDetector.detect(doc);

    if (type === FeedType.RSS) {
      return RSSFeedAdapter.adapt(new RSSParser({ sanitization }).parse(doc));
    }

    if (type === FeedType.Atom) {
      return AtomFeedAdapter.adapt(new AtomParser({ sanitization }).parse(doc));
    }

    throw new FeedTypeError('Unknown feed type');
  }
}

/**
 * Merge provided options with the defaults.
 */
const mergeOptions = (options: PFPOptions) => ({
  ...options,
  fetchOptions: {
    ...options.fetchOptions,
    headers: {
      ...DEFAULT_OPTIONS.fetchOptions.headers,
      ...options.fetchOptions?.headers,
    },
  },
});
