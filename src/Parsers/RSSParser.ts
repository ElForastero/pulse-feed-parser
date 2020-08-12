import {
  RSSCategory,
  RSSEnclosure,
  RSSItem,
  RSSFeed,
  RSSGUID,
  RSSImage,
  RSSSource,
  RSSCloud,
  RSSTextInput,
  IParser,
  ParserOptions,
} from '../types';
import { append } from '../utils/collection';
import {
  getExtensionName,
  isExtension,
  parseExtension,
} from '../utils/extensions';
import { sanitize } from '../utils/sanitizing';

/**
 * Parser for RSS feeds
 */
export class RSSParser implements IParser {
  feed: RSSFeed;
  private readonly image: RSSImage;
  private readonly item: RSSItem;
  private readonly guid: RSSGUID;
  private readonly textInput: RSSTextInput;
  private options: ParserOptions;

  constructor(options: ParserOptions) {
    this.options = options;

    this.image = {
      description: null,
      height: null,
      link: null,
      title: null,
      url: '',
      width: null,
    };

    this.guid = { isPermalink: false, value: '' };

    this.feed = {
      categories: null,
      copyright: null,
      description: null,
      docs: null,
      generator: null,
      image: null,
      items: null,
      language: null,
      lastBuildDate: null,
      link: null,
      managingEditor: null,
      pubDate: null,
      rating: null,
      skipDays: null,
      skipHours: null,
      title: null,
      ttl: null,
      webmaster: null,
      cloud: null,
      textInput: null,
      extensions: null,
    };

    this.item = {
      author: null,
      categories: null,
      comments: null,
      content: null,
      description: null,
      enclosure: null,
      guid: this.guid,
      link: null,
      pubDate: null,
      source: null,
      title: null,
      extensions: null,
    };

    this.textInput = {
      description: null,
      link: null,
      name: null,
      title: null,
    };
  }

  public parse(doc: Document): RSSFeed {
    const root = doc.firstElementChild;

    if (root === null) {
      throw new Error('No root node');
    }

    const walker = window.document.createTreeWalker(
      root,
      NodeFilter.SHOW_ELEMENT
    );
    walker.firstChild();

    do {
      const tagName = walker.currentNode.nodeName.toLowerCase();

      if (tagName === 'channel') {
        this.parseChannel(walker);
      } else if (tagName === 'cloud') {
        this.feed.cloud = this.parseCloud(walker.currentNode as Element);
      } else if (tagName === 'textInput') {
        this.feed.textInput = this.parseTextInput(walker.currentNode);
      }
    } while (walker.nextSibling());

    return this.feed;
  }

  private parseChannel(walker: TreeWalker) {
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
      } else if (tagName === 'title') {
        this.feed.title = this.parseText(walker.currentNode);
      } else if (tagName === 'description') {
        this.feed.description = this.parseText(walker.currentNode);
      } else if (tagName === 'link') {
        this.feed.link = this.parseText(walker.currentNode);
      } else if (tagName === 'language') {
        this.feed.language = this.parseText(walker.currentNode);
      } else if (tagName === 'copyright') {
        this.feed.copyright = this.parseText(walker.currentNode);
      } else if (tagName === 'managingeditor') {
        this.feed.managingEditor = this.parseText(walker.currentNode);
      } else if (tagName === 'webmaster') {
        this.feed.webmaster = this.parseText(walker.currentNode);
      } else if (tagName === 'pubdate') {
        this.feed.pubDate = this.parseText(walker.currentNode);
      } else if (tagName === 'lastbuilddate') {
        this.feed.lastBuildDate = this.parseText(walker.currentNode);
      } else if (tagName === 'generator') {
        this.feed.generator = this.parseText(walker.currentNode);
      } else if (tagName === 'docs') {
        this.feed.docs = this.parseText(walker.currentNode);
      } else if (tagName === 'ttl') {
        this.feed.ttl = this.parseText(walker.currentNode);
      } else if (tagName === 'rating') {
        this.feed.rating = this.parseText(walker.currentNode);
      } else if (tagName === 'skiphours') {
        this.feed.skipHours = this.parseText(walker.currentNode);
      } else if (tagName === 'skipdays') {
        this.feed.skipDays = this.parseText(walker.currentNode);
      } else if (tagName === 'image') {
        this.parseImage(walker.currentNode);
      } else if (tagName === 'item') {
        this.parseItem(walker.currentNode);
      }
    } while (walker.nextSibling());
  }

  private parseImage(node: Node) {
    const walker = window.document.createTreeWalker(
      node,
      NodeFilter.SHOW_ELEMENT
    );
    walker.firstChild();

    let image = { ...this.image };

    do {
      const tagName = walker.currentNode.nodeName.toLowerCase();

      if (tagName === 'url') {
        image.url = this.parseText(walker.currentNode)!;
      } else if (tagName === 'title') {
        image.title = this.parseText(walker.currentNode);
      } else if (tagName === 'link') {
        image.link = this.parseText(walker.currentNode);
      } else if (tagName === 'width') {
        image.width = this.parseText(walker.currentNode);
      } else if (tagName === 'height') {
        image.height = this.parseText(walker.currentNode);
      } else if (tagName === 'description') {
        image.description = this.parseText(walker.currentNode);
      }
    } while (walker.nextSibling());

    this.feed.image = image;
  }

  private parseItem(node: Node) {
    const walker = window.document.createTreeWalker(
      node,
      NodeFilter.SHOW_ELEMENT
    );
    walker.firstChild();

    let item = { ...this.item };

    do {
      const tagName = walker.currentNode.nodeName.toLowerCase();

      if (isExtension(walker.currentNode)) {
        const ext = getExtensionName(walker.currentNode as Element);
        const [prop, extension] = parseExtension(walker.currentNode as Element);

        if (item.extensions === null) {
          item.extensions = { [ext]: { [prop]: [] } };
        } else if (item.extensions[ext] === undefined) {
          item.extensions[ext] = { [prop]: [] };
        } else if (item.extensions[ext][prop] === undefined) {
          item.extensions[ext][prop] = [];
        }

        item.extensions[ext][prop] = [...item.extensions[ext][prop], extension];
      } else if (tagName === 'title') {
        item.title = this.parseText(walker.currentNode as Element);
      } else if (tagName === 'description') {
        item.description = this.parseText(walker.currentNode as Element);
      } else if (tagName === 'link') {
        item.link = this.parseText(walker.currentNode as Element);
      } else if (tagName === 'author') {
        item.author = this.parseText(walker.currentNode as Element);
      } else if (tagName === 'comments') {
        item.comments = this.parseText(walker.currentNode as Element);
      } else if (tagName === 'pubdate') {
        item.pubDate = this.parseText(walker.currentNode as Element);
      } else if (tagName === 'content:encoded') {
        item.content = this.parseHTML(walker.currentNode as Element);
      } else if (tagName === 'source') {
        item.source = this.parseSource(walker.currentNode as Element);
      } else if (tagName === 'enclosure') {
        item.enclosure = this.parseEnclosure(walker.currentNode as Element);
      } else if (tagName === 'guid') {
        item.guid = this.parseGUID(walker.currentNode as Element);
      } else if (tagName === 'category') {
        item.categories = append(
          item.categories,
          this.parseCategory(walker.currentNode as Element)
        );
      }
    } while (walker.nextSibling());

    this.feed.items ? this.feed.items.push(item) : (this.feed.items = [item]);
  }

  private parseSource(node: Element): RSSSource {
    return {
      title: this.parseText(node),
      url: node.getAttribute('url'),
    };
  }

  private parseEnclosure(node: Element): RSSEnclosure {
    return {
      url: node.getAttribute('url'),
      length: node.getAttribute('length'),
      type: node.getAttribute('type'),
    };
  }

  private parseGUID(node: Element): RSSGUID {
    return {
      isPermalink: node.getAttribute('isPermalink') === 'true',
      value: this.parseText(node),
    };
  }

  private parseCategory(node: Element): RSSCategory {
    return {
      domain: node.getAttribute('domain'),
      value: this.parseText(node),
    };
  }

  private parseCloud(node: Element): RSSCloud {
    return {
      domain: node.getAttribute('domain'),
      path: node.getAttribute('path'),
      port: node.getAttribute('port'),
      protocol: node.getAttribute('protocol'),
      registerProcedure: node.getAttribute('registerProcedure'),
    };
  }

  private parseTextInput(node: Node): RSSTextInput {
    const walker = window.document.createTreeWalker(
      node,
      NodeFilter.SHOW_ELEMENT
    );
    walker.firstChild();

    let textInput = { ...this.textInput };

    do {
      const tagName = walker.currentNode.nodeName.toLowerCase();

      if (tagName === 'title') {
        textInput.title = this.parseText(walker.currentNode);
      } else if (tagName === 'description') {
        textInput.description = this.parseText(walker.currentNode);
      } else if (tagName === 'name') {
        textInput.name = this.parseText(walker.currentNode);
      } else if (tagName === 'link') {
        textInput.link = this.parseText(walker.currentNode);
      }
    } while (walker.nextSibling());

    return textInput;
  }

  private parseText(node: Node): Maybe<string> {
    const text = node.textContent;

    if (text !== null) {
      return text.trim();
    }

    return null;
  }

  private parseHTML(node: Node): Maybe<string> {
    const text = this.parseText(node);

    if (text === null) return null;

    const doc = new DOMParser().parseFromString(text, 'text/html');
    const element = sanitize(doc);

    return element.innerHTML;
  }
}
