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
    return {
      title: atom.title,
      description: atom.subtitle,
      link: atom.links?.find(({ rel }) => rel === 'alternate')?.href ?? null,
      feedLink: atom.links?.find(({ rel }) => rel === 'self')?.href ?? null,
      updated: atom.updated,
      published: null,
      author: AtomFeedAdapter.getAuthor(atom),
      language: atom.language,
      image: AtomFeedAdapter.getImage(atom),
      copyright: atom.rights,
      generator: AtomFeedAdapter.getGenerator(atom),
      categories: AtomFeedAdapter.getCategories(atom),
      items: AtomFeedAdapter.getItems(atom),
      extensions: atom.extensions,
      feedType: 'atom',
      // @todo
      feedVersion: '',
    };
  }

  private static getItem(atom: AtomEntry): Item {
    return {
      title: atom.title,
      description: atom.summary,
      content: atom.content?.value ?? null,
      link: atom.links?.find(({ rel }) => rel === 'alternate')?.href ?? null,
      published: atom.published,
      updated: atom.updated,
      author: AtomFeedAdapter.getAuthor(atom),
      guid: atom.id,
      image: null,
      categories: AtomFeedAdapter.getCategories(atom),
      enclosures: AtomFeedAdapter.getEnclosures(atom),
      extensions: atom.extensions,
    };
  }

  private static getAuthor(atom: AtomFeed | AtomEntry): Maybe<Person> {
    const dcCreator = atom.extensions?.dc?.creator?.[0]?.value;

    if (atom.authors) {
      const { name, email } = atom.authors[0];

      return { name, email };
    } else if (dcCreator) {
      return parsePerson(dcCreator);
    }

    return null;
  }

  private static getImage(atom: AtomFeed): Maybe<Image> {
    if (atom.logo) {
      return { url: atom.logo, title: null };
    }

    return null;
  }

  private static getCategories(
    atom: AtomFeed | AtomEntry
  ): Maybe<Array<string>> {
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

    if (enclosureLinks && enclosureLinks.length > 0) {
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
