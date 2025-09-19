export type Net = {
	id: number;
	recievedPackets: string[];
	headerErroredPackets: string[];
	addressErroredPackets: string[];
	sentPackets: string[];
	minimumRetransmissionsTime: string;
	maximumRetransmissionsTime: string;
	maximumTcpConnections: string;
	tcpConnectionsMade: string;
	activeTcpConnections: string;
	udpPacketsReceived: string[];
	udpReceiveErrors: string[];
};

export async function fetchNetById(id: number): Promise<Net> {
	const res = await fetch(`http://127.0.0.1:8000/snmp/network/data/${id}`);
	if (!res.ok) {
		throw new Error(
			`Error ${res.status}: no se pudo obtener la información de red de la PC ${id}`
		);
	}
	const json = await res.json();
	console.log("Respuesta SNMP JSON:", json);

	const network: Net = {
		id,
		recievedPackets: json.recieved_packets ?? [],
		headerErroredPackets: json.header_errored_packets ?? [],
		addressErroredPackets: json.address_errored_packets ?? [],
		sentPackets: json.sent_packets ?? [],
		minimumRetransmissionsTime: json.minimun_retransmissions_time ?? "Desconocido",
		maximumRetransmissionsTime: json.maximum_retransmissions_time ?? "Desconocido",
		maximumTcpConnections: json.maximun_tcp_connections ?? "Desconocido",
		tcpConnectionsMade: json.tcp_conections_made ?? "Desconocido",
		activeTcpConnections: json.active_tcp_connections ?? "Desconocido",
		udpPacketsReceived: json.udp_packets_received ?? [],
		udpReceiveErrors: json.udp_receive_errors ?? [],
	};

	return network;
}
