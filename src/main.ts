import { readFileSync } from "fs";
import { Lexer } from "./lexer/lexer";
import { SymbolGenerator } from "./tabela-simbolos/symbol-generator";

const arquivo = "src/inputs.java";
const codigoFonte = readFileSync(arquivo, "utf-8");

// Gerar tokens
const lexer = new Lexer();
const tokens = lexer.analisarCodigo(codigoFonte);
console.log("Tokens gerados:");
console.table(tokens);

// Gerar tabela de símbolos
const symbolGenerator = new SymbolGenerator();
const tabelaDeSimbolos = symbolGenerator.gerarTabela(codigoFonte);
console.log("\nTabela de símbolos:");
console.table(tabelaDeSimbolos.obterSimbolos());
