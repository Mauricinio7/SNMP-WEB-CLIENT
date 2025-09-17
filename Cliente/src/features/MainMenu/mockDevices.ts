export type Device = {
	id: number;
	name?: string;
	os?: string;
	cpu?: string;
	memory?: string;
};

// Aquí hacemos la llamada real al backend
export async function fetchDeviceById(id: number): Promise<Device> {
	const res = await fetch(`http://127.0.0.1:8000/snmp/general/${id}`);
	if (!res.ok) {
		throw new Error(`Error ${res.status}: no se pudo obtener el dispositivo ${id}`);
	}
	const json = await res.json();

	// Adaptamos el JSON del backend a nuestro modelo Device
	// (esto depende de lo que devuelva tu API, aquí uso el ejemplo de tu screenshot)
	const device: Device = {
		id,
		name: json.device_name,
		os: json.os_description,
		memory: json.ram_size ? `${Math.round(json.ram_size / 1024)} MB` : undefined,
	};

	return device;
}
