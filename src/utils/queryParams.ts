export function setParam(key, value): void {
  const url = new URL(window.location.href);

  if (value == null) {
    url.searchParams.delete(key);
  } else {
    if (url.searchParams.has(key)) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.append(key, value);
    }
  }
  window.history.pushState(null, null, url as any);
}

export function removeQueryParams(): void {
  const url = new URL(window.location.href);
  Array.from((url.searchParams as any).keys()).forEach((key: string) => {
    url.searchParams.delete(key);
  });
  window.history.pushState(null, null, url as any);
}
