# 🛡️ NexShop Antifraude SDK

Este projeto consiste em uma aplicação Angular projetada como base para um **SDK antifraude reutilizável**, com foco em segurança de autenticação, validação comportamental e análise de risco baseada em IP, geolocalização, horário e autenticação facial.

---

## 🚀 Funcionalidades Implementadas

| Funcionalidade                        | Descrição                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------- |
| ✅ Avaliação de risco                | Verificação de IPs não reconhecidos, maliciosos, horários suspeitos e localização fora do Brasil |
| 🔐 MFA com código                    | Código de 6 dígitos gerado automaticamente e enviado por e-mail           |
| 📸 Autenticação facial               | Ativação da webcam para validar a presença do usuário em risco alto       |
| 👤 Cadastro com imagem facial        | Imagem do rosto capturada e armazenada em base64 no momento do cadastro   |
| 🧾 Registro de login por IP          | Registros limitados a 5 IPs por usuário, com atualização ou substituição conforme necessário |
| 🤖 Validação comportamental          | Detecta cliques rápidos, excesso de interações e movimentações suspeitas (bot-like) na tela de produtos |

---

## 🧱 Estrutura do Projeto

```
NexShop/
├── nexshop/                     # Aplicação principal (Angular)
│   ├── angular.json
│   ├── package.json
│   ├── tsconfig*.json
│   ├── database/
│   │   └── db.json              # Banco de dados local (json-server)
│   ├── public/                  # Arquivos estáticos (logo, favicon)
│   ├── src/
│   │   ├── assets/              # Imagens da loja e produtos
│   │   └── app/
│   │       ├── core/            # SDK reutilizável
│   │       │   ├── models/
│   │       │   │   ├── usuario.model.ts
│   │       │   │   ├── dados-mfa.model.ts
│   │       │   │   └── registro-login.model.ts
│   │       │   └── services/
│   │       │       ├── usuario.service.ts
│   │       │       ├── login.service.ts
│   │       │       ├── mfa.service.ts
│   │       │       ├── verificacao-ip.service.ts
│   │       │       └── monitoramento-comportamento.service.ts  # (SDK antifraude)
│   │       └── features/       # Funcionalidades da aplicação
│   │           ├── login/
│   │           ├── cadastro/
│   │           ├── mfa/
│   │           ├── facial/     # Captura facial via webcam
│   │           └── home/       # Página de produtos com segurança
├── nexshop-backend/            # Mock de verificação de IP (porta 3001)
│   └── index.js
├── nexshop-email-api/          # API Node.js real para envio de e-mails (porta 3002)
│   ├── index.js
│   └── .env
└── README.md
```

---

## 🔐 Fluxo de Autenticação com Níveis de Risco

| Situação detectada                          | Nível de Risco |
|---------------------------------------------|----------------|
| IP malicioso (score ≥ 50 no AbuseIPDB)      | Alto           |
| IP fora do Brasil                           | Alto           |
| Horário entre 00h e 04h                     | Alto           |
| IP novo, mas não malicioso                  | Médio          |
| IP já usado anteriormente                   | Baixo          |

### → Ações:
- **Risco Baixo:** login direto
- **Risco Médio:** requer MFA por e-mail
- **Risco Alto:** requer MFA + autenticação facial

---

## 🧠 Validação Comportamental (na tela de produtos)

Para aumentar a proteção contra bots ou acessos automatizados, a **página de produtos monitora o comportamento do usuário**:

| Comportamento suspeito detectado         | Ação |
|------------------------------------------|------|
| Múltiplos cliques em poucos segundos     | Alerta de comportamento anormal |
| Cliques muito rápidos consecutivos       | Possível bot click |
| Movimentos de mouse muito rápidos        | Sinal de automação |

---

## ▶️ Instruções de Execução

### 1. Instale as dependências do Angular:
```bash
cd nexshop
npm install
```

### 2. Inicie o banco de dados simulado (porta 3000):
```bash
npx json-server --watch database/db.json --port 3000
```

### 3. Inicie o mock de verificação de IPs (porta 3001):
```bash
cd ../nexshop-backend
npm install
node index.js
```

### 4. Inicie a API real de envio de e-mail MFA (porta 3002):
```bash
cd ../nexshop-email-api
npm install
node index.js
```

### 5. Rode a aplicação Angular (porta 4200):
```bash
cd ../nexshop
ng serve
```

---

## 👤 Exemplo de estrutura de usuário no `db.json`

```json
{
  "id": "1",
  "nome": "raphael",
  "email": "raphael@teste.com",
  "senha": "123456",
  "perfil": "usuario",
  "fotoBase64": "data:image/png;base64,iVBORw0KGgoAAAANS..."
}
```

---

## 🧹 Futuras melhorias

- Validação real de imagem facial (comparação biométrica);
- Integração com outras formas de MFA (ex: TOTP, SMS);
- Exportação do SDK antifraude como biblioteca npm;
- Dashboard para logs e controle de risco;
- Tela de carrinho com integração antifraude.

---

Este projeto é de código aberto e distribuído sob a licença MIT.  
Desenvolvido com o objetivo de se tornar um **SDK antifraude reutilizável para e-commerce em Angular**.

---

**👨‍💼 Grupo FIAP – Trust No One**
