/**
 * Path utility functions similar to the 'file' npm package
 */

/**
 * Joins two path segments similar to file.path.join
 * Works more consistently than path.join with empty paths
 */
export function join(base: string, path: string): string {
  if (!base) return path;
  if (!path) return base;
  
  const baseEndsWithSlash = base.endsWith('/');
  const pathStartsWithSlash = path.startsWith('/');
  
  if (baseEndsWithSlash && pathStartsWithSlash) {
    return base + path.substring(1);
  } else if (!baseEndsWithSlash && !pathStartsWithSlash) {
    return `${base}/${path}`;
  } else {
    return base + path;
  }
}

/**
 * Normalizes a path to ensure consistent representation
 */
export function normalize(path: string): string {
  // Ensure path starts with a slash
  const startWithSlash = path.startsWith('/') ? path : `/${path}`;
  // Remove double slashes and trailing slash
  return startWithSlash.replace(/\/+/g, '/').replace(/\/$/, '');
}

/**
 * Get a path relative to a root path
 */
export function relativePath(rootPath: string, fullPath: string): string {
  const normalizedRoot = normalize(rootPath);
  const normalizedFull = normalize(fullPath);
  
  if (normalizedFull.startsWith(normalizedRoot)) {
    const relativePath = normalizedFull.substring(normalizedRoot.length);
    return relativePath || '/';
  }
  
  return fullPath; // If not a subpath, return original
}

/**
 * Split a path into its component parts
 */
export function splitPath(path: string): string[] {
  return path.split('/').filter(Boolean);
}

/**
 * Get the directory part of a path
 */
export function dirname(path: string): string {
  const parts = splitPath(path);
  parts.pop(); // Remove the last part
  return '/' + parts.join('/');
}

/**
 * Get the filename part of a path
 */
export function filename(path: string): string {
  const parts = splitPath(path);
  return parts[parts.length - 1] || '';
}

/**
 * Check if a path is absolute
 */
export function isAbsolute(path: string): boolean {
  return path.startsWith('/');
}
