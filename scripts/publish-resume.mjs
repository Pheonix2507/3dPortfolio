/**
 * Publishes a résumé PDF to Vercel Blob under a fixed pathname.
 *
 * The PDF is never committed to this repo: it changes often and git keeps every
 * revision of a binary in full. Instead it lives in Blob at one stable URL, and
 * /resume redirects there. Updating the résumé is this one command, with no
 * commit and no deploy.
 *
 *   npm run resume:publish -- ~/Downloads/Chintan_Resume.pdf
 *
 * Requires BLOB_READ_WRITE_TOKEN. Put it in .env.local, which the npm script
 * loads for you.
 */
import { readFile } from "node:fs/promises";
import { basename, extname } from "node:path";
import { put } from "@vercel/blob";

/** Fixed so the public URL never changes between uploads. */
const BLOB_PATHNAME = "resume/chintan-bhara-resume.pdf";

/**
 * Blob's default cache lifetime is long. Because this object is replaced rather
 * than versioned, a long TTL means the CDN keeps serving the previous résumé for
 * weeks after an update. Five minutes is a reasonable compromise.
 */
const CACHE_MAX_AGE_SECONDS = 300;

function fail(message) {
  console.error(`\n  ${message}\n`);
  process.exit(1);
}

const source = process.argv[2];

if (!source) {
  fail(
    "Usage: npm run resume:publish -- <path-to-pdf>\n" +
      "  e.g. npm run resume:publish -- ~/Downloads/Chintan_Resume.pdf",
  );
}

if (extname(source).toLowerCase() !== ".pdf") {
  fail(`Expected a .pdf file, got "${basename(source)}".`);
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  fail(
    "BLOB_READ_WRITE_TOKEN is not set.\n" +
      "  Create a Blob store in the Vercel dashboard, then copy its token into\n" +
      "  .env.local. See .env.example for the key name.",
  );
}

let file;
try {
  file = await readFile(source);
} catch (error) {
  fail(`Could not read "${source}": ${error.message}`);
}

let blob;
try {
  blob = await put(BLOB_PATHNAME, file, {
    access: "public",
    contentType: "application/pdf",
    // A stable URL is the entire point, so no random suffix, and overwrite in
    // place rather than creating a second object.
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: CACHE_MAX_AGE_SECONDS,
  });
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("private")) {
    fail(
      "The Blob store is configured for private access, but a résumé download\n" +
        "  needs to be public.\n\n" +
        "  In the Vercel dashboard, open Storage > your Blob store > Settings and\n" +
        "  switch access to public. If that is not offered for an existing store,\n" +
        "  create a new store with public access and swap the token in .env.local.",
    );
  }

  fail(`Upload failed: ${message}`);
}

const sizeKb = (file.byteLength / 1024).toFixed(0);

console.log(`\n  Published ${basename(source)} (${sizeKb} KB)`);
console.log(`  URL: ${blob.url}`);
console.log(
  `\n  This URL is stable, so you only need to set it once:\n` +
    `    RESUME_URL=${blob.url}\n` +
    `  Future updates just re-run this command.\n`,
);
