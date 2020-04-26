/**
 * Append an item to the collection or create this collection.
 */
export const append = <T>(collection: Maybe<Array<T>>, item: T): Array<T> =>
  collection !== null ? [...collection, item] : [item];
