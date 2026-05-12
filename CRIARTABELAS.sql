CREATE TABLE IF NOT EXISTS pessoas(
    id SERIAL PRIMARY KEY,
    identificacao VARCHAR(50),
    nome VARCHAR(50),
    email VARCHAR(50),
    cpf VARCHAR(11),
    telefone VARCHAR(20),
    data_nascimento date,
    criado_em timestamp without time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS enderecos (
    pessoa_id INT PRIMARY KEY REFERENCES pessoas(id),
    logradouro VARCHAR(50),
    municipio VARCHAR(50),
    estado VARCHAR(20),
    cep VARCHAR(10),
    tipo VARCHAR(20),
    numero VARCHAR(10),
    bairro VARCHAR(50)
);