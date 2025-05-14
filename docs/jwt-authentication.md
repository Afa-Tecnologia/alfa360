# Documentação do Sistema de Autenticação JWT

## Visão Geral

Este documento descreve o sistema de autenticação JWT (JSON Web Token) implementado na aplicação AlfaManager. O sistema utiliza cookies HTTP-only para armazenar de forma segura tokens de acesso e refresh com um mecanismo robusto de renovação de tokens.

## Stack Tecnológica

- **Backend**: Laravel com o pacote JWT-Auth
- **Frontend**: Next.js com Context API para gerenciamento de estado
- **Armazenamento de Tokens**: Cookies HTTP-only
- **Tipos de Tokens**: Token de acesso (curta duração) e Token de refresh (longa duração)

## Fluxo de Autenticação

![Fluxo de Autenticação](https://mermaid.ink/img/pako:eNqFksFuwjAMhl8l8mnTUO-VEBIbQluZxo07pMZrRJu4SlxgVdl7b1oQDDRtn-T_-_3ZlnNUxiGqUNuD4-ZN-GCZgG9Gxlj76OkKl0_wZoT2CdJB4_S5bZa8uBj25v3rHhxmPG0P7qjb3T_E6lzvvR3Aa9DUOGzAuYR5-SSZ6K63QUedJ-FPoJjISB-VFbBjCjEJalYGVjDa6AFQszW4UWbYOwtJC-J1Vn3KU5p2cKx1j5D5gIcPSNMgHKn0ZSPd1vDXFOMnTrxW0vSEtYmxU-mLcDLMGRV-aVQ0rJqIcE8JZvMWvRZfaKV0Qa-_1LJl_JYSZ_2jqulLnuSre1bUYLMo82U-y9KbnNIsybJrpz9w9qhQNFg52ZC_NDMUwcqQ2CzXpUYVZNZbFJJVyPhCcx-5Cj-dxQ18v7lXpWVbSVV_wT_X5Q1VG-cBxlFZ4FodRa1Rvc9uZ7ezaZ5W-fJ8UVdZWuXVdL2uqnS9zK_-ADVDtGs?type=png)

### 1. Registro de Usuário (Signup)

- Usuário envia dados de registro (nome, email, senha)
- Backend valida os dados
- Senha é criptografada e armazenada
- Conta de usuário é criada

### 2. Processo de Login

1. **Usuário envia credenciais**:
   - Email e senha são enviados para o endpoint `/login`
2. **Autenticação no backend**:
   - Valida as credenciais
   - Gera dois tokens JWT:
     - Token de acesso (validade de 15 minutos)
     - Token de refresh (validade de 7 dias)
   - Define cookies HTTP-only com esses tokens
3. **Resposta para o frontend**:
   - Retorna detalhes do usuário
   - Frontend atualiza o contexto de autenticação

### 3. Requisições Autenticadas

1. **Fazendo chamadas API**:
   - A instância Axios inclui `withCredentials: true` para enviar cookies
   - O token JWT é automaticamente incluído nos cookies
2. **Verificação de requisição**:
   - `JwtMiddleware` extrai o token dos cookies ou cabeçalho Authorization
   - Valida o token e autentica o usuário
   - Permite acesso aos recursos protegidos se válido

### 4. Processo de Renovação de Token

1. **Renovação automática de token**:
   - Interceptor Axios captura erros 401
   - Chama o endpoint `/refresh` com o cookie do token de refresh
2. **Tratamento de refresh no backend**:
   - Valida o token de refresh
   - Emite novo token de acesso
   - Atualiza o cookie
3. **Fila de requisições**:
   - Requisições falhas são colocadas em fila durante o refresh
   - Repetidas automaticamente após a renovação do token

### 5. Processo de Logout

1. **Frontend chama o endpoint de logout**
2. **Backend limpa a autenticação**:
   - Invalida os tokens
   - Limpa os cookies
3. **Frontend atualiza o estado**:
   - Limpa os dados do usuário
   - Redireciona para a página de login

## Recursos de Segurança

1. **Cookies HTTP-only**:

   - Tokens não podem ser acessados por JavaScript
   - Protegidos contra ataques XSS

2. **Tokens de acesso de curta duração**:

   - Tokens de acesso expiram após 15 minutos
   - Minimiza danos se o token for comprometido

3. **Mecanismo de renovação de token**:

   - Tokens de refresh de longa duração (7 dias)
   - Proporciona experiência de usuário sem interrupções
   - Permite revogação de sessão

4. **Rotas protegidas**:
   - Backend: Rotas protegidas com middleware `jwt.auth`
   - Frontend: Rotas protegidas com contexto de autenticação

## Endpoints da API

| Endpoint   | Método | Descrição                          | Autenticação Necessária |
| ---------- | ------ | ---------------------------------- | ----------------------- |
| `/signup`  | POST   | Registrar novo usuário             | Não                     |
| `/login`   | POST   | Autenticar usuário e emitir tokens | Não                     |
| `/refresh` | POST   | Renovar token de acesso            | Sim (Token de refresh)  |
| `/logout`  | POST   | Invalidar tokens e encerrar sessão | Sim                     |
| `/me`      | GET    | Obter dados do usuário autenticado | Sim                     |

## Implementação no Backend

### Configuração JWT

Os tokens JWT são configurados em `config/jwt.php`:

- TTL do token de acesso: 15 minutos
- TTL do token de refresh: 7 dias
- Algoritmo: HS256 (padrão)
- Chave secreta: Definida no .env como JWT_SECRET

### JwtMiddleware

O `JwtMiddleware` trata da validação do token e autenticação do usuário:

- Extrai o token do cookie ou cabeçalho Authorization
- Verifica o token usando JWTAuth
- Trata exceções de token (expirado, inválido)
- Define o usuário autenticado para a requisição

### UserAuthController

Métodos principais:

- `login()`: Autentica o usuário e emite tokens
- `refresh()`: Emite novo token de acesso usando token de refresh
- `logout()`: Invalida tokens e limpa cookies
- `me()`: Retorna dados do usuário autenticado

## Implementação no Frontend

### Cliente API

A instância Axios em `api.ts` é configurada com:

- `withCredentials: true` para enviar/receber cookies
- Interceptor para lidar com a renovação automática de tokens

### Contexto de Autenticação

O `AuthContext` gerencia o estado de autenticação:

- Fornece informações do usuário em toda a aplicação
- Trata operações de login e logout
- Verifica a autenticação no carregamento inicial

### Rotas Protegidas

Rotas que requerem autenticação são envolvidas com:

- Verificação de autenticação
- Redirecionamento para login se não autenticado

## Melhores Práticas Implementadas

1. **Separação de tokens**:

   - Tokens de acesso de curta duração para acesso à API
   - Tokens de refresh de longa duração para persistência de sessão

2. **Armazenamento de tokens**:

   - Cookies HTTP-only impedem acesso por JavaScript
   - Mitiga riscos de vulnerabilidades XSS

3. **Renovação automática**:

   - Experiência de usuário sem interrupções
   - Fila de requisições durante renovação

4. **Padrões seguros**:
   - Tempos de expiração de tokens seguem melhores práticas de segurança
   - Flags HTTP-only e Secure para cookies em produção

## Conclusão

Este sistema de autenticação JWT fornece um mecanismo de autenticação seguro e eficiente com várias vantagens principais:

- **Segurança**: Protegido contra ataques comuns com cookies HTTP-only
- **Experiência do Usuário**: Renovação de token sem interrupções, sem necessidade de relogin
- **Desempenho**: Autenticação stateless reduz carga no banco de dados
- **Confiabilidade**: Tratamento robusto de erros e gerenciamento de tokens
