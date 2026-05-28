from pydantic import BaseModel, EmailStr
class QuartoCreate(BaseModel):
    numero_quarto: int
    tipo: str
    preco: float
    alojamento_id: int

class QuartoResponse(QuartoCreate):
    id: int
    class Config:
        from_attributes = True