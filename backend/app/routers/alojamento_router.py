from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.config.database import get_db

from app.models.alojamento import AlojamentoModel
from app.models.quarto import QuartoModel
from app.models.cliente import ClienteModel
from app.models.reserva import ReservaModel

from app.schemas.alojamento_schema import AlojamentoCreate, AlojamentoResponse
from app.schemas.quarto_schema import QuartoCreate, QuartoResponse
from app.schemas.cliente_schema import ClienteCreate, ClienteResponse
from app.schemas.reserva_schema import ReservaCreate, ReservaResponse, ReservaUpdate

from datetime import datetime

from sqlalchemy.orm import joinedload

# Para verificar se o utilizador logado é admin
from app.auth.security import verificar_admin

router = APIRouter(tags=["Gestão de Hotelaria"])

# ==========================================
# ALOJAMENTO
# ==========================================
@router.post("/alojamentos", response_model=AlojamentoResponse, status_code=status.HTTP_201_CREATED)
def criar_alojamento(payload: AlojamentoCreate, db: Session = Depends(get_db)):
    novo_alojamento = AlojamentoModel(
        nome_alojamento=payload.nome_alojamento,
        descricao=payload.descricao,
        endereco=payload.endereco,
        pais=payload.pais
    )
    db.add(novo_alojamento)
    db.commit()
    db.refresh(novo_alojamento)
    return novo_alojamento

@router.get("/alojamentos", response_model=List[AlojamentoResponse])
def listar_alojamentos(db: Session = Depends(get_db)):
    return db.query(AlojamentoModel).all()

@router.get("/alojamentos/{alojamento_id}", response_model=AlojamentoResponse)
def obter_alojamento_por_id(alojamento_id: int, db: Session = Depends(get_db)):
    alojamento = db.query(AlojamentoModel).filter(AlojamentoModel.id == alojamento_id).first()
    if not alojamento:
        raise HTTPException(status_code=404, detail="Alojamento não encontrado.")
    return alojamento

@router.put("/alojamentos/{alojamento_id}", status_code=status.HTTP_200_OK)
def atualizar_alojamento(
    alojamento_id: int, 
    payload: AlojamentoCreate, # Reutiliza a validação de campos existentes
    db: Session = Depends(get_db),
    usuario_logado: dict = Depends(verificar_admin) # Proteção administrativa ativa
):
    alojamento = db.query(AlojamentoModel).filter(AlojamentoModel.id == alojamento_id).first()
    if not alojamento:
        raise HTTPException(status_code=404, detail="Alojamento não encontrado.")

    dados_atualizados = payload.model_dump(exclude_unset=True)
    for chave, valor in dados_atualizados.items():
        setattr(alojamento, chave, valor)

    db.commit()
    db.refresh(alojamento)
    return {"message": "Alojamento atualizado com sucesso!", "alojamento": alojamento}

@router.delete("/alojamentos/{alojamento_id}", status_code=status.HTTP_200_OK)
def deletar_alojamento(alojamento_id: int, db: Session = Depends(get_db), usuario_logado: dict = Depends(verificar_admin)):
    alojamento = db.query(AlojamentoModel).filter(AlojamentoModel.id == alojamento_id).first()
    if not alojamento:
        raise HTTPException(status_code=404, detail="Alojamento nao encontrado.")
    db.delete(alojamento)
    db.commit()
    return {"message": "Alojamento deletado com sucesso!"}

# ==========================================
# CLIENTE
# ==========================================
@router.post("/clientes", response_model=ClienteResponse, status_code=status.HTTP_201_CREATED)
def criar_cliente(payload: ClienteCreate, db: Session = Depends(get_db)):
    novo_cliente = ClienteModel(
        nome=payload.nome,
        email=payload.email,
        telefone=payload.telefone,
        endereco=payload.endereco
    )
    db.add(novo_cliente)
    db.commit()
    db.refresh(novo_cliente)
    return novo_cliente

@router.get("/clientes", response_model=List[ClienteResponse])
def listar_clientes(db: Session = Depends(get_db)):
    return db.query(ClienteModel).all()

@router.get("/clientes/{cliente_id}", response_model=ClienteResponse)
def obter_cliente_por_id(cliente_id: int, db: Session = Depends(get_db)):
    cliente = db.query(ClienteModel).filter(ClienteModel.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado.")
    return cliente

@router.put("/clientes/{cliente_id}", status_code=status.HTTP_200_OK)
def atualizar_cliente(
    cliente_id: int, 
    payload: ClienteCreate,
    db: Session = Depends(get_db)
):
    cliente = db.query(ClienteModel).filter(ClienteModel.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado.")

    dados_atualizados = payload.model_dump(exclude_unset=True)
    for chave, valor in dados_atualizados.items():
        setattr(cliente, chave, valor)

    db.commit()
    db.refresh(cliente)
    return {"message": "Cliente atualizado com sucesso!", "cliente": cliente}

@router.delete("/clientes/{cliente_id}", status_code=status.HTTP_200_OK)
def deletar_cliente(cliente_id: int, db: Session = Depends(get_db)):
    cliente = db.query(ClienteModel).filter(ClienteModel.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente nao encontrado.")
    db.delete(cliente)
    db.commit()
    return {"message": "Cliente deletado com sucesso!"}
# ==========================================
# QUARTO
# ==========================================
@router.post("/quartos", response_model=QuartoResponse, status_code=status.HTTP_201_CREATED)
def criar_quarto(payload: QuartoCreate, db: Session = Depends(get_db)):
    alojamento = db.query(AlojamentoModel).filter(AlojamentoModel.id == payload.alojamento_id).first()
    if not alojamento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Não é possível criar o quarto. O Alojamento com ID {payload.alojamento_id} não existe."
        )

    novo_quarto = QuartoModel(
        numero_quarto=payload.numero_quarto,
        tipo=payload.tipo,
        preco=payload.preco,
        alojamento_id=payload.alojamento_id
    )
    db.add(novo_quarto)
    db.commit()
    db.refresh(novo_quarto)
    return novo_quarto

@router.get("/quartos", response_model=List[QuartoResponse])
def listar_quartos(db: Session = Depends(get_db)):
    return db.query(QuartoModel).all()

@router.get("/quartos/{quarto_id}", response_model=QuartoResponse)
def obter_quarto_por_id(quarto_id: int, db: Session = Depends(get_db)):
    quarto = db.query(QuartoModel).filter(QuartoModel.id == quarto_id).first()
    if not quarto:
        raise HTTPException(status_code=404, detail="Quarto não encontrado.")
    return quarto

@router.put("/quartos/{quarto_id}", status_code=status.HTTP_200_OK)
def atualizar_quarto(
    quarto_id: int, 
    payload: QuartoCreate, 
    db: Session = Depends(get_db),
    usuario_logado: dict = Depends(verificar_admin) # Proteção administrativa ativa
):
    # Procura o quarto
    quarto = db.query(QuartoModel).filter(QuartoModel.id == quarto_id).first()
    if not quarto:
        raise HTTPException(status_code=404, detail="Quarto não encontrado.")

    # Valida se o novo alojamento_id indicado existe
    alojamento = db.query(AlojamentoModel).filter(AlojamentoModel.id == payload.alojamento_id).first()
    if not alojamento:
        raise HTTPException(
            status_code=404, 
            detail=f"Não é possível atualizar o quarto. O Alojamento com ID {payload.alojamento_id} não existe."
        )

    # Atualiza os dados dinamicamente
    dados_atualizados = payload.model_dump(exclude_unset=True)
    for chave, valor in dados_atualizados.items():
        setattr(quarto, chave, valor)

    db.commit()
    db.refresh(quarto)
    return {"message": "Quarto atualizado com sucesso!", "quarto": quarto}

@router.delete("/quartos/{quarto_id}", status_code=status.HTTP_200_OK)
def deletar_quarto(quarto_id: int, db: Session = Depends(get_db)):
    quarto = db.query(QuartoModel).filter(QuartoModel.id == quarto_id).first()
    if not quarto:
        raise HTTPException(status_code=404, detail="Quarto nao encontrado.")
    db.delete(quarto)
    db.commit()
    return {"message": "Quarto deletado com sucesso!"}

# ==========================================
# RESERVA
# ==========================================
@router.post("/reservas", response_model=ReservaResponse, status_code=status.HTTP_201_CREATED)
def criar_reserva(payload: ReservaCreate, db: Session = Depends(get_db)):
    cliente = db.query(ClienteModel).filter(ClienteModel.id == payload.cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail=f"Cliente com ID {payload.cliente_id} não encontrado.")

    quartos = db.query(QuartoModel).filter(QuartoModel.id.in_(payload.quarto_ids)).all()
    if len(quartos) != len(payload.quarto_ids):
        raise HTTPException(status_code=404, detail="Um ou mais IDs de quartos não existem.")

    # --- CÁLCULO DAS DIÁRIAS ---
    try:
        # Garante a conversão de str para date se necessário
        d_inicio = payload.data_inicio if isinstance(payload.data_inicio, datetime) else datetime.strptime(str(payload.data_inicio), "%Y-%m-%d")
        d_fim = payload.data_fim if isinstance(payload.data_fim, datetime) else datetime.strptime(str(payload.data_fim), "%Y-%m-%d")
        
        dias = (d_fim - d_inicio).days
        if dias <= 0:
            dias = 1  # Evita diárias zeradas ou negativas
    except Exception:
        dias = 1

    soma_precos_quartos = sum([quarto.preco for quarto in quartos])
    # Multiplica o valor dos quartos pelos dias e soma a cama extra uma única vez (ou multiplique a cama extra por dia se preferir)
    preco_final_calculado = (soma_precos_quartos * dias) + (payload.cama_extra or 0.0)

    nova_reserva = ReservaModel(
        data_inicio=payload.data_inicio,
        hora_checkin=payload.hora_checkin,
        data_fim=payload.data_fim,
        hora_checkout=payload.hora_checkout,
        preco_total=preco_final_calculado,
        cama_extra=payload.cama_extra,
        status=payload.status,
        cliente_id=payload.cliente_id
    )
    
    db.add(nova_reserva)
    db.commit() 
    
    for quarto in quartos:
        quarto.reserva_id = nova_reserva.id
        
    db.commit() 
    db.refresh(nova_reserva)
    return nova_reserva

@router.get("/reservas", response_model=List[ReservaResponse])
def listar_reservas(db: Session = Depends(get_db)):
    return db.query(ReservaModel).options(
        joinedload(ReservaModel.cliente),
        joinedload(ReservaModel.quartos)
    ).all()

@router.get("/reservas/{reserva_id}", response_model=ReservaResponse)
def obter_reserva_por_id(reserva_id: int, db: Session = Depends(get_db)):
    reserva = db.query(ReservaModel).filter(ReservaModel.id == reserva_id).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva não encontrada.")
    return reserva

@router.delete("/reservas/{reserva_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_reserva(
    reserva_id: int, 
    db: Session = Depends(get_db),
    usuario_logado: dict = Depends(verificar_admin)
):
    delete_reserva = db.query(ReservaModel).filter(ReservaModel.id == reserva_id).first()
    if not delete_reserva:
        raise HTTPException(status_code=404, detail="Reserva nao encontrada.")
    db.delete(delete_reserva)
    db.commit()
    return None

@router.put("/reservas/{reserva_id}", status_code=status.HTTP_200_OK)
def atualizar_reserva(
    reserva_id: int, 
    payload: ReservaUpdate, 
    db: Session = Depends(get_db),
    usuario_logado: dict = Depends(verificar_admin)
):
    reserva = db.query(ReservaModel).filter(ReservaModel.id == reserva_id).first()
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva não encontrada.")

    # Verifica se houve alteração de datas para recalcular dias
    data_ini = payload.data_inicio or reserva.data_inicio
    data_fim = payload.data_fim or reserva.data_fim
    try:
        d_inicio = data_ini if isinstance(data_ini, datetime) else datetime.strptime(str(data_ini), "%Y-%m-%d")
        d_fim = data_fim if isinstance(data_fim, datetime) else datetime.strptime(str(data_fim), "%Y-%m-%d")
        dias = (d_fim - d_inicio).days
        if dias <= 0:
            dias = 1
    except Exception:
        dias = 1

    # Intercepta e processa a troca de quartos
    if payload.quarto_ids is not None:
        novos_quartos = db.query(QuartoModel).filter(QuartoModel.id.in_(payload.quarto_ids)).all()
        if len(novos_quartos) != len(payload.quarto_ids):
            raise HTTPException(status_code=404, detail="Um ou mais IDs de quartos não existem.")
        
        db.query(QuartoModel).filter(QuartoModel.reserva_id == reserva.id).update({QuartoModel.reserva_id: None})
        
        for q in novos_quartos:
            q.reserva_id = reserva.id
            
        soma_precos = sum([q.preco for q in novos_quartos])
        cama = payload.cama_extra if payload.cama_extra is not None else (reserva.cama_extra or 0.0)
        reserva.preco_total = (soma_precos * dias) + cama
    else:
        quartos_atuais = db.query(QuartoModel).filter(QuartoModel.reserva_id == reserva.id).all()
        soma_precos = sum([q.preco for q in quartos_atuais])
        cama = payload.cama_extra if payload.cama_extra is not None else (reserva.cama_extra or 0.0)
        reserva.preco_total = (soma_precos * dias) + cama

    dados_atualizados = payload.model_dump(exclude_unset=True, exclude={"quarto_ids"})
    for chave, valor in dados_atualizados.items():
        setattr(reserva, chave, valor)

    db.commit()
    db.refresh(reserva)
    return {"message": "Reserva updated successfully!", "reserva": reserva}