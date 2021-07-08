const ACCEPTABLE_ELEMENTS = new Set([
  'a',
  'abbr',
  'acronym',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'big',
  'blockquote',
  'br',
  'button',
  'canvas',
  'caption',
  'center',
  'cite',
  'code',
  'col',
  'colgroup',
  'command',
  'datagrid',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'dir',
  'div',
  'dl',
  'dt',
  'em',
  'event-source',
  'fieldset',
  'figcaption',
  'figure',
  'font',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hr',
  'i',
  'img',
  'input',
  'ins',
  'kbd',
  'keygen',
  'label',
  'legend',
  'li',
  'm',
  'map',
  'menu',
  'meter',
  'multicol',
  'nav',
  'nextid',
  'noscript',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'pre',
  'progress',
  'q',
  's',
  'samp',
  'section',
  'select',
  'small',
  'sound',
  'source',
  'spacer',
  'span',
  'strike',
  'strong',
  'sub',
  'sup',
  'svg',
  'table',
  'tbody',
  'td',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'tr',
  'tt',
  'u',
  'ul',
  'var',
  'video',
  'iframe',
]);

const ACCEPTABLE_ATTRIBUTES = new Set([
  'abbr',
  'align',
  'alt',
  'autocomplete',
  'autofocus',
  'cellpadding',
  'cellspacing',
  'cite',
  'colspan',
  'compact',
  'disabled',
  'height',
  'href',
  'hreflang',
  'label',
  'rows',
  'rowspan',
  'span',
  'src',
  'target',
  'title',
  'width',
]);

const ACCEPTABLE_EMPTY_ELEMENTS = new Set([
  'img',
  'video',
  'audio',
  'hr',
  'br',
  'canvas',
  'input',
  'area',
  'iframe',
]);

const MATHML_ELEMENTS = new Set([
  'annotation',
  'annotation-xml',
  'maction',
  'maligngroup',
  'malignmark',
  'math',
  'menclose',
  'merror',
  'mfenced',
  'mfrac',
  'mglyph',
  'mi',
  'mlabeledtr',
  'mlongdiv',
  'mmultiscripts',
  'mn',
  'mo',
  'mover',
  'mpadded',
  'mphantom',
  'mprescripts',
  'mroot',
  'mrow',
  'ms',
  'mscarries',
  'mscarry',
  'msgroup',
  'msline',
  'mspace',
  'msqrt',
  'msrow',
  'mstack',
  'mstyle',
  'msub',
  'msubsup',
  'msup',
  'mtable',
  'mtd',
  'mtext',
  'mtr',
  'munder',
  'munderover',
  'none',
  'semantics',
]);

const MATHML_ATTRIBUTES = new Set([
  'accent',
  'accentunder',
  'actiontype',
  'align',
  'alignmentscope',
  'altimg',
  'altimg-height',
  'altimg-valign',
  'altimg-width',
  'alttext',
  'bevelled',
  'charalign',
  'close',
  'columnalign',
  'columnlines',
  'columnspacing',
  'columnspan',
  'columnwidth',
  'crossout',
  'decimalpoint',
  'denomalign',
  'depth',
  'dir',
  'display',
  'displaystyle',
  'edge',
  'encoding',
  'equalcolumns',
  'equalrows',
  'fence',
  'fontstyle',
  'fontweight',
  'form',
  'frame',
  'framespacing',
  'groupalign',
  'height',
  'href',
  'id',
  'indentalign',
  'indentalignfirst',
  'indentalignlast',
  'indentshift',
  'indentshiftfirst',
  'indentshiftlast',
  'indenttarget',
  'infixlinebreakstyle',
  'largeop',
  'length',
  'linebreak',
  'linebreakmultchar',
  'linebreakstyle',
  'lineleading',
  'linethickness',
  'location',
  'longdivstyle',
  'lquote',
  'lspace',
  'mathbackground',
  'mathcolor',
  'mathsize',
  'mathvariant',
  'maxsize',
  'minlabelspacing',
  'minsize',
  'movablelimits',
  'notation',
  'numalign',
  'open',
  'other',
  'overflow',
  'position',
  'rowalign',
  'rowlines',
  'rowspacing',
  'rowspan',
  'rquote',
  'rspace',
  'scriptlevel',
  'scriptminsize',
  'scriptsizemultiplier',
  'selection',
  'separator',
  'separators',
  'shift',
  'side',
  'src',
  'stackalign',
  'stretchy',
  'subscriptshift',
  'superscriptshift',
  'symmetric',
  'voffset',
  'width',
  'xlink:href',
  'xlink:show',
  'xlink:type',
  'xmlns',
  'xmlns:xlink',
]);

const ALL_ACCEPTABLE_ELEMENTS = new Set([
  ...ACCEPTABLE_ELEMENTS,
  ...MATHML_ELEMENTS,
]);

/**
 * Clear the given DOM three from unwanted elements and attributes.
 */
export const sanitize = (doc: Document): string => {
  const walker = doc.createTreeWalker(
    doc.body,
    NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_COMMENT
  );

  while (walker.nextNode()) {
    const current = walker.currentNode as Element;
    const nodeName = current.nodeName.toLowerCase();

    // Strip HTML comments
    // Strip unacceptable elements
    if (
      current.nodeType === Node.COMMENT_NODE ||
      !ALL_ACCEPTABLE_ELEMENTS.has(nodeName)
    ) {
      removeNodeFromDocument(walker, current);
      continue;
    }

    // Remove redundant empty elements
    if (
      current.childNodes.length === 0 &&
      !ACCEPTABLE_EMPTY_ELEMENTS.has(nodeName)
    ) {
      removeNodeFromDocument(walker, current);
      continue;
    }

    // Skip SVG checking
    if (nodeName === 'svg') {
      skipNodeChecking(walker, current);
      continue;
    }

    // Clear common elements' attributes
    if (ACCEPTABLE_ELEMENTS.has(nodeName)) {
      current.getAttributeNames().forEach(attribute => {
        if (!ACCEPTABLE_ATTRIBUTES.has(attribute)) {
          current.removeAttribute(attribute);
        }
      });
      // Clean MATHML elements' attributes
    } else if (MATHML_ELEMENTS.has(nodeName)) {
      current.getAttributeNames().forEach(attribute => {
        if (!MATHML_ATTRIBUTES.has(attribute)) {
          current.removeAttribute(attribute);
        }
      });
    }
  }

  return doc.body.innerHTML;
};

/**
 * Helper that remove the node from the document and sets a currentNode
 * of a walker object back to parent to continue walking.
 */
const removeNodeFromDocument = (walker: TreeWalker, node: Element) => {
  const parent = node.parentNode!;
  parent.removeChild(node);

  // Set currentNode to parent to prevent breaking of the walk
  walker.currentNode = parent;
};

/**
 * Sets currentNode to next available
 */
const skipNodeChecking = (walker: TreeWalker, node: Element) => {
  const nextSibling = node.nextSibling;

  if (nextSibling !== null) {
    walker.currentNode = nextSibling;
  }
};
