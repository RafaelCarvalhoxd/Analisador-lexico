import { readFileSync } from "fs";
import { Lexer } from "./lexer/lexer";

// Lê o arquivo de entrada
const arquivo = "src/inputs.java"; // Nome do arquivo de entrada
const codigoFonte = readFileSync(arquivo, "utf-8");

// Cria uma instância do Lexer e analisa o código-fonte
const lexer = new Lexer();
const tokens = lexer.analisarCodigo(codigoFonte);
const tabelaDeSimbolos = lexer.obterTabelaDeSimbolos();

console.log("Tokens gerados:");
console.table(tokens);

console.log("\nTabela de símbolos:");
console.table(tabelaDeSimbolos);
