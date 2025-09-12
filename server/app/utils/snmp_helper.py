from pysnmp.hlapi import *
from app.core.config import SNMP_PORT

def snmp_get(ip: str, community: str, oid: str) -> str:
    iterator = getCmd(
        SnmpEngine(),
        CommunityData(community, mpModel=0),
        UdpTransportTarget((ip, SNMP_PORT), timeout=2, retries=1),
        ContextData(),
        ObjectType(ObjectIdentity(oid))
    )
    errorIndication, errorStatus, errorIndex, varBinds = next(iterator)
    if errorIndication or errorStatus:
        return "0"
    for varBind in varBinds:
        return str(varBind[1])
