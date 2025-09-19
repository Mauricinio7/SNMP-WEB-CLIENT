export type Disk = {
	id: number;
	partitions: {
		name: string;
		size: string;
		used: string;
		free: string;
	}[];
};

export async function fetchDiskById(id: number): Promise<Disk> {
	const res = await fetch(`http://127.0.0.1:8000/snmp/disk_preview/${id}`);
	if (!res.ok) {
		throw new Error(`Error ${res.status}: no se pudo obtener la información de disco de la PC ${id}`);
	}
	const json = await res.json();

	const partitions = (json.disk_partitions || []).map((part: string, idx: number) => ({
		name: part,
		size: ((json.disk_partitions_size?.[idx] || 0) / (1024 * 1024)).toFixed(1) + " GB",
		used: ((json.disk_partitions_used?.[idx] || 0) / (1024 * 1024)).toFixed(1) + " GB",
		free: ((json.disk_partitions_free?.[idx] || 0) / (1024 * 1024)).toFixed(1) + " GB",
	}));

	const disk: Disk = {
		id,
		partitions,
	};

	return disk;
}
