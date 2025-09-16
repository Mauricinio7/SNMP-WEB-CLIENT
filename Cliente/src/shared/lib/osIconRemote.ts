type OsIcon = { src: string; alt: string };

const SLUG = (s: string) => `https://cdn.simpleicons.org/${s}`;

const TABLE: Array<{
	match: RegExp;
	slug?: string;
	src?: string;
	alt: string;
}> = [
	{ match: /ubuntu/i, slug: "ubuntu", alt: "Ubuntu" },
	{ match: /debian/i, slug: "debian", alt: "Debian" },
	{ match: /arch/i, slug: "archlinux", alt: "Arch Linux" },
	{ match: /cent\s*os|centos/i, slug: "centos", alt: "CentOS" },
	{ match: /red\s*hat|rhel/i, slug: "redhat", alt: "Red Hat" },
	{ match: /pop!?\s*os/i, slug: "popos", alt: "Pop!_OS" },
	{
		match: /(windows\s*11|win\s*11)/i,
		src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows11/windows11-original.svg",
		alt: "Windows 11",
	},
	{
		match: /windows|win\s*10/i,
		src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg",
		alt: "Windows",
	},
	{ match: /fedora/i, slug: "fedora", alt: "Fedora" },
	{ match: /suse|opensuse/i, slug: "suse", alt: "SUSE Linux" },
	{ match: /manjaro/i, slug: "manjaro", alt: "Manjaro Linux" },
	{ match: /elementary\s*os/i, slug: "elementary", alt: "elementary OS" },
	{ match: /kali\s*linux/i, slug: "kalilinux", alt: "Kali Linux" },
	{ match: /alpine\s*linux/i, slug: "alpinelinux", alt: "Alpine Linux" },
	{ match: /linux\s*mint/i, slug: "linuxmint", alt: "Linux Mint" },
	{ match: /solus/i, slug: "solus", alt: "Solus" },
	{ match: /zorin\s*os/i, slug: "zorinos", alt: "Zorin OS" },
	{ match: /mageia/i, slug: "mageia", alt: "Mageia" },
	{ match: /deepin/i, slug: "deepin", alt: "Deepin" },
	{ match: /tuxedo/i, slug: "tuxedocomputers", alt: "Tuxedo Computers" },
	{ match: /solaris|illumos/i, slug: "oracle", alt: "Oracle Solaris" },
	{ match: /freebsd/i, slug: "freebsd", alt: "FreeBSD" },
	{ match: /openbsd/i, slug: "openbsd", alt: "OpenBSD" },
	{ match: /netbsd/i, slug: "netbsd", alt: "NetBSD" },
	{ match: /haiku/i, slug: "haiku", alt: "Haiku OS" },
	{ match: /reactos/i, slug: "reactos", alt: "ReactOS" },
	{ match: /chromium\s*os/i, slug: "chromium", alt: "Chromium OS" },
	{ match: /chrome\s*os/i, slug: "googlechrome", alt: "Chrome OS" },
	{ match: /mac\s*os|macos|os\s*x|osx/i, slug: "apple", alt: "macOS" },
	{ match: /ios/i, slug: "apple", alt: "iOS" },
	{ match: /android/i, slug: "android", alt: "Android" },
];

export function getOsIconRemote(osName?: string | null): OsIcon {
	const s = (osName ?? "").trim();
	const row = TABLE.find((r) => r.match.test(s));
	if (row) {
		return {
			src: row.src ?? SLUG(row.slug!),
			alt: row.alt,
		};
	}
	return { src: SLUG("linux"), alt: "Sistema operativo desconocido" };
}
