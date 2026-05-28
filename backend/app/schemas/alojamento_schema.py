from pydantic import BaseModel, EmailStr
from typing import List, Optional
from app.schemas.quarto_schema import QuartoResponse

class AlojamentoCreate(BaseModel):
    nome_alojamento: str
    descricao: str
    endereco: str
    pais: str

class AlojamentoResponse(AlojamentoCreate):
    id: int
    quartos: List[QuartoResponse] = []
    class Config:
        from_attributes = True