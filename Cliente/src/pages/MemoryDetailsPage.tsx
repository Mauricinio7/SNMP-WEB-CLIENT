import { useParams, Navigate } from "react-router-dom";
import { useMemorySeries, formatBytes } from "../features/Memory/useMemorySeries";
import MemoryChart from "../features/Memory/MemoryChart";
import StatRow from "../features/Memory/StatRow";
import Meter from "../features/Memory/Meter";
import style from "./styles/MemoryDetailsPage.module.css";

export default function MemoryDetailsPage() {
	const { id } = useParams<{ id?: string }>();
	const n = Number(id);
	if (!id || !Number.isInteger(n) || n <= 0) return <Navigate to="/not-found" replace />;

	const { data, loading, error, pct } = useMemorySeries(n);

	return (
		<section className={style.wrapper}>
			<h2 className={style.title}>Memoria — Detalle de PC {n}</h2>

			{loading && <p style={{ textAlign: "center", opacity: 0.7 }}>Cargando…</p>}
			{error && <p style={{ textAlign: "center", color: "#b91c1c" }}>Error al cargar datos</p>}
			{!loading && data && (
				<>
					<div className={style.cards}>
						<article className={style.card}>
							<h3 className={style.cardTitle}>Resumen RAM</h3>
							<dl style={{ margin: 0, display: "grid", gap: 8 }}>
								<StatRow label="Total" value={formatBytes(data.now.totalBytes)} />
								<StatRow label="Usada" value={`${formatBytes(data.now.usedBytes)} (${pct.ram}%)`} />
								<StatRow label="Disponible" value={formatBytes(data.now.availBytes)} />
								<StatRow label="Buffers" value={formatBytes(data.now.buffersBytes)} />
								<StatRow label="Caché" value={formatBytes(data.now.cachedBytes)} />
							</dl>
							<Meter value={pct.ram} />
						</article>

						<article className={style.card}>
							<h3 className={style.cardTitle}>Swap</h3>
							<dl style={{ margin: 0, display: "grid", gap: 8 }}>
								<StatRow label="Total" value={formatBytes(data.now.swapTotalBytes)} />
								<StatRow
									label="Usada"
									value={`${formatBytes(data.now.swapUsedBytes)} (${pct.swap}%)`}
								/>
							</dl>
							<Meter value={pct.swap} low={20} high={80} optimum={10} />
						</article>
					</div>

					<article className={`${style.card} ${style.chartCard}`}>
						<figcaption className={style.caption}>Uso en el tiempo</figcaption>
						<MemoryChart series={data} />
					</article>
				</>
			)}
		</section>
	);
}
