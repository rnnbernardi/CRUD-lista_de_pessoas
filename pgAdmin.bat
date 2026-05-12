@echo off
set PG_PATH="C:\Program Files\PostgreSQL\16\bin\psql.exe"
set PGUSER=postgres
set PGPASSWORD=SUA_SENHA_AQUI
set PGDATABASE=NOME_DO_SEU_BANCO

echo Criando tabelas...
%PG_PATH% -h localhost -U %PGUSER% -d %PGDATABASE% -f criatabelas.sql

echo Abrindo pgAdmin...
start "" "C:\Program Files\PostgreSQL\16\pgAdmin 4\bin\pgAdmin4.exe"

exit