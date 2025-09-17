type Props = {
	value: number;
	max?: number;
	unit?: string;
	label?: string;
	warnAt?: number;
	dangerAt?: number;
	className?: string;
};

export default function BarGauge({
	value,
	max = 120,
	unit,
	label,
	warnAt,
	dangerAt,
	className,
}: Props) {
	const v = Math.max(0, Math.min(max, value));
	const pct = Math.round((v / max) * 100);

	const barColor =
		dangerAt != null && v >= dangerAt
			? "#ef4444"
			: warnAt != null && v >= warnAt
			? "#f59e0b"
			: "currentColor";

	return (
		<div
			className={className}
			aria-label={label}
			role="img"
			aria-valuenow={v}
			aria-valuemin={0}
			aria-valuemax={max}
		>
			{label ? <div style={{ marginBottom: 6, fontWeight: 600 }}>{label}</div> : null}
			<div
				style={{
					width: "100%",
					height: 14,
					borderRadius: 9999,
					background: "rgba(0,0,0,.08)",
					overflow: "hidden",
				}}
			>
				<div
					style={{
						width: `${pct}%`,
						height: "100%",
						background: barColor,
						transition: "width .25s ease",
					}}
				/>
			</div>
			<div style={{ marginTop: 6, fontSize: 12, textAlign: "right", opacity: 0.8 }}>
				{v}
				{unit ?? ""} ({pct}%)
			</div>
		</div>
	);
}
