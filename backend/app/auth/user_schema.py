from pydantic import BaseModel, EmailStr
from typing import Optional

# Dados que chegam na criação de um utilizador
class UserCreate(BaseModel):
    nome: str
    email: EmailStr
    password: str
    tipo: Optional[str] = "hospede"

# Dados enviados para o ecrã (Oculta a password por segurança)
class UserResponse(BaseModel):
    id: int
    nome: str
    email: EmailStr
    tipo: str

    class Config:
        from_attributes = True

# Estrutura do corpo do Login
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Resposta que o React vai receber após um login com sucesso
class TokenResponse(BaseModel):
    token: str
    token_type: str
    usuario: UserResponse