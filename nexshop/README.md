# Nexshop

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

Projeto - ng serve
BD - json-server --watch db.json --port 3000
back-end - node index.js

Atual estrututura do projeto: 

NexShop/
├── nexshop/                            # Frontend Angular (App principal)
│   ├── angular.json
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig*.json
│   ├── README.md
│   ├── database/
│   │   └── db.json                     # Base de dados simulada (json-server)
│   ├── public/                         # Arquivos públicos (favicon, logos)
│   │   ├── favicon.ico
│   │   ├── emblema.png
│   │   └── logo-mini.ico
│   ├── src/
│   │   ├── index.html
│   │   ├── styles.scss
│   │   ├── main.ts
│   │   ├── main.server.ts
│   │   ├── server.ts
│   │   ├── assets/                    # Imagens e recursos estáticos
│   │   │   ├── emblema.png
│   │   │   └── logo.png
│   │   └── app/                       # Código principal da aplicação Angular
│   │       ├── app.config.ts
│   │       ├── app.config.server.ts
│   │       ├── app.routes.ts
│   │       ├── app.routes.server.ts
│   │       ├── app.ts
│   │       ├── app.scss
│   │       ├── app.html
│   │       ├── app.spec.ts
│   │       ├── core/                  # SDK: models e serviços reutilizáveis
│   │       │   ├── models/
│   │       │   │   ├── usuario.model.ts
│   │       │   │   ├── registro-login.model.ts
│   │       │   │   └── dados-mfa.model.ts        # ✅ Novo model para MFA
│   │       │   └── services/
│   │       │       ├── usuario.service.ts
│   │       │       ├── login.service.ts
│   │       │       ├── mfa.service.ts            # ✅ MFA com código aleatório
│   │       │       ├── verificacao-ip.service.ts # ✅ Toda lógica de IP consolidada aqui
│   │       │       ├── usuario.spec.ts
│   │       │       ├── login.spec.ts
│   │       │       ├── mfa.spec.ts
│   │       │       └── verificacao-ip.spec.ts
│   │       └── features/              # Componentes de funcionalidades (UI)
│   │           ├── login/
│   │           │   ├── login.ts
│   │           │   ├── login.html
│   │           │   ├── login.scss
│   │           │   └── login.spec.ts
│   │           ├── cadastro/
│   │           │   ├── cadastro.ts
│   │           │   ├── cadastro.html
│   │           │   ├── cadastro.scss
│   │           │   └── cadastro.spec.ts
│   │           └── mfa/
│   │               ├── mfa.ts
│   │               ├── mfa.html
│   │               ├── mfa.scss
│
├── nexshop-backend/                   # Backend (json-server)
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── node_modules/
│
└── README.md
