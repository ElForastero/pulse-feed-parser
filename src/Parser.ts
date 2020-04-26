import { FeedType, XmlFeedTypeDetector } from './XmlFeedTypeDetector';
import { RSSParser } from './RSS/RSSParser';
import { AtomParser } from './Atom/AtomParser';
import { Feed } from './types/Feed';
import { RSSFeedAdapter } from './Adapter/RSSFeedAdapter';
import { AtomFeedAdapter } from './Adapter/AtomFeedAdapter';

/**
 * Parser Factory
 */
export class Parser {
  async parseURL(url: string): Promise<Feed> {
    const response = await fetch(url);

    // Check response code and content type
    if (response.status < 200 || response.status >= 300) {
      throw new Error('Feed returned an error :(');
    }

    return this.parseXMLFeed(await response.text());
  }

  private async parseXMLFeed(content: string): Promise<Feed> {
    const document = new DOMParser().parseFromString(content, 'text/xml');
    const type = XmlFeedTypeDetector.detect(document);

    if (type === FeedType.RSS) {
      return new RSSFeedAdapter().adapt(new RSSParser(document).parse());
    }

    if (type === FeedType.Atom) {
      return new AtomFeedAdapter().adapt(new AtomParser(document).parse());
    }

    throw new Error('Unknown feed type');
  }
}
