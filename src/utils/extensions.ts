import { Extension } from '../types/Extension';

const EXTENSION: Extension = {
  name: '',
  value: null,
  attrs: null,
  children: null,
};

/**
 * Check if the given node is an extension type node.
 */
export const isExtension = (node: Node): boolean => {
  const prefix = (node as Element).prefix;

  return prefix !== null && !['rss', 'rdf', 'content'].includes(prefix);
};

/**
 * Get extension name - a prefix of the node
 */
export const getExtensionName = (node: Element): string => node.prefix!;

/**
 * Parse the given extension node into Extension structure
 */
export const parseExtension = (node: Element): [string, Extension] => {
  const ext = { ...EXTENSION };
  const firstChildName = node.firstChild?.nodeName;
  ext.name = node.nodeName.toLowerCase();

  if (
    !node.hasChildNodes() ||
    firstChildName === '#text' ||
    firstChildName === '#cdata-section'
  ) {
    ext.value = node.textContent!.trim();
  } else {
    ext.children = Array.from(node.childNodes).map(node => {
      const [, data] = parseExtension(node as Element);
      return data;
    });
  }

  if (node.hasAttributes()) {
    ext.attrs = node
      .getAttributeNames()
      .reduce(
        (attrs, name) => ({ ...attrs, [name]: node.getAttribute(name) }),
        {}
      );
  }

  const propertyName = node.nodeName.replace(`${node.prefix}:`, '');

  return [propertyName, ext];
};
