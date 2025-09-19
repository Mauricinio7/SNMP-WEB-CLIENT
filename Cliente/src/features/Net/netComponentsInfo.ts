export type Net = {
	id: number;
	interfaces: {
		ipAddress: string;
		subnetMask: string;
		webType: string;
		forwarding: string;
		tcpProtocol: string;
	}[];
};

export async function fetchNetworkById(id: number): Promise<Net> {
	const res = await fetch(`http://127.0.0.1:8000/snmp/network/data/${id}`);
	if (!res.ok) {
		throw new Error(`Error ${res.status}: no se pudo obtener la información de red de la PC ${id}`);
	}
	const json = await res.json();

	const interfaces = (json.ip_address || []).map((_: string, idx: number) => ({
		ipAddress: json.ip_address?.[idx] || "Desconocido",
		subnetMask: json.subnet_mask?.[idx] || "Desconocido",
		webType: json.web_type?.[idx] || "Desconocido",
		forwarding: json.forwarding?.[idx] || "Desconocido",
		tcpProtocol: json.tcp_protocol || "Desconocido",
	}));

	const network: Net = {
		id,
		interfaces,
	};

	return network;
}
