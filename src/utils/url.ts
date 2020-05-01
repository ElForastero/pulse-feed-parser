// HTML attributes which contain URIs
// https://pythonhosted.org/feedparser/resolving-relative-links.html
// To catch every possible URI attribute is non-trivial:
// https://stackoverflow.com/questions/2725156/complete-list-of-html-tag-attributes-which-have-a-url-value
const htmlURIAttrs = {
  action: true,
  background: true,
  cite: true,
  codebase: true,
  data: true,
  href: true,
  poster: true,
  profile: true,
  scheme: true,
  src: true,
  uri: true,
  usemap: true,
};
