export type Device = {
	id: number;
	name?: string;
	os?: string;
	cpu?: string;
	memory?: string;
};

export async function fetchDeviceById(id: number): Promise<Device> {
	const res = await fetch(`http://127.0.0.1:8000/snmp/general/${id}`);
	if (!res.ok) {
		throw new Error(`Error ${res.status}: no se pudo obtener el dispositivo ${id}`);
	}
	const json = await res.json();

	const device: Device = {
		id,
		name: json.device_name,
		os: json.os_description,
		memory: json.ram_size ? `${Math.round(json.ram_size / 1024)} MB` : undefined,
	};

	return device;
}
