export type Disk = {
	id: number;
	partitions: {
		address: string; 
		device: string;  
		error: string;   
	}[];
};

export async function fetchDiskById(id: number): Promise<Disk> {
	const res = await fetch(`http://127.0.0.1:8000/snmp/disk/data/${id}`);
	if (!res.ok) {
		throw new Error(
			`Error ${res.status}: no se pudo obtener la información de disco de la PC ${id}`
		);
	}
	const json = await res.json();
	console.log("Respuesta SNMP Disco JSON:", json);

	const partitions = (json.disk_partitions_address || []).map(
		(address: string, idx: number) => ({
			address,
			device: json.disk_partitions_devices?.[idx] ?? "Desconocido",
			error: json.disk_partitions_errors?.[idx] ?? "Desconocido",
		})
	);

	const disk: Disk = {
		id,
		partitions,
	};

	console.log("Objeto Disk procesado:", disk);
	return disk;
}
