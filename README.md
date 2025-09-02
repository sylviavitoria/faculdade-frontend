# 🎓 Sistema de Gerenciamento Acadêmico

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.0-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-7.8.0-CA4245?style=flat&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Axios](https://img.shields.io/badge/Axios-1.11.0-5A29E4?style=flat&logo=axios&logoColor=white)](https://axios-http.com/)
[![Jest](https://img.shields.io/badge/Jest-30.0.5-C21325?style=flat&logo=jest&logoColor=white)](https://jestjs.io/)

O **Sistema de Faculdade** é uma aplicação web moderna desenvolvida com React 19 e TypeScript que oferece uma interface completa para gerenciamento acadêmico. O sistema permite a administração de alunos, professores, disciplinas e matrículas com diferentes níveis de acesso baseados em perfis de usuário.

---

## 🧠 Tecnologias Utilizadas

### Frontend

- **React 19:** Biblioteca JavaScript mais recente para construção de interfaces de usuário
- **TypeScript 5.8:** Linguagem de programação tipada que compila para JavaScript
- **Vite 7.1:** Ferramenta de build moderna e ultra-rápida para projetos frontend
- **React Router Dom 7.8:** Gerenciamento avançado de rotas e navegação
- **Axios 1.11:** Cliente HTTP para realizar requisições à API com interceptors
- **CSS Puro:** Estilização sem dependências externas com variáveis CSS
- **Jest 30.0:** Framework de testes unitários
- **React Testing Library 16.3:** Biblioteca para testes de componentes React

### Padrões e Arquitetura

- **Custom Hooks:** Reutilização de lógica de estado e efeitos
- **Context API:** Gerenciamento de estado global para autenticação
- **Component-Based Architecture:** Componentes reutilizáveis e modulares
- **Service Layer Pattern:** Abstração da comunicação com API
- **Protected Routes:** Controle de acesso baseado em autenticação
- **Role-Based Access Control:** Sistema de permissões por perfil de usuário
- **Design Responsivo:** Layout adaptável para dispositivos móveis e desktop

---

## 🎨 Imagens do layout:
### Abaixo estão algumas imagens que ilustram o layout e o funcionamento da aplicação.

<img width="1899" height="953" alt="image" src="https://github.com/user-attachments/assets/1b0a0763-9758-4ee7-96ea-d2f531896727" />
<img width="1896" height="958" alt="image" src="https://github.com/user-attachments/assets/d44fa9ce-47c0-4d23-b389-6c15e2ab53b0" />
<img width="1881" height="952" alt="image" src="https://github.com/user-attachments/assets/650c2490-7835-4cb4-86f4-24f5975ab6e9" />
<img width="1892" height="950" alt="image" src="https://github.com/user-attachments/assets/acd44371-da21-4cb4-843f-eb96fe04b4a7" />
<img width="1887" height="953" alt="image" src="https://github.com/user-attachments/assets/c32207a9-cdc6-4a19-b2f5-0fc9af8e1bd4" />
<img width="1895" height="958" alt="image" src="https://github.com/user-attachments/assets/90fcbd6c-7ec8-4c91-b67b-d6f5968c2fc3" />
<img width="377" height="832" alt="image" src="https://github.com/user-attachments/assets/ac7690e4-c1c6-480b-bd6c-e0c6605470e5" />

---


## 📂 Estrutura do Projeto

```
src/
├── components/         # Componentes React
│   ├── __tests__/      # Testes para componentes
│   ├── form/           # Componentes de formulário
│   │   └── __tests__/  # Testes para componentes de formulário
│   ├── generic/        # Componentes genéricos reutilizáveis
│   │   └── __tests__/  # Testes para componentes genéricos
│   └── style/          # Estilos específicos dos componentes
├── pages/              # Páginas/rotas da aplicação
│   ├── __tests__/      # Testes para páginas
│   └── style/          # Estilos específicos das páginas
├── hooks/              # Custom hooks React
│   └── __tests__/      # Testes para hooks
├── contexts/           # Contextos React para estado global
├── service/            # Serviços para comunicação com API
│   └── __tests__/      # Testes para serviços
├── types/              # Definições de tipos TypeScript
├── utils/              # Funções utilitárias
├── assets/             # Recursos estáticos (imagens, ícones)
├── setupTests.ts       # Configuração global para testes
└── index.css           # Estilos globais da aplicação
```

## 🗺️ Páginas Principais

### 🔸 Home (Dashboard)
- Página inicial com banner de boas-vindas
- Navegação centralizada para todas as funcionalidades

### 🔸 Login
- Sistema de autenticação seguro com JWT
- Validação de credenciais
- Persistência de sessão no localStorage

### 🔸 Alunos
- **Listar Alunos:** Visualização paginada de todos os alunos (Admin/Professor)
- **Cadastrar Aluno:** Formulário para registro de novos alunos (Admin/Professor)
- **Editar Aluno:** Formulário para alterar dados do aluno (Admin/Professor)
- **Buscar Aluno:** Pesquisa de aluno por ID (Admin/Professor)
- **Perfil do Aluno:** Visualização dos próprios dados (Aluno)

### 🔸 Professores
- **Listar Professores:** Visualização paginada de todos os professores (Admin)
- **Cadastrar Professor:** Formulário para registro de novos professores (Admin)
- **Editar Professor:** Formulário para alterar dados do professor (Admin)
- **Buscar Professor:** Pesquisa de professor por ID (Admin)
- **Perfil do Professor:** Visualização dos próprios dados (Professor)

### 🔸 Disciplinas
- **Listar Disciplinas:** Visualização de todas as disciplinas (Admin/Professor)
- **Cadastrar Disciplina:** Formulário para criação de disciplinas (Admin/Professor)
- **Editar Disciplina:** Formulário para alterar dados da disciplina (Admin/Professor)
- **Buscar Disciplina:** Pesquisa de disciplina por ID (Admin/Professor)

### 🔸 Matrículas
- **Listar Matrículas:** Visualização de todas as matrículas com paginação (Admin/Professor)
- **Cadastrar Matrícula:** Formulário para criação de novas matrículas (Admin)
- **Buscar Matrícula:** Pesquisa de matrícula por ID (Todos)
- **Atualizar Notas:** Interface para atribuição e edição de notas (Admin/Professor)

---

## ⚙️ Funcionalidades Principais

### ✔️ Sistema de Autenticação e Autorização
- Login seguro com JWT (JSON Web Token)
- Três níveis de acesso: **ROLE_ADMIN**, **ROLE_PROFESSOR**, **ROLE_ALUNO**
- Rotas protegidas baseadas no status de autenticação
- Controle de acesso por componente baseado no perfil do usuário
- Persistência automática da sessão

### ✔️ Gestão de Alunos
- Cadastro com validação de campos (nome, email, matrícula, senha)
- Listagem paginada com controles de navegação
- Funcionalidade de busca por ID
- Edição e exclusão de registros (Admin/Professor)
- Validação de email e matrícula únicos

### ✔️ Gestão de Professores
- Cadastro completo de professores (Admin)
- Listagem paginada com informações detalhadas
- Busca individual por ID
- Edição e exclusão de registros (Admin)
- Validação de dados obrigatórios

### ✔️ Gestão de Disciplinas
- Criação de disciplinas com nome e carga horária
- Listagem de todas as disciplinas disponíveis
- Busca específica por ID
- Edição e exclusão (Admin/Professor)

### ✔️ Gestão de Matrículas
- Criação de matrículas relacionando aluno e disciplina
- Sistema de notas (Nota 1 e Nota 2) com validação (0-10)
- Status automático baseado nas notas:
  - **PENDENTE:** Sem notas atribuídas
  - **APROVADA:** Média ≥ 6.0
  - **REPROVADA:** Média < 6.0
- Interface de atualização de notas para professores
- Histórico completo de matrículas por aluno

---

## 🚦 Controle de Acesso por Perfil

### 👨‍💼 ROLE_ADMIN
- **Acesso total** ao sistema
- Pode gerenciar alunos, professores, disciplinas e matrículas
- Pode atribuir e editar notas
- Pode excluir registros em todas as entidades

### 👨‍🏫 ROLE_PROFESSOR  
- Pode **visualizar e gerenciar** alunos e disciplinas
- Pode **listar matrículas** e **atualizar notas**
- Pode **buscar** informações por ID
- **Não pode** gerenciar outros professores
- **Não pode** excluir matrículas

### 🎓 ROLE_ALUNO
- Pode **apenas visualizar** seu próprio perfil
- Pode **buscar matrículas** por ID para consulta
- **Acesso limitado** às funcionalidades do sistema

---

## 🛑 Validações e Tratamento de Erros

### 📑 Validações de Formulários
- **Campos obrigatórios** em todos os formulários
- **Validação de email** com regex específico
- **Validação de senha** com comprimento mínimo
- **Validação de notas** entre 0 e 10
- **Feedback visual** para campos com erro
- **Mensagens específicas** para cada tipo de validação

### 🔗 Tratamento de Erros de API
- **Interceptor Axios** para tratamento uniforme de erros
- **Extração inteligente** de mensagens de erro do backend
- **Feedback visual** para estados de loading
- **Mensagens amigáveis** para diferentes tipos de erro
- **Recuperação automática** de tokens JWT

---

## 🧪 Testes

O projeto utiliza **Jest** e **React Testing Library** para testes abrangentes:

### 📊 Cobertura de Testes
- **Componentes de formulário:** Validação e submissão
- **Componentes genéricos:** Reutilização e props
- **Hooks customizados:** Lógica de negócio
- **Serviços de API:** Comunicação com backend
- **Páginas principais:** Integração de componentes

### 🚀 Scripts de Teste
```bash
npm run test           # Executa todos os testes
npm run test:coverage  # Gera relatório de cobertura
```
---

# 🌬️ Como Executar

### Pré-requisitos

- **Node.js** (v18 ou superior)  
- **npm** ou **yarn**  
- **Clone e configure o repositório do back-end** para funcionamento completo

## Passo a passo para Execução

### 1. Clone o repositório
```bash
# Clone o repositório do FRONTEND
git clone https://github.com/sylviavitoria/faculdade-frontend.git
cd faculdade-frontend
```
> ⚠️ Para a funcionalidade completa, é necessário configurar também o **BACKEND**.  
> Siga as instruções no repositório: [faculdade-backend](https://github.com/sylviavitoria/faculdade-backend)

### 2. Instale as dependências
```bash
npm install
```

### 3. Execute o projeto em modo de desenvolvimento
```bash
npm run dev
```

### 4. Acesse a aplicação
Abra seu navegador em: **[http://localhost:5173](http://localhost:5173)**

---

## 🔗 Integração com o Backend

Este projeto frontend consome a **API REST** desenvolvida em **Spring Boot** para gerenciamento acadêmico.  

- O backend está disponível em: [faculdade-backend](https://github.com/sylviavitoria/faculdade-backend)  
- A API fornece endpoints para:
  - Autenticação e autorização (JWT)
  - Gestão de Alunos, Professores, Disciplinas e Matrículas
  - Lançamento e consulta de notas
  - Logs do sistema (MongoDB)
  
> ⚠️ Para funcionalidade completa, configure e execute o backend antes de rodar o frontend.


## 🧪 Testes Automatizados com Cypress

Este frontend possui **testes automatizados com Cypress**, que validam os principais fluxos.  

Os testes garantem a qualidade e a confiabilidade, cobrindo cenários de sucesso e falha.
- A automação com Cypress está disponível em: [CypressFaculdade](https://github.com/sylviavitoria/CypressFaculdade)  
