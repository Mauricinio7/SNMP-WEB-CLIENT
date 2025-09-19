export type DeviceComponentType = "cpu" | "memory" | "disk" | "system" | "network";

export type MemoryData = { size: string; used: string; percent: number };

export type CpuData = {
	cores: number;
	usagePerCore: number[];
	usageAvg: number;
	globalUsage: number;
	idlePercent: number;
	uptimeTicks: string;
};

export type DiskPreviewData = {
	partitions: number[];
	sizeKB: number[];
	usedKB: number[];
	freeKB: number[];
	totalKB: number;
	usedTotalKB: number;
	usedPct: number;
};

export type SystemData = {
	name: string;
	os?: string;
	uptime?: string;
	cpuTemp?: number;
};

export type NetworkPreviewData = {
	ipList: string[];
	maskList: string[];
	forwarding: boolean;
	tcpEnabled: boolean;
	ifTypes: number[];
};

export type DeviceComponentData =
	| { type: "memory"; data: MemoryData }
	| { type: "cpu"; data: CpuData }
	| { type: "disk"; data: DiskPreviewData }
	| { type: "system"; data: SystemData }
	| { type: "network"; data: NetworkPreviewData };

const API = "http://127.0.0.1:8000";

const toNums = (arr: string[]) => arr.map((x) => Number(x) || 0);
const sum = (a: number[]) => a.reduce((p, c) => p + c, 0);

function formatUptimeFromTicks(ticks?: string | number): string | undefined {
	const n = Number(ticks);
	if (!Number.isFinite(n) || n < 0) return undefined;
	const seconds = Math.floor(n / 100);
	const d = Math.floor(seconds / 86400);
	const h = Math.floor((seconds % 86400) / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = seconds % 60;
	if (d > 0) return `${d}d ${h}h ${m}m ${s}s`;
	if (h > 0) return `${h}h ${m}m ${s}s`;
	if (m > 0) return `${m}m ${s}s`;
	return `${s}s`;
}

function octetsToIPv4(s: string): string {
	const bytes = Array.from(s, (ch) => ch.charCodeAt(0)).filter((n) => n >= 0 && n <= 255);
	if (bytes.length === 4) return bytes.join(".");

	return s;
}

export async function fetchDeviceComponent(
	id: number,
	type: DeviceComponentType,
): Promise<DeviceComponentData> {
	if (type === "memory") {
		const res = await fetch(`${API}/snmp/memorypreview/${id}`);
		if (!res.ok) throw new Error(`Error ${res.status}: no se pudo obtener memoria de PC ${id}`);
		const j = await res.json();
		const sizeGB = (j.total_kb / (1024 * 1024)).toFixed(1) + " GB";
		const usedGB = (j.used_kb / (1024 * 1024)).toFixed(1) + " GB";
		return {
			type: "memory",
			data: { size: sizeGB, used: usedGB, percent: Math.round(j.used_pct) },
		};
	}

	if (type === "cpu") {
		const res = await fetch(`${API}/snmp/cpu/${id}`);
		if (!res.ok) throw new Error(`Error ${res.status}: no se pudo obtener CPU de PC ${id}`);
		const j = await res.json();
		return {
			type: "cpu",
			data: {
				cores: Number(j.cpu_cores) || 0,
				usagePerCore: j.cpu_usage_per_core ?? [],
				usageAvg: Number(j.cpu_usage_avg) || 0,
				globalUsage: Number(j.cpu_global_usage_percent) || 0,
				idlePercent: Number(j.cpu_idle_percent) || 0,
				uptimeTicks: j.uptime_ticks ?? "0",
			},
		};
	}

	if (type === "disk") {
		const res = await fetch(`${API}/snmp/disk/preview/${id}`);
		if (!res.ok) throw new Error(`Error ${res.status}: no se pudo obtener disco de PC ${id}`);
		const j = (await res.json()) as {
			disk_partitions: string[];
			disk_partitions_size: string[];
			disk_partitions_used: string[];
			disk_partitions_free: string[];
		};
		const partitions = toNums(j.disk_partitions);
		const sizeKB = toNums(j.disk_partitions_size);
		const usedKB = toNums(j.disk_partitions_used);
		const freeKB = toNums(j.disk_partitions_free);
		const totalKB = sum(sizeKB);
		const usedTotalKB = sum(usedKB);
		const usedPct = totalKB ? Math.round((usedTotalKB / totalKB) * 100) : 0;
		return {
			type: "disk",
			data: { partitions, sizeKB, usedKB, freeKB, totalKB, usedTotalKB, usedPct },
		};
	}

	if (type === "system") {
		const generalRes = await fetch(`${API}/snmp/general/${id}`);
		if (!generalRes.ok) throw new Error(`Error ${generalRes.status}: general de PC ${id}`);
		const general = await generalRes.json();
		let uptime: string | undefined;
		let cpuTemp: number | undefined;

		try {
			const sysRes = await fetch(`${API}/snmp/system/${id}`);
			if (sysRes.ok) {
				const sys = await sysRes.json();

				const normTemp = (v: unknown): number | undefined => {
					const n = Number(v);
					if (!Number.isFinite(n)) return undefined;

					if (n > 1000) return Math.round(n / 1000);
					if (n > 200) return Math.round(n / 10);
					return Math.round(n);
				};
				cpuTemp = normTemp(sys.temperature);
			}
		} catch {}

		if (!uptime) {
			try {
				const cpuRes = await fetch(`${API}/snmp/cpu/${id}`);
				if (cpuRes.ok) {
					const cpuJ = await cpuRes.json();
					uptime = formatUptimeFromTicks(cpuJ.uptime_ticks);
				}
			} catch {}
		}

		const data: SystemData = {
			name: String(general.device_name ?? "Desconocido"),
			os: general.os_description,
			uptime,
			cpuTemp,
		};
		return { type: "system", data };
	}

	if (type === "network") {
		const res = await fetch(`${API}/snmp/network/preview/${id}`);
		if (!res.ok) throw new Error(`Error ${res.status}: no se pudo obtener red de PC ${id}`);
		const j = (await res.json()) as {
			web_type: string[];
			ip_address: string[];
			subnet_mask: string[];
			forwarding?: string[];
			tcp_protocol?: string;
		};

		const ipList = (j.ip_address ?? []).map(octetsToIPv4);
		const maskList = (j.subnet_mask ?? []).map(octetsToIPv4);
		const ifTypes = (j.web_type ?? []).map((x) => Number(x) || 0);

		const forwarding = Array.isArray(j.forwarding)
			? j.forwarding.some((x) => String(x) === "1")
			: String(j.forwarding ?? "") === "1";

		const tcpEnabled = String(j.tcp_protocol ?? "") === "1";

		return {
			type: "network",
			data: { ipList, maskList, forwarding, tcpEnabled, ifTypes },
		};
	}

	throw new Error("Tipo no soportado: " + type);
}
