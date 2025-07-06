# 🛡️ NexShop Antifraude SDK

Este projeto consiste em uma aplicação Angular projetada como base para um **SDK antifraude reutilizável**, com foco em segurança de autenticação e análise de risco baseada em IP, geolocalização, horário e autenticação facial.

---

## 🚀 Funcionalidades Implementadas

| Funcionalidade                        | Descrição                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------- |
| ✅ Avaliação de risco                | Verificação de IPs não reconhecidos, maliciosos, horários suspeitos e localização fora do Brasil |
| 🔐 MFA com código                    | Código de 6 dígitos gerado automaticamente                               |
| 📸 Autenticação facial               | Ativação da webcam para capturar imagem e validar presença do usuário     |
| 👤 Cadastro com imagem facial        | Imagem do rosto capturada e armazenada em base64 no momento do cadastro   |
| 🧾 Registro de login por IP          | Registros limitados a 5 IPs por usuário, com atualização ou substituição conforme necessário |

---

## 🧱 Estrutura do Projeto

NexShop/
├── nexshop/ # Aplicação principal (Angular)
│ ├── src/
│ │ ├── app/
│ │ │ ├── core/ # SDK: Models e serviços reutilizáveis
│ │ │ │ ├── models/
│ │ │ │ │ ├── usuario.model.ts
│ │ │ │ │ ├── registro-login.model.ts
│ │ │ │ │ └── dados-mfa.model.ts
│ │ │ │ └── services/
│ │ │ │ ├── usuario.service.ts
│ │ │ │ ├── login.service.ts
│ │ │ │ ├── mfa.service.ts
│ │ │ │ └── verificacao-ip.service.ts
│ │ │ └── features/
│ │ │ ├── login/
│ │ │ ├── cadastro/
│ │ │ ├── mfa/
│ │ │ └── facial/ # Componente da autenticação facial via webcam
│ ├── database/db.json # Banco de dados local (json-server)
├── nexshop-backend/ # Backend para verificação de IPs (AbuseIPDB mock)
│ └── index.js


---

## 🔐 Fluxo de Autenticação com Níveis de Risco

- **Risco baixo** → Login direto
- **Risco médio** → Requer MFA (código)
- **Risco alto** → Requer MFA (código) + Autenticação facial

---

## 🧰 Tecnologias Utilizadas

- Angular 17+
- TypeScript / RxJS
- JSON Server
- API HTML5 de Captura de Vídeo (Webcam)
- Mock externo para AbuseIPDB

---

## ▶️ Instruções de Execução

### 1. Instale as dependências do projeto Angular

cd nexshop
npm install

### 2. Inicie o servidor de dados (json-server)

npx json-server --watch database/db.json --port 3000

### 3. Inicie o mock da verificação de IP (porta 3001)

cd nexshop-backend
npm install
node index.js

### 4. Rode a aplicação Angular

cd nexshop
ng serve

Acesse a aplicação em: http://localhost:4200



🧠 Critérios de Avaliação de Risco
Situação identificada	Nível de Risco atribuído
IP malicioso (score ≥ 50 no AbuseIPDB)	Alto
IP fora do Brasil	Alto
Horário entre 00:00h e 04:00h	Alto
IP novo, mas não malicioso	Médio
IP já usado pelo usuário, sem anomalias	Baixo

👤 Exemplo de estrutura de usuário no db.json

{
  "usuarios": [
    {
      "id": 1,
      "nome": "test",
      "email": "test@teste.com",
      "senha": "123456",
      "perfil": "admin",
      "fotoBase64": "data:image/png;base64,iVBORw0KGgoAAAANS..."
    }
  ]
}


🔄 Futuras melhorias

    Validação real de imagem facial (comparação biométrica)

    Suporte a múltiplas estratégias de MFA (e-mail, TOTP)

    Exportação do SDK como biblioteca npm

    Dashboard de administração e logs de auditoria

Este projeto é de código aberto e distribuído sob a licença MIT.
Desenvolvido com o objetivo de se tornar um SDK antifraude reutilizável em aplicações Angular e corporativas.


---

Nomes Group FIAP
