import { RSSFeed, RSSItem } from '../types/RSS';
import { Enclosure, Feed, Image, Item, Person } from '../types/Feed';
import { parsePerson } from '../utils/parsePerson';

export class RSSFeedAdapter {
  public static adapt(rss: RSSFeed): Feed {
    let feed = {} as Feed;

    feed.title = RSSFeedAdapter.getTitle(rss);
    feed.description = rss.description;
    feed.link = RSSFeedAdapter.getLink(rss);
    feed.feedLink = null;
    feed.updated = RSSFeedAdapter.getUpdated(rss);
    feed.published = rss.pubDate;
    feed.author = RSSFeedAdapter.getFeedAuthor(rss);
    feed.language = RSSFeedAdapter.getLanguage(rss);
    feed.image = RSSFeedAdapter.getImage(rss);
    feed.copyright = RSSFeedAdapter.getCopyright(rss);
    feed.generator = rss.generator;
    feed.categories = RSSFeedAdapter.getFeedCategories(rss);
    feed.items = RSSFeedAdapter.getItems(rss);
    feed.feedType = 'rss';

    return feed;
  }

  private static getItem(rss: RSSItem): Item {
    let item = {} as Item;

    item.title = RSSFeedAdapter.getTitle(rss);
    item.description = rss.description;
    item.content = rss.content;
    item.link = RSSFeedAdapter.getLink(rss);
    item.published = RSSFeedAdapter.getItemPublished(rss);
    item.updated = RSSFeedAdapter.getItemUpdated(rss);
    item.author = RSSFeedAdapter.getItemAuthor(rss);
    item.guid = rss.guid?.value ?? null;
    item.image = RSSFeedAdapter.getItemImage(rss);
    item.categories = RSSFeedAdapter.getItemCategories(rss);
    item.enclosures = RSSFeedAdapter.getEnclosures(rss);

    return item;
  }

  private static getCopyright(rss: RSSFeed): Maybe<string> {
    if (rss.copyright) {
      return rss.copyright;
    } else if (rss.extensions?.dc?.rights) {
      return rss.extensions.dc.rights[0].value;
    }

    return null;
  }

  private static getUpdated(rss: RSSFeed): Maybe<string> {
    if (rss.lastBuildDate) {
      return rss.lastBuildDate;
    } else if (rss.extensions?.dc?.date) {
      return rss.extensions.dc.date[0].value;
    }

    return null;
  }

  private static getItemPublished(rss: RSSItem): Maybe<string> {
    if (rss.pubDate) {
      return rss.pubDate;
    } else if (rss.extensions?.dc?.date) {
      return rss.extensions.dc.date[0].value
    }

    return null;
  }

  private static getItemUpdated(rss: RSSItem): Maybe<string> {
    return rss.extensions?.dc?.date?.[0]?.value ?? null;
  }

  private static getItemImage(rss: RSSItem): Maybe<string> {
    if (rss.extensions?.itunes?.image?.[0]?.attrs?.href) {
      return rss.extensions.itunes.image[0].attrs.href;
    }

    return null;
  }

  private static getTitle(rss: RSSFeed | RSSItem): Maybe<string> {
    if (rss.title) {
      return rss.title;
    } else if (rss.extensions?.dc?.title) {
      return rss.extensions?.dc?.title[0].value;
    }
    return null;
  }

  private static getLink(rss: RSSFeed | RSSItem): Maybe<string> {
    if (rss.link) {
      return rss.link;
    } else if (rss.extensions?.itunes?.subtitle) {
      return rss.extensions.itunes.subtitle[0].value;
    }

    return null;
  }

  private static getLanguage(rss: RSSFeed): Maybe<string> {
    if (rss.language) {
      return rss.language;
    } else if (rss.extensions?.dc?.language) {
      return rss.extensions.dc.language[0].value;
    }

    return null;
  }

  private static getItemAuthor(rss: RSSItem): Maybe<Person> {
    const dcCreator = rss.extensions?.dc?.creator?.[0]?.value;

    if (rss.author) {
      return parsePerson(rss.author);
    } else if (dcCreator) {
      return parsePerson(dcCreator);
    }

    return null;
  }

  private static getFeedAuthor(rss: RSSFeed): Maybe<Person> {
    const dcAuthor = rss.extensions?.dc?.author?.[0]?.value;
    const dcCreator = rss.extensions?.dc?.creator?.[0]?.value;
    const itunesAuthor = rss.extensions?.itunes?.author?.[0]?.value;

    if (rss.managingEditor) {
      return parsePerson(rss.managingEditor);
    } else if (rss.webmaster) {
      return parsePerson(rss.webmaster);
    } else if (dcAuthor) {
      return parsePerson(dcAuthor);
    } else if (dcCreator) {
      return parsePerson(dcCreator);
    } else if (itunesAuthor) {
      return parsePerson(itunesAuthor);
    }

    return null;
  }

  private static getImage(rss: RSSFeed): Maybe<Image> {
    if (rss.image) {
      return {
        title: rss.image.title,
        url: rss.image.url,
      };
    } else if (rss.extensions?.itunes?.image?.[0].attrs?.href) {
      return {
        title: null,
        url: rss.extensions.itunes.image[0].attrs.href,
      };
    }

    return null;
  }

  private static getFeedCategories(rss: RSSFeed): Maybe<Array<string>> {
    if (rss.categories !== null) {
      const categories = rss.categories
        .filter(({ value }) => value !== null)
        .map(({ value }) => value);

      if (categories.length > 0) {
        return categories as Array<string>;
      }
    }

    return null;
  }

  private static getItemCategories(rss: RSSItem): Maybe<Array<string>> {
    if (rss.categories !== null) {
      const categories = rss.categories
        .filter(({ value }) => value !== null)
        .map(({ value }) => value);

      if (categories.length > 0) {
        return categories as Array<string>;
      }
    }

    return null;
  }

  private static getEnclosures(rss: RSSItem): Maybe<Array<Enclosure>> {
    if (rss.enclosure) {
      const enclosure: Enclosure = {
        length: rss.enclosure.length,
        type: rss.enclosure.type,
        url: rss.enclosure.url,
      };

      return [enclosure];
    }

    return null;
  }

  private static getItems(rss: RSSFeed): Maybe<Array<Item>> {
    if (rss.items !== null) {
      return rss.items.map(RSSFeedAdapter.getItem);
    }

    return null;
  }
}
