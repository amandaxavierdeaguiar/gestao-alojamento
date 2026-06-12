from sqlalchemy import Column, Integer, String
from app.config.database import Base

class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    tipo = Column(String(50), default="hospede")  # 'admin', 'recepcao', 'hospede'