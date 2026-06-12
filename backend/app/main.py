from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.database import engine, Base

from app.models.alojamento import AlojamentoModel
from app.models.cliente import ClienteModel
from app.models.quarto import QuartoModel
from app.models.reserva import ReservaModel

from app.routers import alojamento_router
# importando a rota de autenticação
from app.auth.auth_router import router as auth_router 

# Cria as tabelas no MySQL
Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Sistema de Reservas Alojamento")

# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registra os endpoints criados
app.include_router(alojamento_router.router)
# Inclui o router de autenticação que está isolado no módulo auth
app.include_router(auth_router)
# app.include_router(hotel_router)

@app.get("/")
def root():
    return {"status": "Online", "documentacao": "/docs"}