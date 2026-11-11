/** Escapes text for HTML element content and double-quoted attributes. */
export function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * The HTML description of an RSS item: the cover image (when the post has
 * one) and the excerpt as escaped text. Undefined when there is neither.
 */
export function feedItemDescription({ text, imageURL }: { text?: string; imageURL?: string }): string | undefined {
  const body = text ? escapeHtml(text) : '';
  if (!imageURL) return body || undefined;
  const img = `<img src="${escapeHtml(imageURL)}" alt="" style="max-width: 100%; margin-bottom: 16px;" />`;
  return body ? `${img}<p>${body}</p>` : img;
}
