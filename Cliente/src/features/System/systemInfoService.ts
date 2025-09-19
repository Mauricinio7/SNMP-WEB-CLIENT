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

function ticksToSeconds(ticks?: unknown): number | undefined {
	const n = Number(ticks);
	if (!Number.isFinite(n) || n < 0) return undefined;
	return Math.floor(n / 100);
}

export async function fetchSystemSnapshot(pcId: number): Promise<SystemSnapshot> {
	type SysApi = {
		operation_system: string;
		operation_uptime?: string;
		contact?: string | null;
		device_name: string;
		location?: string | null;
		temperature?: string | null;
	};

	type CpuApi = {
		uptime_ticks?: string | number;
		cpu_temp_c?: string | number;
		cpu_temp?: string | number;
	};

	const [sysRes, cpuRes] = await Promise.allSettled([
		fetchJson<SysApi>(`${API_BASE}/snmp/system/${pcId}`),
		fetchJson<CpuApi>(`${API_BASE}/snmp/cpu/${pcId}`),
	]);

	if (sysRes.status !== "fulfilled") {
		throw new Error("No se pudo leer /snmp/system");
	}

	const sys = sysRes.value;
	const cpu = cpuRes.status === "fulfilled" ? cpuRes.value : undefined;

	const uptimeFromTicks = ticksToSeconds(cpu?.uptime_ticks);
	const uptimeFromSys = Number.parseInt(sys.operation_uptime ?? "", 10);
	const uptimeSeconds =
		uptimeFromTicks ?? (Number.isFinite(uptimeFromSys) && uptimeFromSys >= 0 ? uptimeFromSys : 0);

	const tempNumRaw = (cpu?.cpu_temp_c ?? cpu?.cpu_temp ?? sys.temperature) as
		| string
		| number
		| undefined;
	const tempParsed = tempNumRaw !== undefined ? Number(tempNumRaw) : NaN;
	const temperatureC = Number.isFinite(tempParsed) ? tempParsed : undefined;

	const out: SystemSnapshot = {
		ts: Date.now(),
		hostname: String(sys.device_name ?? "Desconocido"),
		description: String(sys.operation_system ?? "-"),
		uptimeSeconds,
	};

	if (sys.contact) out.contact = sys.contact;
	if (sys.location) out.location = sys.location;
	if (temperatureC !== undefined) out.temperatureC = temperatureC;

	return out;
}
