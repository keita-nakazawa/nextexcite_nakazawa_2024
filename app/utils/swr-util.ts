/** APIの$url, queryを元にSWRキー用のオブジェクトを生成する関数 */
export function createSWRKey({ url, query }: { url: URL; query?: Record<string, string> }): string {
  const path = query ? url.pathname + "?" + new URLSearchParams(query).toString() : url.pathname;
  return path;
}
