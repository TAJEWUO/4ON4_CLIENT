/**
 * Image utility functions for consistent image handling
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

/**
 * Converts any image path format to a full URL
 * Handles: full URLs, relative paths, object with path property
 */
export function getImageUrl(image: string | { path: string } | null | undefined): string | null {
  if (!image) {
    console.log("[getImageUrl] No image provided");
    return null;
  }

  let path: string;

  // Handle object format
  if (typeof image === "object" && image.path) {
    path = image.path;
    console.log("[getImageUrl] Object format, path:", path);
  } else if (typeof image === "string") {
    path = image;
    console.log("[getImageUrl] String format, path:", path);
  } else {
    console.log("[getImageUrl] Unknown format:", typeof image, image);
    return null;
  }

  // Already a full URL
  if (path.startsWith("http://") || path.startsWith("https://")) {
    console.log("[getImageUrl] Already full URL:", path);
    return path;
  }

  // Convert relative path to full URL
  const fullUrl = `${API_BASE}/${path.replace(/^\/+/, "")}`;
  console.log("[getImageUrl] Converted to full URL:", fullUrl);
  return fullUrl;
}

/**
 * Get multiple image URLs from an array
 */
export function getImageUrls(images: Array<string | { path: string }> | null | undefined): string[] {
  if (!images || !Array.isArray(images)) return [];
  return images.map(getImageUrl).filter((url): url is string => url !== null);
}

/**
 * Image component with error handling and retry logic
 */
export function createImageWithFallback(
  src: string | null,
  alt: string,
  className?: string,
  fallbackSrc?: string
): React.ImgHTMLAttributes<HTMLImageElement> {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (fallbackSrc && img.src !== fallbackSrc) {
      img.src = fallbackSrc;
    } else {
      // Replace with placeholder
      img.style.display = "none";
    }
  };

  return {
    src: src || fallbackSrc || "",
    alt,
    className,
    onError: handleError,
    loading: "lazy" as const,
    crossOrigin: "anonymous" as const,
  };
}

/**
 * Preload an image to check if it's accessible
 */
export function preloadImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}
