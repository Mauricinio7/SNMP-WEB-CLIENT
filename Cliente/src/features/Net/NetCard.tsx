import { useEffect, useState } from "react";
import style from "./NetComponentCard.module.css";
import { fetchNetById, type Net } from "./netComponentsInfo";

type Props = { id: number };

export default function NetCard({ id }: Props) {
	const [data, setData] = useState<Net | null>(null);
	const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

	useEffect(() => {
		let alive = true;
		setStatus("loading");
		fetchNetById(id)
			.then((d) => {
				if (alive) {
					setData(d);
					setStatus("ready");
				}
			})
			.catch(() => {
				if (alive) setStatus("error");
			});
		return () => {
			alive = false;
		};
	}, [id]);

	if (!data && status !== "ready") return <p>Cargando…</p>;

	return (
		<div className={style.card} aria-label={`Detalles de Red de PC ${id}`}>
			<div className={style.header}>Red PC {id}:</div>

			{status === "error" ? (
				<p style={{ color: "#b91c1c", fontWeight: 600, margin: 0 }}>
					No fue posible cargar los datos.
				</p>
			) : (
				<dl className={style.meta}>
					<div className={style.row}>
						<dt>Paquetes recibidos:</dt>
						<dd>{data?.recievedPackets.join(", ")}</dd>
					</div>
					<div className={style.row}>
						<dt>Paquetes enviados:</dt>
						<dd>{data?.sentPackets.join(", ")}</dd>
					</div>
					<div className={style.row}>
						<dt>Retransm. mínima:</dt>
						<dd>{data?.minimumRetransmissionsTime}</dd>
					</div>
					<div className={style.row}>
						<dt>Retransm. máxima:</dt>
						<dd>{data?.maximumRetransmissionsTime}</dd>
					</div>
					<div className={style.row}>
						<dt>Conexiones TCP máx.:</dt>
						<dd>{data?.maximumTcpConnections}</dd>
					</div>
					<div className={style.row}>
						<dt>Conexiones TCP hechas:</dt>
						<dd>{data?.tcpConnectionsMade}</dd>
					</div>
					<div className={style.row}>
						<dt>Conexiones TCP activas:</dt>
						<dd>{data?.activeTcpConnections}</dd>
					</div>
					<div className={style.row}>
						<dt>Paquetes UDP recibidos:</dt>
						<dd>{data?.udpPacketsReceived.join(", ")}</dd>
					</div>
					<div className={style.row}>
						<dt>Errores UDP recibidos:</dt>
						<dd>{data?.udpReceiveErrors.join(", ")}</dd>
					</div>
				</dl>
			)}
		</div>
	);
}
