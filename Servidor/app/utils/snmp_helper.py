from pysnmp.hlapi import getCmd, nextCmd, SnmpEngine, CommunityData, UdpTransportTarget, ContextData, ObjectType, ObjectIdentity
from app.core.config import SNMP_PORT
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

def snmp_get(ip: str, community: str, oid: str) -> str:
    logging.info(f"Iniciando SNMP GET a {ip} con OID {oid}")
    iterator = getCmd(
        SnmpEngine(),
        CommunityData(community, mpModel=0),
        UdpTransportTarget((ip, SNMP_PORT), timeout=2, retries=1),
        ContextData(),
        ObjectType(ObjectIdentity(oid))
    )

    errorIndication, errorStatus, errorIndex, varBinds = next(iterator)

    if errorIndication:
        logging.error(f"Error SNMP: {errorIndication}")
        return "0"
    elif errorStatus:
        logging.error(f"{errorStatus.prettyPrint()} en {errorIndex}")
        return "0"

    for varBind in varBinds:
        value = str(varBind[1])
        logging.info(f"OID: {varBind[0]}, Valor: {value}")
        return value

def snmp_walk(ip: str, community: str, oid: str) -> list[str]:
    logging.info(f"Iniciando SNMP WALK a {ip} desde OID {oid}")
    results = []
    for (errorIndication, errorStatus, errorIndex, varBinds) in nextCmd(
        SnmpEngine(),
        CommunityData(community, mpModel=1), 
        UdpTransportTarget((ip, SNMP_PORT), timeout=2, retries=1),
        ContextData(),
        ObjectType(ObjectIdentity(oid)),
        lexicographicMode=False
    ):
        if errorIndication:
            logging.error(f"Error SNMP: {errorIndication}")
            break
        elif errorStatus:
            logging.error(f"{errorStatus.prettyPrint()} en {errorIndex}")
            break

        for varBind in varBinds:
            value = str(varBind[1])
            logging.info(f"OID: {varBind[0]}, Valor: {value}")
            results.append(value)

    return results