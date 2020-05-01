import { Extension } from './Extension';

// Feed is the universal Feed type that atom.Feed
// and rss.Feed gets translated to. It represents
// a web feed.
export type Feed = {
  title: Maybe<string>;
  description: Maybe<string>;
  link: Maybe<string>;
  feedLink: Maybe<string>;
  updated: Maybe<string>;
  published: Maybe<string>;
  author: Maybe<Person>;
  language: Maybe<string>;
  image: Maybe<Image>;
  copyright: Maybe<string>;
  generator: Maybe<string>;
  categories: Maybe<Array<string>>;
  items: Maybe<Array<Item>>;
  feedType: 'rss' | 'atom';
  feedVersion: string;
  extensions: Maybe<Extensions>;
};

// Item is the universal Item type that atom.Entry
// and rss.Item gets translated to.  It represents
// a single entry in a given feed.
export type Item = {
  title: Maybe<string>;
  description: Maybe<string>;
  content: Maybe<string>;
  link: Maybe<string>;
  updated: Maybe<string>;
  published: Maybe<string>;
  author: Maybe<Person>;
  guid: Maybe<string>;
  image: Maybe<string>;
  categories: Maybe<Array<string>>;
  enclosures: Maybe<Array<Enclosure>>;
  extensions: Maybe<Extensions>;
};

// Enclosure is a file associated with a given Item.
export type Enclosure = {
  url: Maybe<string>;
  length: Maybe<string>;
  type: Maybe<string>;
};

// Image is an image that is the artwork for a given
// feed or item.
export type Image = {
  url: Maybe<string>;
  title: Maybe<string>;
};

// Person is an individual specified in a feed
// (e.g. an author)
export type Person = {
  name: Maybe<string>;
  email: Maybe<string>;
};

// Feed extensions like DC or iTunes
export type Extensions = {
  // Extension name
  [key: string]: {
    // Extension property
    [key: string]: Array<Extension>;
  };
};
