import { Extensions } from './Feed';

// Feed is an Atom Feed
export type AtomFeed = {
  title: Maybe<string>;
  id: Maybe<string>;
  updated: Maybe<string>;
  subtitle: Maybe<string>;
  links: Maybe<Array<AtomLink>>;
  language: Maybe<string>;
  generator: Maybe<AtomGenerator>;
  icon: Maybe<string>;
  logo: Maybe<string>;
  rights: Maybe<string>;
  contributors: Maybe<Array<AtomPerson>>;
  authors: Maybe<Array<AtomPerson>>;
  categories: Maybe<Array<AtomCategory>>;
  entries: Maybe<Array<AtomEntry>>;
  extensions: Maybe<Extensions>
};

// Entry is an Atom Entry
export type AtomEntry = {
  title: Maybe<string>;
  id: Maybe<string>;
  updated: Maybe<string>;
  summary: Maybe<string>;
  authors: Maybe<Array<AtomPerson>>;
  contributors: Maybe<Array<AtomPerson>>;
  categories: Maybe<Array<AtomCategory>>;
  links: Maybe<Array<AtomLink>>;
  rights: Maybe<string>;
  published: Maybe<string>;
  source: Maybe<AtomSource>;
  content: Maybe<AtomContent>;
  extensions: Maybe<Extensions>
};

// Category is category metadata for Feeds and Entries
export type AtomCategory = {
  term: Maybe<string>;
  scheme: Maybe<string>;
  label: Maybe<string>;
};

// Person represents a person in an Atom feed
// for things like Authors, Contributors, etc
export type AtomPerson = {
  name: Maybe<string>;
  email: Maybe<string>;
  uri: Maybe<string>;
};

// Link is an Atom link that defines a reference
// from an entry or feed to a Web resource
export type AtomLink = {
  href: Maybe<string>;
  hreflang: Maybe<string>;
  rel: Maybe<string>;
  type: Maybe<string>;
  title: Maybe<string>;
  length: Maybe<string>;
};

// Content either contains or links to the content of
// the entry
export type AtomContent = {
  src: Maybe<string>;
  type: Maybe<string>;
  value: Maybe<string>;
};

// Generator identifies the agent used to generate a
// feed, for debugging and other purposes.
export type AtomGenerator = {
  value: Maybe<string>;
  uri: Maybe<string>;
  version: Maybe<string>;
};

// Source contains the feed information for another
// feed if a given entry came from that feed.
export type AtomSource = {
  title: Maybe<string>;
  id: Maybe<string>;
  updated: Maybe<string>;
  subtitle: Maybe<string>;
  links: Maybe<Array<AtomLink>>;
  generator: Maybe<AtomGenerator>;
  icon: Maybe<string>;
  logo: Maybe<string>;
  rights: Maybe<string>;
  contributors: Maybe<Array<AtomPerson>>;
  authors: Maybe<Array<AtomPerson>>;
  categories: Maybe<Array<AtomCategory>>;
};

// Text represents an atom feed text node
export type AtomText = {
  type: Maybe<string>;
  mode: Maybe<string>;
  innerXML: Maybe<string>;
};
