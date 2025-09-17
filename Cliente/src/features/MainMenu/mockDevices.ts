export type Device = {
	id: number;
	name?: string;
	os?: string;
	cpu?: string;
	memory?: string;
};

const DB: Record<number, Device> = {
	1: {
		id: 1,
		name: "AN-515-52STMP1",
		os: "Ubuntu server LTS 24.03",
		cpu: "Intel Core i7 8750H",
		memory: "8 GB",
	},
	2: {
		id: 2,
		name: "PC-LAB-02",
		os: "Windows 11 Pro",
		cpu: "Intel Core i5 11400",
		memory: "16 GB",
	},
	3: { id: 3, name: "SRV-NOC-03", os: "Debian 12", cpu: "AMD Ryzen 5 5600X", memory: "32 GB" },
	4: { id: 4, name: "EDGE-04", os: "Kali Linux", cpu: "Intel Core i3 10100", memory: "8 GB" },
	5: {
		id: 5,
		name: "WORKSTATION-05",
		os: "Windows 10 Pro",
		cpu: "AMD Ryzen 7 3700X",
		memory: "64 GB",
	},
	6: {
		id: 6,
		name: "TEST-PC-06",
		os: "Android-x86_64 13",
		cpu: "Intel Core i9 12900K",
		memory: "32 GB",
	},
	7: { id: 7, name: "DEV-MACHINE-07", os: "Fedora 38", cpu: "AMD Ryzen 9 5900X", memory: "128 GB" },
	8: {
		id: 8,
		name: "MEDIA-PC-08",
		os: "Windows 11 Home",
		cpu: "Intel Core i7 11700",
		memory: "16 GB",
	},
	9: { id: 9, name: "GAMING-RIG-09", os: "Arch Linux", cpu: "AMD Ryzen 7 5800X", memory: "32 GB" },
	10: {
		id: 10,
		name: "OFFICE-PC-10",
		os: "Linux Mint 21.1",
		cpu: "Intel Core i5 10400",
		memory: "8 GB",
	},
	11: {
		id: 11,
		name: "Macbook pro de Gabriel",
		os: "Mac Os Ventura 13.4",
		cpu: "M4 10-core Apple Silicon",
		memory: "16 GB",
	},
	12: { id: 12, name: "iMac de Ana" },
};

export async function fetchDeviceById(id: number): Promise<Device> {
	await new Promise((r) => setTimeout(r, 300));
	const d = DB[id];
	if (!d) throw new Error("Not found");
	return d;
}
