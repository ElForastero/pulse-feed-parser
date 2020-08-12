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

const SVG_ELEMENTS = new Set([
  'a',
  'animate',
  'animateColor',
  'animateMotion',
  'animateTransform',
  'circle',
  'defs',
  'desc',
  'ellipse',
  'font-face',
  'font-face-name',
  'font-face-src',
  'foreignObject',
  'g',
  'glyph',
  'hkern',
  'line',
  'linearGradient',
  'marker',
  'metadata',
  'missing-glyph',
  'mpath',
  'path',
  'polygon',
  'polyline',
  'radialGradient',
  'rect',
  'set',
  'stop',
  'svg',
  'switch',
  'text',
  'title',
  'tspan',
  'use',
]);

const SVG_ATTRIBUTES = new Set([
  'accent-height',
  'accumulate',
  'additive',
  'alphabetic',
  'arabic-form',
  'ascent',
  'attributeName',
  'attributeType',
  'baseProfile',
  'bbox',
  'begin',
  'by',
  'calcMode',
  'cap-height',
  'class',
  'color',
  'color-rendering',
  'content',
  'cx',
  'cy',
  'd',
  'descent',
  'display',
  'dur',
  'dx',
  'dy',
  'end',
  'fill',
  'fill-opacity',
  'fill-rule',
  'font-family',
  'font-size',
  'font-stretch',
  'font-style',
  'font-variant',
  'font-weight',
  'from',
  'fx',
  'fy',
  'g1',
  'g2',
  'glyph-name',
  'gradientUnits',
  'hanging',
  'height',
  'horiz-adv-x',
  'horiz-origin-x',
  'id',
  'ideographic',
  'k',
  'keyPoints',
  'keySplines',
  'keyTimes',
  'lang',
  'marker-end',
  'marker-mid',
  'marker-start',
  'markerHeight',
  'markerUnits',
  'markerWidth',
  'mathematical',
  'max',
  'min',
  'name',
  'offset',
  'opacity',
  'orient',
  'origin',
  'overline-position',
  'overline-thickness',
  'panose-1',
  'path',
  'pathLength',
  'points',
  'preserveAspectRatio',
  'r',
  'refX',
  'refY',
  'repeatCount',
  'repeatDur',
  'requiredExtensions',
  'requiredFeatures',
  'restart',
  'rotate',
  'rx',
  'ry',
  'slope',
  'stemh',
  'stemv',
  'stop-color',
  'stop-opacity',
  'strikethrough-position',
  'strikethrough-thickness',
  'stroke',
  'stroke-dasharray',
  'stroke-dashoffset',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-miterlimit',
  'stroke-opacity',
  'stroke-width',
  'systemLanguage',
  'target',
  'text-anchor',
  'to',
  'transform',
  'type',
  'u1',
  'u2',
  'underline-position',
  'underline-thickness',
  'unicode',
  'unicode-range',
  'units-per-em',
  'values',
  'version',
  'viewBox',
  'visibility',
  'width',
  'widths',
  'x',
  'x-height',
  'x1',
  'x2',
  'xlink:actuate',
  'xlink:arcrole',
  'xlink:href',
  'xlink:role',
  'xlink:show',
  'xlink:title',
  'xlink:type',
  'xml:base',
  'xml:lang',
  'xml:space',
  'xmlns',
  'xmlns:xlink',
  'y',
  'y1',
  'y2',
  'zoomAndPan',
]);

const ACCEPTABLE_SVG_ROPERTIES = new Set([
  'fill',
  'fill-opacity',
  'fill-rule',
  'stroke',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-opacity',
  'stroke-width',
]);

/**
 * Clear the given DOM three from unwanted elements and attributes.
 */
export const sanitize = (doc: Document): Element => {
  // const e = doc.body.cloneNode(true);
  const walker = doc.createTreeWalker(
    doc.body,
    NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_COMMENT
  );

  while (walker.nextNode()) {
    const current = walker.currentNode as Element;

    if (
      // Strip HTML comments
      current.nodeType === Node.COMMENT_NODE ||
      // Strip empty elements
      current.childNodes.length === 0 ||
      // Strip unacceptable elements
      !ACCEPTABLE_ELEMENTS.has(current.nodeName.toLowerCase())
    ) {
      const parent = current.parentNode!;

      parent.removeChild(current);

      // Set currentNode to parent to prevent breaking of the walk
      walker.currentNode = parent;
      continue;
    }

    current.getAttributeNames().forEach(attribute => {
      if (!ACCEPTABLE_ATTRIBUTES.has(attribute)) {
        current.removeAttribute(attribute);
      }
    });
  }

  return doc.body;
};
