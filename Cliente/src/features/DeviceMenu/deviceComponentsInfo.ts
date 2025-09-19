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

export type SystemData = {
	name: string;
	uptime: string;
	cpuTemp: number;
  };

export type DeviceComponentData =
	| { type: "memory"; data: MemoryData }
	| { type: "cpu"; data: CpuData }
	| { type: "system"; data: SystemData }
	// TODO: This is a mock
	| { type: "disk"; data: any }
	| { type: "network"; data: any };

export async function fetchDeviceComponent(
	id: number,
	type: DeviceComponentType,
): Promise<DeviceComponentData> {
	if (type === "memory") {
		const res = await fetch(`http://127.0.0.1:8000/snmp/memorypreview/${id}`);
		if (!res.ok) {
			throw new Error(`Error ${res.status}: no se pudo obtener la memoria de PC ${id}`);
		}
		const json = await res.json();

		const sizeGB = (json.total_kb / (1024 * 1024)).toFixed(1) + " GB";
		const usedGB = (json.used_kb / (1024 * 1024)).toFixed(1) + " GB";

		return {
			type: "memory",
			data: {
				size: sizeGB,
				used: usedGB,
				percent: Math.round(json.used_pct),
			},
		};
	}

	if (type === "cpu") {
		const res = await fetch(`http://127.0.0.1:8000/snmp/cpu/${id}`);
		if (!res.ok) {
			throw new Error(`Error ${res.status}: no se pudo obtener la CPU de PC ${id}`);
		}
		const json = await res.json();

		return {
			type: "cpu",
			data: {
				cores: Number(json.cpu_cores) || 0,
				usagePerCore: json.cpu_usage_per_core ?? [],
				usageAvg: Number(json.cpu_usage_avg) || 0,
				globalUsage: Number(json.cpu_global_usage_percent) || 0,
				idlePercent: Number(json.cpu_idle_percent) || 0,
				uptimeTicks: json.uptime_ticks ?? "0",
			},
		};
	}

	if (type === "system") {
		const res = await fetch(`http://127.0.0.1:8000/snmp/system/${id}`);
		if (!res.ok) {
			throw new Error(`Error ${res.status}: no se pudo obtener el sistema de PC ${id}`);
		}
		const json = await res.json();
	
		return {
			type: "system",
			data: {
				name: json.device_name ?? "Desconocido",
				uptime: json.operation_uptime ?? "0",
				cpuTemp: json.temperatureC ?? 0,
	        }
	    };
	}

	//TODO: This is a mock
	if (type === "disk") {
		return { type, data: { size: "1 TB", used: "40%", write: "200 MB/s", read: "150 MB/s" } };
	}

	if (type === "network") {
		return { type, data: { iface: "eth0", linkSpeedMbps: 1000, upMbps: 20, downMbps: 80 } };
	}

	throw new Error("Tipo no soportado: " + type);
}
