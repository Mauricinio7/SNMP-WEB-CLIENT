import { useState } from "react";
import { getOsIconRemote } from "../lib/osIconRemote";
import style from "./styles/OsLogo.module.css";

export function OsLogo({ os }: { os: string }) {
	const { src, alt } = getOsIconRemote(os);
	const [imgSrc, setImgSrc] = useState(src);

	return (
		<div className={style.wrapper}>
			<img
				src={imgSrc}
				alt={alt}
				loading="lazy"
				referrerPolicy="no-referrer"
				onError={() => setImgSrc("https://cdn.simpleicons.org/linux")}
			/>
		</div>
	);
}
