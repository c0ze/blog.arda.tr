/** The fields the post order needs; a blog CollectionEntry has them. */
export interface Dated {
  id: string;
  data: { date: Date };
}

/**
 * Comparator ordering posts newest-first by `data.date`. Same-date posts
 * (thirteen dates carry two to four) fall back to the post id, descending, so
 * ledger numbers and prev/next links are the same in every build.
 */
export function byNewestFirst(a: Dated, b: Dated): number {
  const byDate = b.data.date.getTime() - a.data.date.getTime();
  if (byDate !== 0) return byDate;
  return a.id < b.id ? 1 : a.id > b.id ? -1 : 0;
}
