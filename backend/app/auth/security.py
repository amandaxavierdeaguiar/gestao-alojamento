import os
import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv

# Carrega as variáveis do ficheiro .env
load_dotenv()

# Pega nos valores do .env. Se por acaso não encontrar, usa um valor padrão (fallback)
SECRET_KEY = os.getenv("SECRET_KEY", "chave_para_desenvolvimento")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_HOURS = int(os.getenv("ACCESS_TOKEN_EXPIRE_HOURS", "8"))

# Configuração da encriptação de passwords (Bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__min_rounds=12)
security = HTTPBearer()

# ==========================================================
# FUNÇÕES AUXILIARES DE PASSWORD E TOKEN
# ==========================================================

def encriptar_password(password: str) -> str:
    return pwd_context.hash(password)

def verificar_password(password_pura: str, password_encriptada: str) -> bool:
    return pwd_context.verify(password_pura, password_encriptada)

def criar_token_acesso(dados: dict) -> str:
    dados_copia = dados.copy()
    # O JWT exige o tempo de expiração com datetime.utcnow()
    expiracao = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    dados_copia.update({"exp": expiracao})
    return jwt.encode(dados_copia, SECRET_KEY, algorithm=ALGORITHM)

# ==========================================================
# MIDDLEWARE / DEPENDÊNCIA DE PROTEÇÃO DE ROTAS
# ==========================================================

def verificar_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        # Descodifica o Token enviado pelo React
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        tipo_utilizador = payload.get("tipo")
        
        # Se não for admin, barra o acesso imediatamente com erro 403
        if tipo_utilizador != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="Acesso restrito apenas a administradores."
            )
        return payload  # Retorna os dados do token caso queiras usar na rota
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="O token expirou. Faça login novamente."
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token inválido."
        )