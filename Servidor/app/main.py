from fastapi import FastAPI
from app.api.routes_snmp import router as snmp_router

app = FastAPI(title="SNMP Monitoring API")

app.include_router(snmp_router, prefix="/api/snmp", tags=["SNMP"])
