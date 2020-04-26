import { RSSFeed, RSSItem } from '../RSS/RSS';
import { Enclosure, Feed, Image, Item, Person } from '../types/Feed';
import { parsePerson } from '../utils/parsePerson';

export class RSSFeedAdapter {
  public adapt(rss: RSSFeed): Feed {
    let feed = {} as Feed;

    feed.title = rss.title;
    feed.description = rss.description;
    feed.link = rss.link;
    // @todo
    feed.feedLink = null;
    feed.updated = rss.lastBuildDate;
    feed.published = rss.pubDate;
    feed.author = this.getFeedAuthor(rss);
    feed.language = rss.language;
    feed.image = this.getImage(rss);
    feed.copyright = rss.copyright;
    feed.generator = rss.generator;
    feed.categories = this.getFeedCategories(rss);
    feed.items = this.getItems(rss);
    feed.feedType = 'rss';

    return feed;
  }

  private getItem(rss: RSSItem): Item {
    let item = {} as Item;

    item.title = rss.title;
    item.description = rss.description;
    item.content = rss.content;
    item.link = rss.link;
    item.published = rss.pubDate;
    item.author = this.getItemAuthor(rss);
    item.guid = rss.guid?.value ?? null;
    // @todo
    item.image = null;
    item.categories = this.getItemCategories(rss);
    item.enclosures = this.getEnclosures(rss);

    return item;
  }

  private getItemAuthor(rss: RSSItem): Maybe<Person> {
    if (rss.author) {
      return parsePerson(rss.author);
    }

    return null;
  }

  private getFeedAuthor(rss: RSSFeed): Maybe<Person> {
    if (rss.managingEditor) {
      return parsePerson(rss.managingEditor);
    } else if (rss.webmaster) {
      return parsePerson(rss.webmaster);
    }

    return null;
  }

  private getImage(rss: RSSFeed): Maybe<Image> {
    if (rss.image) {
      return {
        title: rss.image.title,
        url: rss.image.url,
      };
    }

    return null;
  }

  private getFeedCategories(rss: RSSFeed): Maybe<Array<string>> {
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

  private getItemCategories(rss: RSSItem): Maybe<Array<string>> {
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

  private getEnclosures(rss: RSSItem): Maybe<Array<Enclosure>> {
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

  private getItems(rss: RSSFeed): Maybe<Array<Item>> {
    if (rss.items !== null) {
      return rss.items.map(this.getItem);
    }

    return null;
  }
}
