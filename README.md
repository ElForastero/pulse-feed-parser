## RSS Pulse Feed Parser

> This is a lightweight and robust RSS, Atom and JSON feeds parser with no dependencies.
>
> [Pulse Feed Reader](https://chrome.google.com/webstore/detail/pulse-feed-reader/lcobhhomehlpbfhobkimfcnohdchjdke) is an example of using this parser.
>
> NOTE: The library is under development, so the bugs can happen, and the API may change.

It was designed to be running right in the browser, but you can easily use it in the Node.js environment.

- 📦 Lightweight (~5kb)
- 🚀 Fast (using Web API)
- 👌 No dependencies
- 😲 IE 9+ ([note](#polyfills))
- 🏗 Extendable
- 👮‍♂️ Typed with TypeScript

### Supported Feed Types:

- RSS 0.90, 0.92, 0.93, 0.94, 1.0, 2.0
- Atom 0.3, 1.0
- Netscape RSS 0.91
- Userland RSS 0.91

### Core Concepts

`pulse-feed-parser` is build upon [DOMParser](https://developer.mozilla.org/ru/docs/Web/API/DOMParser) and [TreeWalker](https://developer.mozilla.org/ru/docs/Web/API/TreeWalker).
Nowadays there's no need in third-party XML or JSON parsers.
All things we need work well out of the box in every modern browser since IE9.

It parses the given URL or Document instance, detecting the type of the given feed, and unifies the result into common Feed structure.

Feed is the universal Feed type that Atom and RSS gets translated to. It represents a web feed.

```ts
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
```

### Extensions

Extensions found in feeds will be saved into `extensions` property this way:

```ts
{
  // ...
  extensions: {
    // Extension name
    dc: {
      // Extension property containing an array
      creator: [
        {
          name: 'creator',
          value: 'John Doe',
          attrs: null,
          children: null,
        },
      ];
    }
  }
}
```

You can use this data on your own - mix it with the main feed data (like titles, dates, descriptions, etc.) or handle it differently.

### Invalid Feeds

This library can successfully handle any XML document, no matter it follows strictly the RSS spec, or not. As long as it can be parsed with DOMParser, it should work.

### Polyfills

If you are running `pulse-rss-parser` in the browser environment, and you indeed need to support too old browsers, you have to include some polyfills, which with high probability you are already using:

- Array.includes
- Map
- fetch
- Promise

### Running in Node.js

Node.js doesn't have some Web APIs used in `pulse-rss-parser`, so you should take care of them.
You can use jest's [jsdom](https://github.com/jsdom/jsdom) for things such as DOMParser and TreeWalker. For `fetch` [node-fetch](https://github.com/node-fetch/node-fetch) can be used.

### Error Handling

There are 2 exception types, representing different circumstances that broke the parsing process:

- NetworkError - thrown if fetch got in response status different from 2xx
- FeedTypeError - thrown if it's impossible to detect the type of the feed

### Examples

**Parsing from a URL**

```ts
import { Parser } from 'pulse-feed-parser';

const feedURL = 'https://github.blog/feed/';
const feed: Feed = await new Parser().parseURL(feedURL);
```

**Parsing a Document instance**

```ts
import { Parser, Feed } from 'pulse-feed-parser';

const content = `<?xml version="1.0" encoding="UTF-8"?><rss>...`;
const doc = new DOMParser().parseFromString(content, 'application/xml');
const feed: Feed = await new Parser().parseDocument(doc);
```

**Error handling**

```ts
import { NetworkError, FeedTypeError, Parser } from 'pulse-feed-parser';

try {
  const feed: Feed = await new Parser().parseURL(url);
} catch (e) {
  if (e instanceof NetworkError) {
    console.log('Some problems with network');
  } else if (e instanceof FeedTypeError) {
    console.log('Unknown feed type');
  }
}
```

**Manually detecting feed type**

```ts
import { XmlFeedTypeDetector, FeedType } from 'pulse-feed-parser';

const type: FeedType = XmlFeedTypeDetector.detect(document);
```

**Calling concrete parser directly**

```ts
import { AtomParser, RSSParser, Atom, RSS } from 'pulse-feed-parser';

const atomFeed: Atom = new AtomParser(document).parse();
const rssFeed: RSS = new RSSParser(document).parse();
```

### Useful Links

- [RSS Best Practices Profile](http://www.rssboard.org/rss-profile)
- [Dublin Core™ Metadata Element Set](https://www.dublincore.org/specifications/dublin-core/dces/)
- [Apple's iTunes](https://help.apple.com/itc/podcasts_connect/#/itcb54353390)
