export default function StatRow({ label, value }: { label: string; value: string }) {
	return (
		<div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 8 }}>
			<dt style={{ opacity: 0.8 }}>{label}:</dt>
			<dd style={{ margin: 0, fontWeight: 600 }}>{value}</dd>
		</div>
	);
}
