## pulse-feed

> Pulse Feed is a lightweight and robust RSS, Atom and JSON feeds parser with no dependencies.

It was designed to be running right in the browser, but you can easily use it in the node.js environment.

- 📦 Lightweight (5kb)
- 🚀 Fast (using Web API)
- 👌 No dependencies
- 😲 IE 9+ ([note](#polyfills))
- 🏗 Extendable
- 👮‍♂️ Typed with TypeScript

### Supported Feed Types:

- RSS 0.90, 0.92, 0.93, 0.94, 1.0, 2.0
- Atom 0.3, 1.0
- JSON
- Netscape RSS 0.91
- Userland RSS 0.91

### Core Concepts

`pulse-feed` is build upon [DOMParser](https://developer.mozilla.org/ru/docs/Web/API/DOMParser) and [TreeWalker](https://developer.mozilla.org/ru/docs/Web/API/TreeWalker).
Nowadays there's no need in third-party xml or json parsers.
All things we need work well out of the box in every modern browser since IE9.

### Extensions

Extensions found in feeds will be saved into `extensions` property this way:

```ts
{
  // ...
  extensions: {
    // Extension name
    'dc': {
      // Extension property containing an array
      'creator': [
        {
          name: 'creator',
          value: 'John Doe',
          attrs: null,
          children: null
        }
      ]
    }
  }
}
```

You can use this data on your own - mix it with the main feed data (like titles, dates, descriptions, etc.) or handle it differently.

### Invalid Feeds

This library can successfully handle any xml document, no matter it follows strictly the RSS spec, or not. As long as it can be parsed with DOMParser, it should work.

### Polyfills

If you are running pulse-rss in the browser environment, and you indeed need to support too old browsers, you have to include some polyfills, which with high probability you are already using:

- Array.includes
- Map
- fetch
- Promise

### Running in Node.js

Node.js doesn't have some Web APIs used in pulse-rss, so you should take care of them.
You can use jest's [jsdom](https://github.com/jsdom/jsdom) for things such as DOMParser and TreeWalker. For `fetch` [node-fetch](https://github.com/node-fetch/node-fetch) can be used.

### Error Handling

There are 2 exception types, representing different circumstances that broke the parsing process:

- NetworkError - thrown if fetch got in response status different form 2xx
- FeedTypeError - thrown if unknown feed type received

### Useful Links

- [RSS Best Practices Profile](http://www.rssboard.org/rss-profile)
- [Dublin Core™ Metadata Element Set](https://www.dublincore.org/specifications/dublin-core/dces/)
- [Apple's iTunes](https://help.apple.com/itc/podcasts_connect/#/itcb54353390)
