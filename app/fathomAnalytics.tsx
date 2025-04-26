import { useEffect } from "react";
import { useLocation } from "react-router";
import { load, trackPageview } from "fathom-client";

export default function FathomAnalytics({ siteID }: { siteID: string }) {
  const { pathname, search } = useLocation();

  useEffect(() => {
    load(siteID, { auto: false });
  }, []);

  useEffect(() => {
    trackPageview({
      url: pathname + search,
      referrer: document.referrer,
    });
  }, [pathname, search]);

  return null;
}
