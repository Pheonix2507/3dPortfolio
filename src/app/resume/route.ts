import { NextResponse } from "next/server";

/**
 * Permanent link to the current résumé, at /resume on this domain.
 *
 * The PDF deliberately does not live in this repo. It changes often, git stores
 * every revision of a binary in full, and PDFs do not delta-compress, so
 * committing it would grow the repository forever for no benefit.
 *
 * Instead, host the file somewhere that supports replacing it in place under a
 * stable URL, and point RESUME_URL at it. Updating the résumé then means
 * uploading a new PDF and nothing else: no commit, no deploy, no code change.
 *
 * Read at request time rather than build time, so the destination can change
 * without rebuilding the site.
 */
export const dynamic = "force-dynamic";

export function GET() {
  const target = process.env.RESUME_URL;

  if (!target) {
    return new NextResponse(
      "Résumé link is not configured. Set RESUME_URL in the environment.",
      {
        status: 503,
        headers: { "content-type": "text/plain; charset=utf-8" },
      },
    );
  }

  // A malformed value would otherwise throw inside NextResponse.redirect and
  // surface as an opaque 500.
  let destination: URL;
  try {
    destination = new URL(target);
  } catch {
    return new NextResponse("RESUME_URL is not a valid absolute URL.", {
      status: 500,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  // Temporary, not permanent: the destination is expected to change.
  return NextResponse.redirect(destination, 307);
}
