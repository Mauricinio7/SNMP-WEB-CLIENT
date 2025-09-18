import { useEffect, useState } from "react";
import { fetchSystemSnapshot, type SystemSnapshot } from "./systemInfoService";

export function useSystemInfo(pcId: number) {
  const [data, setData] = useState<SystemSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    fetchSystemSnapshot(pcId)
      .then((d) => {
        if (alive) {
          setData(d);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (alive) {
          setError(e as Error);
          setLoading(false);
        }
      });

    return () => {
      alive = false;
    };
  }, [pcId]);

  return { data, loading, error };
}

export function formatUptime(sec: number) {
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}