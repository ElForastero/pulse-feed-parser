import { Extensions } from './Feed';

// Feed is an RSS feed
export type RSSFeed = {
  title: Maybe<string>;
  link: Maybe<string>;
  description: Maybe<string>;
  language: Maybe<string>;
  copyright: Maybe<string>;
  managingEditor: Maybe<string>;
  webmaster: Maybe<string>;
  pubDate: Maybe<string>;
  lastBuildDate: Maybe<string>;
  categories: Maybe<Array<RSSCategory>>;
  generator: Maybe<string>;
  docs: Maybe<string>;
  ttl: Maybe<string>;
  image: Maybe<RSSImage>;
  rating: Maybe<string>;
  skipHours: Maybe<string>;
  skipDays: Maybe<string>;
  cloud: Maybe<RSSCloud>;
  textInput: Maybe<RSSTextInput>;
  items: Maybe<Array<RSSItem>>;
  extensions: Maybe<Extensions>;
};

// Item is an RSS Item
export type RSSItem = {
  title: Maybe<string>;
  link: Maybe<string>;
  description: Maybe<string>;
  content: Maybe<string>;
  author: Maybe<string>;
  categories: Maybe<Array<RSSCategory>>;
  comments: Maybe<string>;
  enclosure: Maybe<RSSEnclosure>;
  guid: Maybe<RSSGUID>;
  pubDate: Maybe<string>;
  source: Maybe<RSSSource>;
  extensions: Maybe<Extensions>;
};

// Image is an image that represents the feed
export type RSSImage = {
  url: Maybe<string>;
  link: Maybe<string>;
  title: Maybe<string>;
  width: Maybe<string>;
  height: Maybe<string>;
  description: Maybe<string>;
};

// Enclosure is a media object that is attached to
// the item
export type RSSEnclosure = {
  url: Maybe<string>;
  length: Maybe<string>;
  type: Maybe<string>;
};

// GUID is a unique identifier for an item
export type RSSGUID = {
  value: Maybe<string>;
  isPermalink: boolean;
};

// Source contains feed information for another
// feed if a given item came from that feed
export type RSSSource = {
  title: Maybe<string>;
  url: Maybe<string>;
};

// Category is category metadata for Feeds and Entries
export type RSSCategory = {
  domain: Maybe<string>;
  value: Maybe<string>;
};

// TextInput specifies a text input box that
// can be displayed with the channel
export type RSSTextInput = {
  title: Maybe<string>;
  description: Maybe<string>;
  name: Maybe<string>;
  link: Maybe<string>;
};

// Cloud allows processes to register with a
// cloud to be notified of updates to the channel,
// implementing a lightweight publish-subscribe protocol
// for RSS feeds
export type RSSCloud = {
  domain: Maybe<string>;
  port: Maybe<string>;
  path: Maybe<string>;
  registerProcedure: Maybe<string>;
  protocol: Maybe<string>;
};
