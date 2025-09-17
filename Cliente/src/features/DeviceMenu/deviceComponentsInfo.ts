export type DeviceComponentType = "cpu" | "memory" | "disk" | "system" | "network";

export type MemoryData = { size: string; used: string; percent: number };

export type DeviceComponentData =
	| { type: "memory"; data: MemoryData }
	// TODO: This is a mock
	| { type: "cpu"; data: any }
	| { type: "disk"; data: any }
	| { type: "system"; data: any }
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

	//TODO: This is a mock
	if (type === "cpu") {
		return { type, data: { model: "Intel Core i7", usage: 10, cores: "6", uptime: "5h" } };
	}
	if (type === "disk") {
		return { type, data: { size: "1 TB", used: "40%", write: "200 MB/s", read: "150 MB/s" } };
	}
	if (type === "system") {
		return { type, data: { name: "Server", uptime: "12h", cpuTemp: "45°", gpuTemp: "42°" } };
	}
	if (type === "network") {
		return { type, data: { iface: "eth0", linkSpeedMbps: 1000, upMbps: 20, downMbps: 80 } };
	}

	throw new Error("Tipo no soportado: " + type);
}
