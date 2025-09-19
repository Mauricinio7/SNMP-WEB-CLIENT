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

	const ipAddress = status === "ready" ? data?.ipAddress ?? "Desconocido" : "Cargando …";
	const subnetMask = status === "ready" ? data?.subnetMask ?? "Desconocido" : "Cargando …";
	const webType = status === "ready" ? data?.webType ?? "Desconocido" : "Cargando …";
	const forwarding = status === "ready" ? data?.forwarding ?? "Desconocido" : "Cargando …";
	const tcpProtocol = status === "ready" ? data?.tcpProtocol ?? "Desconocido" : "Cargando …";

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
						<dt>IP:</dt>
						<dd>{ipAddress}</dd>
					</div>
					<div className={style.row}>
						<dt>Subred:</dt>
						<dd>{subnetMask}</dd>
					</div>
					<div className={style.row}>
						<dt>Tipo Web:</dt>
						<dd>{webType}</dd>
					</div>
					<div className={style.row}>
						<dt>Forwarding:</dt>
						<dd>{forwarding}</dd>
					</div>
					<div className={style.row}>
						<dt>TCP:</dt>
						<dd>{tcpProtocol}</dd>
					</div>
				</dl>
			)}
		</div>
	);
}
