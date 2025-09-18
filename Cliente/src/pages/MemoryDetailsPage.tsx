import { useParams, Navigate } from "react-router-dom";
import { useMemorySeries, formatBytes } from "../features/Memory/useMemorySeries";
import StatRow from "../features/Memory/StatRow";
import BarGauge from "../shared/ui/BarGauge";
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
				<div className={style.cards}>
					<article className={style.card}>
						<h3 className={style.cardTitle}>Resumen RAM</h3>
						<dl style={{ margin: 0, display: "grid", gap: 8 }}>
							<StatRow label="Total" value={formatBytes(data.totalBytes)} />
							<StatRow label="Usada" value={`${formatBytes(data.usedBytes)} (${pct.ram}%)`} />
							<StatRow label="Disponible" value={formatBytes(data.availBytes)} />
							<StatRow label="Buffers" value={formatBytes(data.buffersBytes)} />
							<StatRow label="Caché" value={formatBytes(data.cachedBytes)} />
						</dl>
						<BarGauge
							value={pct.ram}
							max={100}
							unit="%"
							label="Uso RAM"
							warnAt={70}
							dangerAt={90}
						/>
					</article>

					<article className={style.card}>
						<h3 className={style.cardTitle}>Swap</h3>
						<dl style={{ margin: 0, display: "grid", gap: 8 }}>
							<StatRow label="Total" value={formatBytes(data.swapTotalBytes)} />
							<StatRow label="Usada" value={`${formatBytes(data.swapUsedBytes)} (${pct.swap}%)`} />
						</dl>
						<BarGauge
							value={pct.swap}
							max={100}
							unit="%"
							label="Uso Swap"
							warnAt={40}
							dangerAt={80}
						/>
					</article>
				</div>
			)}
		</section>
	);
}
