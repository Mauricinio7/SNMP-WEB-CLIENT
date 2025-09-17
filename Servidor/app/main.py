from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes_snmp import router as snmp_router

app = FastAPI(title="SNMP Monitoring API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

app.include_router(snmp_router, prefix="/snmp", tags=["SNMP"])