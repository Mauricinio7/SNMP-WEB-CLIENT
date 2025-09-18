// SystemDetailsPage.tsx
import { useParams, Navigate } from "react-router-dom";
import { useSystemInfo, formatUptime } from "../features/System/useSystemInfo";
import StatRow from "../features/Memory/StatRow";
import style from "./styles/SystemDetailsPage.module.css";

export default function SystemDetailsPage() {
  const { id } = useParams<{ id?: string }>();
  const n = Number(id);
  if (!id || !Number.isInteger(n) || n <= 0) return <Navigate to="/not-found" replace />;

  const { data, loading, error } = useSystemInfo(n);

  return (
    <section className={style.wrapper}>
      <h2 className={style.title}>Sistema — Detalle de PC {n}</h2>

      {loading && <p style={{ textAlign: "center", opacity: 0.7 }}>Cargando…</p>}
      {error && <p style={{ textAlign: "center", color: "#b91c1c" }}>Error al cargar datos</p>}
      {!loading && data && (
        <div className={style.cards}>
          <article className={style.card}>
            <h3 className={style.cardTitle}>Información del Sistema</h3>
				<dl style={{ margin: 0, display: "grid", gap: 8 }}>
				<StatRow label="Hostname" value={data.hostname} />
				<StatRow label="Descripción" value={data.description} />
				<StatRow label="Uptime" value={formatUptime(data.uptimeSeconds)} />
				<StatRow label="Contacto" value={data.contact ?? "-"} />
				<StatRow label="Ubicación" value={data.location ?? "-"} />
				<StatRow label="Temperatura CPU" value={data.temperatureC ? `${data.temperatureC} °C` : "-"} />
				</dl>
          </article>
        </div>
      )}
    </section>
  );
}