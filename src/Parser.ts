import { Feed } from './types/Feed';
import { FeedType, XmlFeedTypeDetector } from './XmlFeedTypeDetector';
import { RSSParser } from './Parsers/RSSParser';
import { AtomParser } from './Parsers/AtomParser';
import { RSSFeedAdapter } from './Adapter/RSSFeedAdapter';
import { AtomFeedAdapter } from './Adapter/AtomFeedAdapter';
import { NetworkError } from './Errors/NetworkError';
import { FeedTypeError } from './Errors/FeedTypeError';

export const DEFAULT_FETCH_HEADERS = {
  'User-Agent': 'PulseRSS/1.0',
};

/**
 * Parser Factory
 */
export class Parser {
  fetchOptions: RequestInit;

  constructor(
    { fetchOptions }: { fetchOptions: RequestInit } = { fetchOptions: {} }
  ) {
    this.fetchOptions = fetchOptions;
  }

  public async parseURL(url: string): Promise<Feed> {
    const response = await fetch(url, {
      ...this.fetchOptions,
      headers: { ...DEFAULT_FETCH_HEADERS, ...this.fetchOptions?.headers },
    });

    if (response.status < 200 || response.status >= 300) {
      throw new NetworkError(`The feed is unreachable`, response.status);
    }

    return this.parseXMLFeed(await response.text());
  }

  public parseXMLFeed(content: string): Feed {
    const document = new DOMParser().parseFromString(content, 'text/xml');
    const type = XmlFeedTypeDetector.detect(document);

    if (type === FeedType.RSS) {
      return RSSFeedAdapter.adapt(new RSSParser(document).parse());
    }

    if (type === FeedType.Atom) {
      const atomFeed = new AtomParser(document).parse();
      return AtomFeedAdapter.adapt(atomFeed);
    }

    throw new FeedTypeError('Unknown feed type');
  }
}
