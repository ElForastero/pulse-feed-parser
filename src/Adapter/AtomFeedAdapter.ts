import { Enclosure, Feed, Image, Item, Person } from '../types/Feed';
import { AtomEntry, AtomFeed } from '../types/Atom';
import { parsePerson } from '../utils/parsePerson';

// DefaultAtomTranslator converts an atom.Feed struct
// into the generic Feed struct.
//
// This default implementation defines a set of
// mapping rules between atom.Feed -> Feed
// for each of the fields in Feed.
export class AtomFeedAdapter {
  public static adapt(atom: AtomFeed): Feed {
    let feed = {} as Feed;

    feed.title = atom.title;
    feed.description = atom.subtitle;
    feed.link = atom.links?.find(({ type }) => type === 'alternate')?.href ?? null;
    feed.feedLink = atom.links?.find(({ type }) => type === 'self')?.href ?? null;
    feed.updated = atom.updated;
    feed.published = null;
    feed.author = AtomFeedAdapter.getAuthor(atom);
    feed.language = atom.language;
    feed.image = AtomFeedAdapter.getImage(atom);
    feed.copyright = atom.rights;
    feed.generator = AtomFeedAdapter.getGenerator(atom);
    feed.categories = AtomFeedAdapter.getCategories(atom);
    feed.items = AtomFeedAdapter.getItems(atom);
    feed.feedType = 'atom';

    return feed;
  }

  private static getItem(atom: AtomEntry): Item {
    let item = {} as Item;

    item.title = atom.title;
    item.description = atom.summary;
    item.content = atom.content?.value ?? null;
    item.link = atom.links?.find(({ type }) => type === 'alternate')?.href ?? null;
    item.published = atom.published;
    item.author = AtomFeedAdapter.getAuthor(atom);
    item.guid = atom.id;
    item.image = null;
    item.categories = AtomFeedAdapter.getCategories(atom);
    item.enclosures = AtomFeedAdapter.getEnclosures(atom);

    return item;
  }

  private static getAuthor(atom: AtomFeed | AtomEntry): Maybe<Person> {
    const dcCreator = atom.extensions?.dc?.creator?.[0]?.value;

    if (atom.authors) {
      const { name, email } = atom.authors[0];

      return {
        name,
        email,
      };
    } else if (dcCreator) {
      return parsePerson(dcCreator);
    }

    return null;
  }

  private static getImage(atom: AtomFeed): Maybe<Image> {
    if (atom.logo) {
      return {
        url: atom.logo,
        title: null,
      };
    }

    return null;
  }

  private static getCategories(atom: AtomFeed | AtomEntry): Maybe<Array<string>> {
    if (atom.categories !== null) {
      const categories = atom.categories
        .filter(({ term }) => term !== null)
        .map(({ term }) => term);

      if (categories.length > 0) {
        return categories as Array<string>;
      }
    }

    return null;
  }

  private static getEnclosures(atom: AtomEntry): Maybe<Array<Enclosure>> {
    const enclosureLinks = atom.links?.filter(({ rel }) => rel === 'enclosure');

    if (enclosureLinks) {
      return enclosureLinks.map(({ href, length, type }) => ({
        length,
        type,
        url: href,
      }));
    }

    return null;
  }

  private static getGenerator(atom: AtomFeed): Maybe<string> {
    if (atom.generator) {
      const { value, version, uri } = atom.generator;

      return [value, version, uri].join(' ');
    }

    return null;
  }

  private static getItems(atom: AtomFeed): Maybe<Array<Item>> {
    if (atom.entries !== null) {
      return atom.entries.map(AtomFeedAdapter.getItem);
    }

    return null;
  }
}
