export type MemorySnapshot = {
	ts: number;
	totalBytes: number;
	usedBytes: number;
	availBytes: number;
	buffersBytes?: number;
	cachedBytes?: number;
	swapTotalBytes?: number;
	swapUsedBytes?: number;
};

const API_BASE = "http://127.0.0.1:8000";

function kbToBytes(kb?: number | null) {
	return typeof kb === "number" ? Math.max(0, Math.round(kb * 1024)) : undefined;
}

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

export async function fetchMemorySnapshot(pcId: number): Promise<MemorySnapshot> {
	type Api = {
		total_kb: number;
		used_kb: number;
		used_pct: number;
		avail_kb: number;
		buffers_kb?: number | null;
		cached_kb?: number | null;
		swap_total_kb?: number | null;
		swap_used_kb?: number | null;
		swap_used_pct?: number | null;
	};

	const payload = await fetchJson<Api>(`${API_BASE}/snmp/memory/${pcId}`);

	const totalBytes = kbToBytes(payload.total_kb)!;
	const usedBytes = kbToBytes(payload.used_kb)!;
	const availBytes = kbToBytes(payload.avail_kb)!;

	const out: MemorySnapshot = {
		ts: Date.now(),
		totalBytes,
		usedBytes,
		availBytes,
	};

	const bBuf = kbToBytes(payload.buffers_kb ?? undefined);
	const bCac = kbToBytes(payload.cached_kb ?? undefined);
	if (typeof bBuf === "number") out.buffersBytes = bBuf;
	if (typeof bCac === "number") out.cachedBytes = bCac;

	const bSwapTotal = kbToBytes(payload.swap_total_kb ?? undefined);
	const bSwapUsed = kbToBytes(payload.swap_used_kb ?? undefined);
	if (typeof bSwapTotal === "number") out.swapTotalBytes = bSwapTotal;
	if (typeof bSwapUsed === "number") out.swapUsedBytes = bSwapUsed;

	return out;
}
