import { useEffect, useState } from "react";
import { useRouteLoaderData } from "react-router";
import type { loader } from "~/root";

/**
 * "Now" for date-based content (upcoming camps/shows). Starts as the build time so the
 * pre-rendered HTML and first client render match, then switches to the real time.
 */
export function useNow() {
  const data = useRouteLoaderData<typeof loader>("root");
  const [now, setNow] = useState(() => new Date(data?.builtAt ?? Date.now()));
  useEffect(() => setNow(new Date()), []);
  return now;
}
