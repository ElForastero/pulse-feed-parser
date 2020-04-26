// @ts-nocheck
import { Enclosure, Feed, Image, Item, Person } from '../types/Feed';
import {
  AtomFeed,
  AtomEntry,
  AtomSource,
  AtomCategory,
  AtomLink,
  AtomGenerator,
  AtomContent,
  AtomPerson,
  AtomText,
} from '../Atom/Atom';
import { parsePerson } from '../utils/parsePerson';

export class AtomFeedAdapter {
  public adapt(atom: AtomFeed): Feed {
    let feed = {} as Feed;

    feed.title = atom.title;
    feed.description = atom.description;
    feed.link = atom.link;
    // @todo
    feed.feedLink = null;
    feed.updated = atom.lastBuildDate;
    feed.published = atom.pubDate;
    feed.author = this.getFeedAuthor(atom);
    feed.language = atom.language;
    feed.image = this.getImage(atom);
    feed.copyright = atom.copyright;
    feed.generator = atom.generator;
    feed.categories = this.getFeedCategories(atom);
    feed.items = this.getItems(atom);
    feed.feedType = 'rss';

    return feed;
  }

  private getItem(atom: AtomEntry): Item {
    let item = {} as Item;

    item.title = atom.title;
    item.description = atom.description;
    item.content = atom.content;
    item.link = atom.link;
    item.published = atom.pubDate;
    item.author = this.getItemAuthor(atom);
    item.guid = atom.guid?.value ?? null;
    // @todo
    item.image = null;
    item.categories = this.getItemCategories(atom);
    item.enclosures = this.getEnclosures(atom);

    return item;
  }

  private getItemAuthor(atom: AtomEntry): Maybe<Person> {
    if (atom.author) {
      return parsePerson(atom.author);
    }

    return null;
  }

  private getFeedAuthor(atom: AtomFeed): Maybe<Person> {
    if (atom.managingEditor) {
      return parsePerson(atom.managingEditor);
    } else if (atom.webmaster) {
      return parsePerson(atom.webmaster);
    }

    return null;
  }

  private getImage(atom: AtomFeed): Maybe<Image> {
    if (atom.image) {
      return {
        title: atom.image.title,
        url: atom.image.url,
      };
    }

    return null;
  }

  private getFeedCategories(atom: AtomFeed): Maybe<Array<string>> {
    if (atom.categories !== null) {
      const categories = atom.categories
        .filter(({ value }) => value !== null)
        .map(({ value }) => value);

      if (categories.length > 0) {
        return categories as Array<string>;
      }
    }

    return null;
  }

  private getItemCategories(atom: AtomEntry): Maybe<Array<string>> {
    if (atom.categories !== null) {
      const categories = atom.categories
        .filter(({ value }) => value !== null)
        .map(({ value }) => value);

      if (categories.length > 0) {
        return categories as Array<string>;
      }
    }

    return null;
  }

  private getEnclosures(atom: AtomEntry): Maybe<Array<Enclosure>> {
    if (atom.enclosure) {
      const enclosure: Enclosure = {
        length: atom.enclosure.length,
        type: atom.enclosure.type,
        url: atom.enclosure.url,
      };

      return [enclosure];
    }

    return null;
  }

  private getItems(atom: AtomFeed): Maybe<Array<Item>> {
    if (atom.items !== null) {
      return atom.items.map(this.getItem);
    }

    return null;
  }
}
