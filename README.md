# 🏨 Sistema de Gestão de Alojamento Local — Frontend (React)

## 📌 Descrição do Projeto
Este repositório contém o **frontend** do Sistema de Gestão de Alojamento Local, desenvolvido no âmbito do **CET de Programação**.

O projeto original foi concebido para a gestão de um **hotel**, mas está a ser **adaptado para funcionar como um alojamento local**, ajustando a interface e o fluxo de utilização para este novo contexto.

Toda a parte visual e interativa está a ser construída em **React**, garantindo uma experiência moderna, clara e intuitiva.

---

## 📌 Descrição do Projeto

O sistema foi desenhado para centralizar, automatizar e gerir as operações diárias de um Alojamento Local. Toda a camada visual e interativa foi construída em **React**, garantindo uma experiência de utilizador fluida, clara e responsiva, enquanto o **Backend em FastAPI** fornece uma API RESTful de alta performance, segura e totalmente integrada com uma base de dados **MySQL** através do ORM **SQLAlchemy**.

---

## 🔐 Autenticação, Base de Dados e Controlo de Permissões

* **Administrador (Admin):** Possui controlo total do sistema. Apenas utilizadores com privilégios de administrador conseguem **visualizar, criar, editar e excluir** informações críticas de quartos, reservas, clientes e utilizadores.
* **Hospede / Recepção:** Não é permitido acesso ao painel de controle.

### Cifragem de Palavras-passe
Para garantir a máxima segurança dos dados sensíveis e das credenciais dos utilizadores, a biblioteca `passlib[bcrypt]` foi configurada de forma rigorosa no componente de segurança, estabelecendo um custo computacional elevado (mínimo de 12 rounds) para mitigar ataques de força bruta:

```python
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__min_rounds=12)
```

---

## Backend

- FastAPI (Framework Python moderno e assíncrono de alta performance)
- MySQL (Base de dados relacional robusta para produção)
- SQLAlchemy (ORM para mapeamento objeto-relacional eficiente e controlo de transações)
- Pydantic (Validação rigorosa de dados de entrada e saída)
- Passlib & JWT (Mecanismo seguro para geração e validação de tokens de acesso)

# Executar o servidor Uvicorn

cd backend
```python
python -m uvicorn app.main:app --reload
```

---

## 🎯 Objetivos do Frontend
- Criar uma interface funcional e fácil de utilizar  
- Permitir o registo e visualização de clientes  
- Criar e listar reservas  
- Associar quartos às reservas  
- Calcular e apresentar valores finais  
- Exibir faturas e detalhes das estadias  

# Executar o projeto

cd frontend
```python
npm run dev
```

---


## 🛣️ Próximos Passos
- Melhorar a interface e usabilidade  
- Criar componentes reutilizáveis  
- Ajustar o fluxo de dados para o contexto de alojamento local  


---

## 🛠️ Próximos Passos & Visão de Futuro

O sistema core (API, Base de Dados e Painel Administrativo) está totalmente funcional. O plano de evolução do projeto foca-se na expansão da experiência do cliente final e na riqueza visual da plataforma:

- [ ] 🌐 **Plataforma Pública de Reservas (Website Cliente):**
  - Criação de um portal público e intuitivo para utilizadores não autenticados navegarem pelos alojamentos disponíveis.
  - Implementação de um sistema de **Galeria de Imagens** dinâmicas para cada unidade de alojamento.
  - Integração de **Mapas/Localização** (ex: Google Maps) para exibir a localização exata de cada alojamento local.
  - Filtros avançados de pesquisa (por preço, número de hóspedes, comodidades e datas disponíveis).

- [ ] 👤 **Painel do Utilizador Avançado (Área do Cliente):**
  - Criação de um dashboard dedicado e 100% interativo para o cliente.
  - Histórico completo de estadias (reservas passadas, ativas e futuras).
  - Funcionalidade para o cliente **cancelar ou alterar pedidos de reserva** (respeitando as regras de negócio da API).
  - Download direto de faturas e recibos em formato PDF gerados pelo backend.

- [ ] 🎨 **Otimizações Gerais de Sistema:**
  - Implementação de *Lazy Loading* no React para o carregamento ultra-rápido das imagens dos alojamentos.
  - Refinamento estético e feedbacks visuais (Loaders, Toasts de sucesso/erro) para tornar a experiência do utilizador ainda mais fluida.

---

## 👩‍💻 Autora
Projeto desenvolvido por **Amanda Xavier de Aguiar** no âmbito do **CET PROGRAMAÇÃO SIST. INFORMÁTICOS**.