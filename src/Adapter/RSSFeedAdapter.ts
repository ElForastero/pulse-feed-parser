import {
  Enclosure,
  Feed,
  Image,
  Item,
  Person,
  RSSFeed,
  RSSItem,
} from '../types';
import { parsePerson } from '../utils/parsePerson';

export class RSSFeedAdapter {
  public static adapt(rss: RSSFeed): Feed {
    return {
      title: RSSFeedAdapter.getTitle(rss),
      description: rss.description,
      link: RSSFeedAdapter.getLink(rss),
      feedLink: null,
      updated: RSSFeedAdapter.getUpdated(rss),
      published: rss.pubDate,
      author: RSSFeedAdapter.getFeedAuthor(rss),
      language: RSSFeedAdapter.getLanguage(rss),
      image: RSSFeedAdapter.getImage(rss),
      copyright: RSSFeedAdapter.getCopyright(rss),
      generator: rss.generator,
      categories: RSSFeedAdapter.getFeedCategories(rss),
      items: RSSFeedAdapter.getItems(rss),
      extensions: rss.extensions,
      feedType: 'rss',
      // @todo
      feedVersion: '',
    };
  }

  private static getItem(rss: RSSItem): Item {
    return {
      title: RSSFeedAdapter.getTitle(rss),
      description: rss.description,
      content: rss.content,
      link: RSSFeedAdapter.getLink(rss),
      published: RSSFeedAdapter.getItemPublished(rss),
      updated: RSSFeedAdapter.getItemUpdated(rss),
      author: RSSFeedAdapter.getItemAuthor(rss),
      guid: rss.guid?.value ?? null,
      image: RSSFeedAdapter.getItemImage(rss),
      categories: RSSFeedAdapter.getItemCategories(rss),
      enclosures: RSSFeedAdapter.getEnclosures(rss),
      extensions: rss.extensions,
    };
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
      return rss.extensions.dc.date[0].value;
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
