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
    operation_system: string;
    operation_uptime: string;
    contact?: string | null;
    device_name: string;
    location?: string | null;
    temperature?: string | null; 
  };

  const payload = await fetchJson<Api>(`${API_BASE}/snmp/system/${pcId}`);

  const out: SystemSnapshot = {
    ts: Date.now(),
    hostname: payload.device_name,
    description: payload.operation_system,
    uptimeSeconds: parseInt(payload.operation_uptime, 10), 
    temperatureC: payload.temperature ? parseFloat(payload.temperature) : undefined,
  };

  if (payload.contact) out.contact = payload.contact;
  if (payload.location) out.location = payload.location;

  return out;
}