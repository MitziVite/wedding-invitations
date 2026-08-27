import type { MetadataRoute } from "next";

// Belt-and-suspenders alongside the per-page `robots` meta tag — a private,
// invite-only site that was never meant to be crawled or indexed.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
