export type DeviceComponentType = "cpu" | "memory" | "disk" | "system";

export type CpuData = { model: string; usage: number; cores: string; uptime: string };
export type MemoryData = { size: string; used: string; percent: number };
export type DiskData = { size: string; used: string; write: string; read: string };
export type SystemData = { name: string; uptime: string; cpuTemp: string; gpuTemp: string };

export type DeviceComponentData =
	| { type: "cpu"; data: CpuData }
	| { type: "memory"; data: MemoryData }
	| { type: "disk"; data: DiskData }
	| { type: "system"; data: SystemData };

function fakeDb(id: number, type: DeviceComponentType): DeviceComponentData {
	switch (type) {
		case "cpu":
			return {
				type,
				data: {
					model: id === 1 ? "Intel Core i7 8750H" : "AMD Ryzen 5 5600X",
					usage: id === 1 ? 10 : 23,
					cores: id === 1 ? "6, 12 hilos" : "6, 12 hilos",
					uptime: id === 1 ? "12 horas" : "8 horas",
				},
			};
		case "memory":
			return {
				type,
				data: {
					size: id === 1 ? "8 GB" : "16 GB",
					used: id === 1 ? "4 GB" : "8 GB",
					percent: id === 1 ? 50 : 50,
				},
			};
		case "disk":
			return {
				type,
				data: {
					size: id === 1 ? "2 TB" : "1 TB",
					used: "50%",
					write: "500 mb/s",
					read: "0 mb/s",
				},
			};
		case "system":
			return {
				type,
				data: {
					name: id === 1 ? "AN-515-52STMP1" : "SRV-NOC-03",
					uptime: id === 1 ? "15 horas" : "3 días",
					cpuTemp: "50°",
					gpuTemp: "47°",
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
