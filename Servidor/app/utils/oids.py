OIDS = {
    "device_name": "1.3.6.1.2.1.1.5.0",       # sysName
    "cpu_load": "1.3.6.1.4.1.2021.11.9.0",    # laLoad
    "ram_usage": "1.3.6.1.4.1.2021.4.6.0",    # memUsed
    "disk_usage": "1.3.6.1.4.1.2021.9.1.9.1", # dskPercent
    "temperature": "1.3.6.1.4.1.2021.13.16.2.1.3.1",
    "bandwidth_usage": "1.3.6.1.2.1.2.2.1.10.2",
    "tasks_count": "1.3.6.1.4.1.2021.11.50.0"
}

GENERAL_DEVICE_OIDS = {
    "device_name": "1.3.6.1.2.1.1.5.0",
    "os_description": "1.3.6.1.2.1.1.1.0",
    "ram_size": "1.3.6.1.4.1.2021.4.3.0",
}


UCD_MEM = {
    "memTotalReal":  "1.3.6.1.4.1.2021.4.5.0",   # RAM total (kB)
    "memAvailReal":  "1.3.6.1.4.1.2021.4.6.0",   # RAM disponible (kB)
    "memBuffer":     "1.3.6.1.4.1.2021.4.14.0",  # Buffers (kB)
    "memCached":     "1.3.6.1.4.1.2021.4.15.0",  # Caché (kB)
    "memTotalSwap":  "1.3.6.1.4.1.2021.4.3.0",   # SWAP total (kB)
    "memAvailSwap":  "1.3.6.1.4.1.2021.4.4.0",   # SWAP disponible (kB)
}