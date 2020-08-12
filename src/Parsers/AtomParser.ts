import {
  AtomCategory,
  AtomContent,
  AtomEntry,
  AtomFeed,
  AtomGenerator,
  AtomLink,
  AtomPerson,
  AtomSource,
} from '../types';
import {
  getExtensionName,
  isExtension,
  parseExtension,
} from '../utils/extensions';

// Atom elements which contain URIs
// https://tools.ietf.org/html/rfc4287
// const uriElements = {
//   icon: true,
//   id: true,
//   logo: true,
//   uri: true,
//   url: true, // atom 0.3
// };

// Atom attributes which contain URIs
// https://tools.ietf.org/html/rfc4287
// const atomURIAttrs = {
//   href: true,
//   scheme: true,
//   src: true,
//   uri: true,
// };

/**
 * Parser for Atom feeds
 */
export class AtomParser {
  private readonly entry: AtomEntry;
  private readonly source: AtomSource;
  private readonly person: AtomPerson;
  private feed: AtomFeed;
  private document: Document;
  // private baseURL: Maybe<string>;

  constructor(document: Document) {
    this.document = document;
    // this.baseURL = null;

    this.feed = {
      id: null,
      language: null,
      generator: null,
      title: null,
      subtitle: null,
      categories: null,
      authors: null,
      contributors: null,
      rights: null,
      icon: null,
      logo: null,
      updated: null,
      entries: null,
      links: null,
      extensions: null,
    };

    this.entry = {
      id: null,
      title: null,
      summary: null,
      categories: null,
      authors: null,
      contributors: null,
      links: null,
      rights: null,
      source: null,
      published: null,
      updated: null,
      content: null,
      extensions: null,
    };

    this.source = {
      authors: null,
      categories: null,
      contributors: null,
      generator: null,
      icon: null,
      id: null,
      links: null,
      logo: null,
      rights: null,
      subtitle: null,
      title: null,
      updated: null,
    };

    this.person = { email: null, name: null, uri: null };
  }

  public parse(): AtomFeed {
    const root = this.document.firstElementChild;

    if (root === null) {
      throw new Error('No root node');
    }

    // this.baseURL = root.getAttributeNS('xml', 'base');

    const walker = window.document.createTreeWalker(
      root,
      NodeFilter.SHOW_ELEMENT
    );
    walker.firstChild();
    this.parseRoot(walker);

    return this.feed;
  }

  private parseRoot(walker: TreeWalker) {
    walker.firstChild();

    do {
      const tagName = walker.currentNode.nodeName.toLowerCase();

      if (isExtension(walker.currentNode)) {
        const ext = getExtensionName(walker.currentNode as Element);
        const [prop, extension] = parseExtension(walker.currentNode as Element);

        if (this.feed.extensions === null) {
          this.feed.extensions = { [ext]: { [prop]: [] } };
        } else if (this.feed.extensions[ext] === undefined) {
          this.feed.extensions[ext] = { [prop]: [] };
        } else if (this.feed.extensions[ext][prop] === undefined) {
          this.feed.extensions[ext][prop] = [];
        }

        this.feed.extensions[ext][prop] = [
          ...this.feed.extensions[ext][prop],
          extension,
        ];
      }
      if (tagName === 'title') {
        this.feed.title = this.parseText(walker.currentNode as Element);
      } else if (tagName === 'id') {
        this.feed.id = this.parseText(walker.currentNode as Element);
      } else if (['updated', 'modified'].includes(tagName)) {
        this.feed.updated = this.parseText(walker.currentNode as Element);
      } else if (['subtitle', 'tagline'].includes(tagName)) {
        this.feed.subtitle = this.parseText(walker.currentNode as Element);
      } else if (tagName === 'link') {
        const link = this.parseLink(walker.currentNode as Element);
        this.feed.links =
          this.feed.links !== null ? [...this.feed.links, link] : [link];
      } else if (tagName === 'generator') {
        this.feed.generator = this.parseGenerator(
          walker.currentNode as Element
        );
      } else if (tagName === 'icon') {
        this.feed.icon = this.parseText(walker.currentNode as Element);
      } else if (tagName === 'logo') {
        this.feed.logo = this.parseText(walker.currentNode as Element);
      } else if (['rights', 'copyright'].includes(tagName)) {
        this.feed.rights = this.parseText(walker.currentNode as Element);
      } else if (tagName === 'contributor') {
        let person = this.parsePerson(walker.currentNode as Element);

        this.feed.contributors =
          this.feed.contributors !== null
            ? [...this.feed.contributors, person]
            : [person];
      } else if (tagName === 'author') {
        let person = this.parsePerson(walker.currentNode as Element);

        this.feed.authors =
          this.feed.authors !== null
            ? [...this.feed.authors, person]
            : [person];
      } else if (tagName === 'category') {
        const category = this.parseCategory(walker.currentNode as Element);

        this.feed.categories =
          this.feed.categories !== null
            ? [...this.feed.categories, category]
            : [category];
      } else if (tagName === 'entry') {
        const entry = this.parseEntry(walker.currentNode);

        this.feed.entries =
          this.feed.entries !== null ? [...this.feed.entries, entry] : [entry];
      }
    } while (walker.nextSibling());
  }

  private parseEntry(node: Node): AtomEntry {
    const walker = window.document.createTreeWalker(
      node,
      NodeFilter.SHOW_ELEMENT
    );
    walker.firstChild();

    let entry = { ...this.entry };

    do {
      const tagName = walker.currentNode.nodeName.toLowerCase();

      if (isExtension(walker.currentNode)) {
        const ext = getExtensionName(walker.currentNode as Element);
        const [prop, extension] = parseExtension(walker.currentNode as Element);

        if (entry.extensions === null) {
          entry.extensions = { [ext]: { [prop]: [] } };
        } else if (entry.extensions[ext] === undefined) {
          entry.extensions[ext] = { [prop]: [] };
        } else if (entry.extensions[ext][prop] === undefined) {
          entry.extensions[ext][prop] = [];
        }

        entry.extensions[ext][prop] = [
          ...entry.extensions[ext][prop],
          extension,
        ];
      } else if (tagName === 'title') {
        entry.title = this.parseText(walker.currentNode as Element);
      } else if (tagName === 'id') {
        entry.id = this.parseText(walker.currentNode as Element);
      } else if (['rights', 'copyright'].includes(tagName)) {
        entry.rights = this.parseText(walker.currentNode as Element);
      } else if (tagName === 'summary') {
        entry.summary = this.parseText(walker.currentNode as Element);
      } else if (tagName === 'source') {
        entry.source = this.parseSource(walker.currentNode);
      } else if (['updated', 'modified'].includes(tagName)) {
        entry.updated = this.parseText(walker.currentNode as Element);
      } else if (tagName === 'contributor') {
        let person = this.parsePerson(walker.currentNode as Element);

        entry.contributors =
          entry.contributors !== null
            ? [...entry.contributors, person]
            : [person];
      } else if (tagName === 'author') {
        let person = this.parsePerson(walker.currentNode as Element);

        entry.authors =
          entry.authors !== null ? [...entry.authors, person] : [person];
      } else if (tagName === 'category') {
        const category = this.parseCategory(walker.currentNode as Element);

        entry.categories =
          entry.categories !== null
            ? [...entry.categories, category]
            : [category];
      } else if (tagName === 'link') {
        const link = this.parseLink(walker.currentNode as Element);

        entry.links = entry.links !== null ? [...entry.links, link] : [link];
      } else if (['published', 'issued'].includes(tagName)) {
        entry.published = this.parseText(walker.currentNode as Element);
      } else if (tagName === 'content') {
        entry.content = this.parseContent(walker.currentNode as Element);
      }
    } while (walker.nextSibling());

    return entry;
  }

  private parseLink(node: Element): AtomLink {
    return {
      href: node.getAttribute('href'),
      hreflang: node.getAttribute('hreflang'),
      length: node.getAttribute('length'),
      rel: node.getAttribute('rel') ?? 'alternate',
      title: node.getAttribute('title'),
      type: node.getAttribute('type'),
    };
  }

  private parseGenerator(node: Element): AtomGenerator {
    const uri = node.getAttribute('uri'); // Atom 1.0
    const url = node.getAttribute('url'); // Atom 0.3

    return {
      uri: uri ?? url,
      version: node.getAttribute('version'),
      value: this.parseText(node),
    };
  }

  private parsePerson(node: Node): AtomPerson {
    const walker = window.document.createTreeWalker(
      node,
      NodeFilter.SHOW_ELEMENT
    );
    walker.firstChild();

    let person = { ...this.person };

    do {
      const tagName = walker.currentNode.nodeName.toLowerCase();

      if (tagName === 'name') {
        person.name = this.parseText(walker.currentNode as Element);
      } else if (tagName === 'email') {
        person.email = this.parseText(walker.currentNode as Element);
      } else if (['uri', 'url', 'homepage'].includes(tagName)) {
        person.uri = this.parseText(walker.currentNode as Element);
      }
    } while (walker.nextSibling());

    return person;
  }

  private parseCategory(node: Element): AtomCategory {
    return {
      label: node.getAttribute('label'),
      scheme: node.getAttribute('scheme'),
      term: node.getAttribute('term'),
    };
  }

  private parseSource(node: Node): AtomSource {
    const walker = window.document.createTreeWalker(
      node,
      NodeFilter.SHOW_ELEMENT
    );
    walker.firstChild();

    let source = { ...this.source };

    do {
      const tagName = walker.currentNode.nodeName.toLowerCase();

      if (tagName === 'title') {
        source.title = this.parseText(walker.currentNode as Element);
      } else if (tagName === 'id') {
        source.id = this.parseText(walker.currentNode as Element);
      } else if (['updated', 'modified'].includes(tagName)) {
        source.updated = this.parseText(walker.currentNode as Element);
      } else if (['subtitle', 'tagline'].includes(tagName)) {
        source.subtitle = this.parseText(walker.currentNode as Element);
      } else if (tagName === 'link') {
        const link = this.parseLink(walker.currentNode as Element);
        source.links = source.links !== null ? [...source.links, link] : [link];
      } else if (tagName === 'generator') {
        source.generator = this.parseGenerator(walker.currentNode as Element);
      } else if (tagName === 'icon') {
        source.icon = this.parseText(walker.currentNode as Element);
      } else if (tagName === 'logo') {
        source.logo = this.parseText(walker.currentNode as Element);
      } else if (['rights', 'copyright'].includes(tagName)) {
        source.rights = this.parseText(walker.currentNode as Element);
      } else if (tagName === 'contributor') {
        let person = this.parsePerson(walker.currentNode as Element);

        source.contributors =
          source.contributors !== null
            ? [...source.contributors, person]
            : [person];
      } else if (tagName === 'author') {
        let person = this.parsePerson(walker.currentNode as Element);

        source.authors =
          source.authors !== null ? [...source.authors, person] : [person];
      } else if (tagName === 'category') {
        const category = this.parseCategory(walker.currentNode as Element);

        source.categories =
          source.categories !== null
            ? [...source.categories, category]
            : [category];
      }
    } while (walker.nextSibling());

    return source;
  }

  private parseContent(node: Element): AtomContent {
    return {
      src: node.getAttribute('src'),
      type: node.getAttribute('type'),
      value: this.parseText(node),
    };
  }

  private parseText(node: Element): Maybe<string> {
    const type = node.getAttribute('type') ?? 'text';

    if (type === 'text') {
      return node.textContent!.trim();
    }

    // If type="html", then this element contains entity escaped html.
    if (type === 'html') {
      return node.textContent!.trim();
    }

    // If type="xhtml", then this element contains inline xhtml, wrapped in a div element.
    if (type === 'xhtml') {
      return node.firstElementChild!.textContent!.trim();
    }

    return null;
  }
}
