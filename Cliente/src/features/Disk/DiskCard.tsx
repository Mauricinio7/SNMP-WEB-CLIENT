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

	const model = status === "ready" ? data?.model ?? "Desconocido" : "Cargando …";
	const size = status === "ready" ? data?.size ?? "Desconocido" : "Cargando …";

	return (
		<div className={style.card} aria-label={`Detalles del Disco ${id}`}>
			<div className={style.header}>Disco {id}:</div>

			{status === "error" ? (
				<p style={{ color: "#b91c1c", fontWeight: 600, margin: 0 }}>
					No fue posible cargar los datos.
				</p>
			) : (
				<dl className={style.meta}>
					<div className={style.row}>
						<dt>Modelo:</dt>
						<dd>{model}</dd>
					</div>
					<div className={style.row}>
						<dt>Tamaño:</dt>
						<dd>{size}</dd>
					</div>
				</dl>
			)}
		</div>
	);
}
