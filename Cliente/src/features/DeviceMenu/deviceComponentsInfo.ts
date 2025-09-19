// src/features/DeviceMenu/deviceComponentsInfo.ts
export type DeviceComponentType = "cpu" | "memory" | "disk" | "system" | "network";

export type MemoryData = { size: string; used: string; percent: number };

export type CpuData = {
	cores: number;
	usagePerCore: number[];
	usageAvg: number;
	globalUsage: number;
	idlePercent: number;
	uptimeTicks: string; // viene como string en tu API
};

// Datos reales para el “preview” de disco
export type DiskPreviewData = {
	partitions: number[];
	sizeKB: number[];
	usedKB: number[];
	freeKB: number[];
	totalKB: number;
	usedTotalKB: number;
	usedPct: number;
};

// ✅ Datos reales para “system”
export type SystemData = {
	name: string; // device_name
	os?: string; // os_description (opcional)
	uptime?: string; // uptime ya formateado (opcional si no hay ticks)
	cpuTemp?: number; // temperatura CPU en °C si tu endpoint la expone
};

export type DeviceComponentData =
	| { type: "memory"; data: MemoryData }
	| { type: "cpu"; data: CpuData }
	| { type: "disk"; data: DiskPreviewData }
	| { type: "system"; data: SystemData }
	| { type: "network"; data: any };

const API = "http://127.0.0.1:8000";

// Helpers
const toNums = (arr: string[]) => arr.map((x) => Number(x) || 0);
const sum = (a: number[]) => a.reduce((p, c) => p + c, 0);

// ticks (centésimas de segundo) → “12h 03m 10s”
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

	// ✅ REAL: System sin mock.
	if (type === "system") {
		// 1) /snmp/general/:id -> nombre/os
		const generalRes = await fetch(`${API}/snmp/general/${id}`);
		if (!generalRes.ok) throw new Error(`Error ${generalRes.status}: general de PC ${id}`);
		const general = await generalRes.json(); // { device_name, os_description, ... }

		// 2) /snmp/cpu/:id -> uptime_ticks (+ temp si la expones allí)
		let uptime: string | undefined;
		let cpuTemp: number | undefined;
		try {
			const cpuRes = await fetch(`${API}/snmp/cpu/${id}`);
			if (cpuRes.ok) {
				const cpuJ = await cpuRes.json();
				uptime = formatUptimeFromTicks(cpuJ.uptime_ticks);
				const t = Number(cpuJ.cpu_temp_c ?? cpuJ.cpu_temp ?? NaN);
				if (Number.isFinite(t)) cpuTemp = t;
			}
		} catch {
			// si falla, solo devolvemos lo que haya
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
		// (sigue mock mientras no tengas endpoint real)
		return {
			type: "network",
			data: { iface: "eth0", linkSpeedMbps: 1000, upMbps: 20, downMbps: 80 },
		};
	}

	throw new Error("Tipo no soportado: " + type);
}
