type Props = {
	value: number;
	size?: number;
	strokeWidth?: number;
	label?: string;
	unit?: string;
};

export default function RadialGauge({
	value,
	size = 120,
	strokeWidth = 10,
	label,
	unit = "%",
}: Props) {
	const v = Math.max(0, Math.min(100, Math.round(value)));
	const r = (size - strokeWidth) / 2;
	const c = Math.PI * 2 * r;
	const dash = (v / 100) * c;
	const dashEmpty = c - dash;

	return (
		<div style={{ display: "grid", placeItems: "center" }}>
			<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
				<g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={r}
						stroke="rgba(0,0,0,.12)"
						strokeWidth={strokeWidth}
						fill="none"
					/>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={r}
						stroke="currentColor"
						strokeWidth={strokeWidth}
						fill="none"
						strokeDasharray={`${dash} ${dashEmpty}`}
						strokeLinecap="round"
					/>
				</g>
				<text
					x="50%"
					y="50%"
					dominantBaseline="central"
					textAnchor="middle"
					fontSize={size * 0.28}
					fontWeight={800}
					fill="currentColor"
				>
					{v}
					{unit}
				</text>
			</svg>
			{label ? <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>{label}</div> : null}
		</div>
	);
}
