import { Navigate, useParams } from "react-router-dom";
import { useCpuInfo } from "../features/CPU/useCpuInfo";
import CpuStatRow from "../features/CPU/StatRow";
import RadialGauge from "../shared/ui/RadialGauge";
import style from "./styles/CpuDetailsPage.module.css";

export default function CpuDetailsPage() {
	const { id } = useParams<{ id?: string }>();
	const n = Number(id);
	if (!id || !Number.isInteger(n) || n <= 0) return <Navigate to="/not-found" replace />;

	const { data, loading, error, uptimeLabel } = useCpuInfo(n);

	return (
		<section className={style.wrapper}>
			<h2 className={style.title}>CPU — Detalle de PC {n}</h2>

			{loading && <p className={style.centerDim}>Cargando…</p>}
			{error && <p className={style.centerErr}>Error al cargar datos</p>}

			{!loading && (
				<div className={style.cards}>
					<article className={style.card}>
						<h3 className={style.cardTitle}>Estado</h3>
						<dl className={style.dl}>
							<CpuStatRow label="Uso Promedio" value={`${data?.cpu_usage_avg ?? 0}%`} />
							<CpuStatRow label="Uso Global" value={`${data?.cpu_global_usage_percent ?? 0}%`} />
							<CpuStatRow label="Idle" value={`${data?.cpu_idle_percent ?? 0}%`} />
							<CpuStatRow label="Cores" value={String(data?.cpu_cores ?? 0)} />
							<CpuStatRow label="Tiempo" value={uptimeLabel} />
						</dl>

						<div className={style.gaugeBox}>
							<RadialGauge value={data?.cpu_global_usage_percent ?? 0} unit="%" label="Uso CPU" />
						</div>
					</article>

					<article className={style.card}>
						<h3 className={style.cardTitle}>Uso por Core</h3>
						<dl className={style.dl}>
							{(data?.cpu_usage_per_core ?? []).map((val, i) => (
								<CpuStatRow key={i} label={`Core ${i}`} value={`${val}%`} />
							))}
							{(!data?.cpu_usage_per_core || data.cpu_usage_per_core.length === 0) && (
								<CpuStatRow label="Sin datos" value="0%" />
							)}
						</dl>
					</article>
				</div>
			)}
		</section>
	);
}
