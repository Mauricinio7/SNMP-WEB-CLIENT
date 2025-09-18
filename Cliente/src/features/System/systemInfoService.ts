export type SystemSnapshot = {
  ts: number;
  hostname: string;
  description: string;
  uptimeSeconds: number;
  contact?: string;
  location?: string;
  temperatureC?: number;
};

const API_BASE = "http://127.0.0.1:8000";

async function fetchJson<T>(url: string, ms = 4000): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(t);
  }
}

export async function fetchSystemSnapshot(pcId: number): Promise<SystemSnapshot> {
  type Api = {
    hostname: string;
    description: string;
    uptime_seconds: number;
    contact?: string | null;
    location?: string | null;
    temperature_c?: number | null;
  };

  const payload = await fetchJson<Api>(`${API_BASE}/snmp/system/${pcId}`);

  const out: SystemSnapshot = {
    ts: Date.now(),
    hostname: payload.hostname,
    description: payload.description,
    uptimeSeconds: payload.uptime_seconds,
  };

  if (payload.contact) out.contact = payload.contact;
  if (payload.location) out.location = payload.location;
  if (typeof payload.temperature_c === "number") out.temperatureC = payload.temperature_c;

  return out;
}