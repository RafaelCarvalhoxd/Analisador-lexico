import { readFileSync } from "fs";
import { Lexer } from "./lexer/lexer";

const arquivo = "src/inputs.java";
const codigoFonte = readFileSync(arquivo, "utf-8");

const lexer = new Lexer();
const tokens = lexer.analisarCodigo(codigoFonte);
const tabelaDeSimbolos = lexer.obterTabelaDeSimbolos();

console.log("Tokens gerados:");
console.table(tokens);

console.log("\nTabela de símbolos:");
console.table(tabelaDeSimbolos);
