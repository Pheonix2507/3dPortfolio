/**
 * Stations on the Kubernetes Cost Analyzer walkthrough, in the order data
 * actually moves through the system. The scroll journey follows the pipeline
 * rather than an arbitrary sequence of talking points.
 */
export interface JourneyStation {
  /** Two-digit marker, matching the section numbering used across the site. */
  index: string;
  title: string;
  body: string;
}

export const journeyStations: JourneyStation[] = [
  {
    index: "01",
    title: "Cluster",
    body: "Shared informers hold a live cache of nodes, namespaces, pods and ReplicaSets, with pod ownership resolved through to the owning Deployment. Read-only throughout: every write and secret read is denied, and that denial is asserted rather than assumed.",
  },
  {
    index: "02",
    title: "Requests",
    body: "Effective pod requests are computed the way the scheduler computes them — init containers as a maximum, sidecars additive, pod overhead included. Getting this wrong misattributes the bill before any pricing is applied.",
  },
  {
    index: "03",
    title: "Usage",
    body: "Usage comes from Prometheus per window: averages for cost, peaks for right-sizing. The two answer different questions, so both are collected rather than picking one and hoping.",
  },
  {
    index: "04",
    title: "Waste",
    body: "waste = max(requested − used, 0), applied per row inside the sum, then split across ten dimensions. Applied to the aggregate instead, an under-requested container issues a credit against genuine waste elsewhere: one namespace reported zero memory waste while actually holding 50 GiB-hours.",
  },
  {
    index: "05",
    title: "Store",
    body: "A partitioned Postgres star schema at container grain: normalised dimensions, an immutable fact table, monthly range partitions and idempotent upserts. Money is exact decimal from database column to browser, never float. A nightly rollup compresses history 292x into immutable monthly statements.",
  },
  {
    index: "06",
    title: "Serve",
    body: "A versioned REST API with bearer auth, cursor pagination and rate limiting, and a Next.js dashboard typed from its OpenAPI spec. A Helm chart installs the whole thing with Prometheus alert rules, behind CI that refuses to go green on an untested database.",
  },
];
