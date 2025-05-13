# Tutorial para Configurar e Executar a API Laravel Localmente

## 1. Instalação do PHP

1. Baixe o PHP para Windows em [windows.php.net/download](https://windows.php.net/download/)

   - Escolha a versão 8.4.3 (Thread Safe) x64

2. Extraia o arquivo para `C:\php`

3. Copie `php.ini-development` para `php.ini` e abra para editar:

   - Descomente `extension_dir = "ext"`
   - Descomente extensões necessárias: `sqlite3`, `pdo_sqlite`, `openssl`, `mbstring`, `fileinfo`

4. Adicione PHP ao PATH:
   - Abra Painel de Controle → Sistema → Configurações avançadas do sistema → Variáveis de Ambiente
   - Adicione `C:\php` ao PATH

## 2. Instalação do Composer

1. Baixe e execute o instalador em [getcomposer.org/download](https://getcomposer.org/download/)
2. Siga as instruções do instalador (certifique-se que o PHP está no PATH)

## 3. Configuração do Projeto Laravel

1. Clone o repositório (se ainda não tiver feito):

   ```
   git clone https://github.com/seurepositorio/alfamanager.git
   cd alfamanager-main
   ```

2. Navegue até a pasta backend do projeto:

   ```
   cd alfamanager-main/backend
   ```

3. Instale as dependências do Laravel com Composer:

   ```
   composer install
   ```

4. Configure o arquivo de ambiente:

   - Copie o arquivo `.env.example` para `.env`
   - Configure para usar SQLite:

   ```
   DB_CONNECTION=sqlite
   # Remova ou comente as demais linhas DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
   ```

   - Crie um arquivo SQLite vazio:

   ```
   touch database/database.sqlite
   ```

5. Gere a chave de aplicação:
   ```
   php artisan key:generate
   ```

## 4. Configuração do Banco de Dados

1. Não é necessário instalar nenhum software de banco de dados adicional, pois o SQLite já está incluído com o PHP!

2. Execute as migrations para criar as tabelas:

   ```
   php artisan migrate
   ```

3. Execute as seeds para popular o banco de dados com dados iniciais:
   ```
   php artisan db:seed
   ```

## 5. Executando o Servidor Backend

1. Inicie o servidor Laravel:

   ```
   php artisan serve
   ```

   O servidor estará rodando em `http://localhost:8000`

## 6. Executando o Projeto Completo

Depois que o backend estiver configurado, você pode usar o script Ligar.js para iniciar o projeto inteiro:

1. Navegue até a pasta raiz do projeto:

   ```
   cd ..
   ```

2. Instale as dependências do Node:

   ```
   npm install
   ```

3. Execute o script para iniciar o projeto:
   ```
   node Ligar.js
   ```

Este script configurará e iniciará tanto o backend quanto o frontend automaticamente.

## Verificação

Para verificar se tudo está funcionando:

- Backend: acesse `http://localhost:8000/api/[endpoint]`
- Frontend: acesse `http://localhost:3000` (ou a porta configurada)

Pronto! Agora você tem o ambiente de desenvolvimento completo rodando localmente com SQLite, sem necessidade de instalar um servidor de banco de dados separado.
