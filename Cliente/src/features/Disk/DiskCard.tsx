import { useEffect, useState } from "react";
import style from "./DiskComponentCard.module.css";
import { fetchDiskById, type Disk } from "./diskComponentsInfo";

type Props = { id: number };

export default function DiskCard({ id }: Props) {
	const [data, setData] = useState<Disk | null>(null);
	const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

	useEffect(() => {
		let alive = true;
		setStatus("loading");
		fetchDiskById(id)
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

	return (
		<div className={style.card} aria-label={`Detalles del Disco ${id}`}>
			<div className={style.header}>Disco {id}:</div>

			{status === "error" ? (
				<p style={{ color: "#b91c1c", fontWeight: 600, margin: 0 }}>
					No fue posible cargar los datos.
				</p>
			) : status === "loading" ? (
				<p>Cargando …</p>
			) : (
				<dl className={style.meta}>
					{data?.partitions.length ? (
						data.partitions.map((p, idx) => (
							<div className={style.row} key={idx}>
								<dt>Partición {idx + 1}:</dt>
								<dd>
									<strong>Dirección:</strong> {p.address || "Desconocido"} <br />
									<strong>Dispositivo:</strong> {p.device || "Desconocido"} <br />
									<strong>Error:</strong> {p.error || "Ninguno"}
								</dd>
							</div>
						))
					) : (
						<p>No se encontraron particiones.</p>
					)}
				</dl>
			)}
		</div>
	);
}
