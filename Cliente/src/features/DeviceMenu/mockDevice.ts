export type DeviceComponentType = "cpu" | "memory" | "disk" | "system" | "network";

export type CpuData = { model: string; usage: number; cores: string; uptime: string };
export type MemoryData = { size: string; used: string; percent: number };
export type DiskData = { size: string; used: string; write: string; read: string };
export type SystemData = { name: string; uptime: string; cpuTemp: string; gpuTemp: string };
export type NetworkData = {
	iface: string;
	linkSpeedMbps: number;
	upMbps: number;
	downMbps: number;
};

export type DeviceComponentData =
	| { type: "cpu"; data: CpuData }
	| { type: "memory"; data: MemoryData }
	| { type: "disk"; data: DiskData }
	| { type: "system"; data: SystemData }
	| { type: "network"; data: NetworkData };

function fakeDb(id: number, type: DeviceComponentType): DeviceComponentData {
	switch (type) {
		case "cpu":
			return {
				type,
				data: { model: "Intel Core i7 8750H", usage: 12, cores: "6, 12 hilos", uptime: "12 h" },
			};
		case "memory":
			return { type, data: { size: "8 GB", used: "4 GB", percent: 50 } };
		case "disk":
			return { type, data: { size: "2 TB", used: "50%", write: "500 mb/s", read: "0 mb/s" } };
		case "system":
			return {
				type,
				data: { name: "AN-515-52STMP1", uptime: "15 h", cpuTemp: "50°", gpuTemp: "47°" },
			};
		case "network":
			return {
				type,
				data: {
					iface: id % 2 ? "eth0" : "ens33",
					linkSpeedMbps: 1000,
					upMbps: Math.round(10 + Math.random() * 90),
					downMbps: Math.round(50 + Math.random() * 200),
				},
			};
	}
}

export async function fetchDeviceComponent(
	id: number,
	type: DeviceComponentType,
): Promise<DeviceComponentData> {
	await new Promise((r) => setTimeout(r, 300));
	return fakeDb(id, type);
}
