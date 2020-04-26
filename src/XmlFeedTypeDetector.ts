export enum FeedType {
  Atom = 'atom',
  RSS = 'rss',
  Unknown = 'unknown',
}

/**
 * Detect XML feed type
 */
export class XmlFeedTypeDetector {
  public static detect(document: Document): FeedType {
    const root = document.firstElementChild?.nodeName;

    if (root === undefined) {
      return FeedType.Unknown;
    }

    switch (root.toLowerCase()) {
      case 'rss':
      case 'rdf':
        return FeedType.RSS;
      case 'feed':
        return FeedType.Atom;
      default:
        return FeedType.Unknown;
    }
  }
}
