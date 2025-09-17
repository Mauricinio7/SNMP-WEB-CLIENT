import {
	ResponsiveContainer,
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
	Legend,
} from "recharts";
import { MemorySeries } from "./types";

export default function MemoryChart({ series }: { series: MemorySeries }) {
	return (
		<div style={{ width: "100%", height: 280 }}>
			<ResponsiveContainer>
				<LineChart data={series.history} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
					<CartesianGrid strokeOpacity={0.15} />
					<XAxis dataKey="t" />
					<YAxis unit="%" domain={[0, 100]} />
					<Tooltip />
					<Legend />
					<Line type="monotone" dataKey="ramUsedPct" name="RAM" />
					<Line type="monotone" dataKey="swapUsedPct" name="Swap" strokeDasharray="4 4" />
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
