"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const lexer_1 = require("./lexer/lexer");
// Lê o arquivo de entrada
const arquivo = "src/inputs.java"; // Nome do arquivo de entrada
const codigoFonte = (0, fs_1.readFileSync)(arquivo, "utf-8");
// Cria uma instância do Lexer e analisa o código-fonte
const lexer = new lexer_1.Lexer();
const tokens = lexer.analisarCodigo(codigoFonte);
const tabelaDeSimbolos = lexer.obterTabelaDeSimbolos();
console.log("Tokens gerados:");
console.table(tokens);
console.log("\nTabela de símbolos:");
console.table(tabelaDeSimbolos);
