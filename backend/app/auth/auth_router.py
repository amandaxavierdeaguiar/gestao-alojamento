from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.config.database import get_db
from app.auth.user_model import UserModel
from app.auth.user_schema import UserCreate, UserResponse, LoginRequest, TokenResponse

from app.auth.security import encriptar_password, verificar_password, criar_token_acesso

router = APIRouter(tags=["Autenticação"])

@router.post("/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def registar_utilizador(payload: UserCreate, db: Session = Depends(get_db)):
    usuario_existente = db.query(UserModel).filter(UserModel.email == payload.email).first()
    if usuario_existente:
        raise HTTPException(status_code=400, detail="Este email já está registado.")

    novo_usuario = UserModel(
        nome=payload.nome,
        email=payload.email,
        # função que vem do security.py
        password_hash=encriptar_password(payload.password),
        tipo=payload.tipo
    )
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)
    return novo_usuario

@router.post("/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(UserModel).filter(UserModel.email == payload.email).first()
    
    # função que vem do security.py
    if not usuario or not verificar_password(payload.password, usuario.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou password incorretos."
        )

    dados_token = {
        "sub": str(usuario.id),
        "email": usuario.email,
        "tipo": usuario.tipo
    }
    
    # função que vem do security.py
    token_jwt = criar_token_acesso(dados_token)

    return {
        "token": token_jwt,
        "token_type": "bearer",
        "usuario": usuario
    }