import { Navigate, useParams } from "react-router-dom";
import { useCpuInfo, formatUptime } from "../features/CPU/useCpuInfo";
import CpuStatRow from "../features/CPU/StatRow";
import RadialGauge from "../shared/ui/RadialGauge";
import style from "./styles/CpuDetailsPage.module.css";

export default function CpuDetailsPage() {
	const { id } = useParams<{ id?: string }>();
	const n = Number(id);
	if (!id || !Number.isInteger(n) || n <= 0) return <Navigate to="/not-found" replace />;

	const { data, loading, error } = useCpuInfo(n);

	return (
		<section className={style.wrapper}>
			<h2 className={style.title}>CPU — Detalle de PC {n}</h2>

			{loading && <p className={style.centerDim}>Cargando…</p>}
			{error && <p className={style.centerErr}>Error al cargar datos</p>}

			{!loading && data && (
				<div className={style.cards}>
					<article className={style.card}>
						<h3 className={style.cardTitle}>Estado</h3>
						<dl className={style.dl}>
							<CpuStatRow label="Uso" value={`${data.usagePct}%`} />
							<CpuStatRow label="Cores" value={String(data.cores)} />
							<CpuStatRow label="Tiempo" value={formatUptime(data.uptimeSec)} />
						</dl>
						<div className={style.gaugeBox}>
							<RadialGauge value={data.usagePct} unit="%" label="Uso CPU" />
						</div>
					</article>
				</div>
			)}
		</section>
	);
}
