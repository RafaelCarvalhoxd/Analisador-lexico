"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = void 0;
const simbolo_enum_1 = require("../enums/simbolo.enum");
const token_enum_1 = require("../enums/token.enum");
const tabela_simbolos_1 = require("../tabela-simbolos/tabela-simbolos");
class Lexer {
    constructor() {
        this.palavrasReservadas = [
            "class",
            "public",
            "private",
            "protected",
            "static",
            "void",
            "int",
            "double",
            "String",
            "if",
            "else",
            "while",
            "for",
            "return",
            "new",
        ];
        this.operadores = [
            "+",
            "-",
            "*",
            "/",
            "=",
            "==",
            "!=",
            "<",
            ">",
            "<=",
            ">=",
            "&&",
            "||",
            "!",
        ];
        this.separadores = ["(", ")", "{", "}", "[", "]", ";", ",", "."];
        this.tabelaDeSimbolos = new tabela_simbolos_1.SymbolTable();
    }
    analisarCodigo(codigo) {
        const tokens = [];
        const linhas = codigo.split("\n");
        let contextoAtual = null; // Contexto atual do identificador
        const contextoPilha = []; // Pilha para gerenciar contextos
        linhas.forEach((linha, numeroLinha) => {
            const regex = /(".*?")|\/\/.*$|\/\*[\s\S]*?\*\/|[\w]+|[+-/*=<>!&|]+|[(){}\[\];,.\s]/g;
            const matches = linha.matchAll(regex);
            for (const match of matches) {
                const valor = match[0];
                const coluna = match.index ?? 0;
                if (valor.trim() === "")
                    continue;
                let tipo;
                if (this.palavrasReservadas.includes(valor)) {
                    tipo = token_enum_1.TokenEnum.PALAVRA_RESERVADA;
                    // Ajusta contexto com base na palavra reservada
                    if (["int", "double", "String", "void"].includes(valor)) {
                        contextoAtual = simbolo_enum_1.SymbolEnum.VARIAVEL; // Quando chega uma palavra reservada de tipo, define como variáveis
                    }
                    else if (valor === "class") {
                        contextoAtual = simbolo_enum_1.SymbolEnum.CLASSE; // Se for class, muda para CLASSE
                    }
                }
                else if (this.operadores.includes(valor)) {
                    tipo = token_enum_1.TokenEnum.OPERADOR;
                }
                else if (this.separadores.includes(valor)) {
                    tipo = token_enum_1.TokenEnum.SEPARADOR;
                    // Detecta abertura de parâmetros ou bloco
                    if (valor === "(") {
                        contextoPilha.push(contextoAtual ?? simbolo_enum_1.SymbolEnum.INDEFINIDO);
                        if (contextoAtual === simbolo_enum_1.SymbolEnum.VARIAVEL) {
                            contextoAtual = simbolo_enum_1.SymbolEnum.PARAMETRO; // Ao abrir parênteses, se for uma variável, trata como parâmetro
                        }
                    }
                    // Detecta fechamento de parâmetros ou bloco
                    if (valor === ")" && contextoPilha.length > 0) {
                        contextoAtual = contextoPilha.pop() ?? null; // Restaura o contexto ao fechar parênteses
                    }
                }
                else if (/^\d+$/.test(valor)) {
                    tipo = token_enum_1.TokenEnum.NUMERO;
                }
                else if (/^".*"$/.test(valor)) {
                    tipo = token_enum_1.TokenEnum.STRING;
                }
                else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(valor)) {
                    tipo = token_enum_1.TokenEnum.IDENTIFICADOR;
                    // Define o tipo do identificador
                    let tipoSimbolo = simbolo_enum_1.SymbolEnum.INDEFINIDO;
                    if (valor === "main") {
                        tipoSimbolo = simbolo_enum_1.SymbolEnum.FUNCAO; // main é uma função
                    }
                    else if (contextoAtual === simbolo_enum_1.SymbolEnum.CLASSE) {
                        tipoSimbolo = simbolo_enum_1.SymbolEnum.CLASSE; // Se estiver dentro de uma classe, marca como CLASSE
                    }
                    else if (contextoAtual === simbolo_enum_1.SymbolEnum.VARIAVEL) {
                        tipoSimbolo = simbolo_enum_1.SymbolEnum.VARIAVEL; // Variáveis locais são tratadas como VARIAVEL
                    }
                    else if (contextoAtual === simbolo_enum_1.SymbolEnum.PARAMETRO) {
                        tipoSimbolo = simbolo_enum_1.SymbolEnum.PARAMETRO; // Parâmetros são tratados como PARAMETRO
                    }
                    this.tabelaDeSimbolos.adicionarSimbolo(valor, tipoSimbolo, numeroLinha + 1);
                    // Reseta o contexto para variáveis locais ou indefinido
                    if (contextoAtual !== simbolo_enum_1.SymbolEnum.PARAMETRO) {
                        contextoAtual = null;
                    }
                }
                else if (/^\/\/.*$/.test(valor) || /^\/\*[\s\S]*\*\/$/.test(valor)) {
                    tipo = token_enum_1.TokenEnum.COMENTARIO;
                }
                else {
                    tipo = token_enum_1.TokenEnum.DESCONHECIDO;
                }
                tokens.push({
                    tipo,
                    valor,
                    linha: numeroLinha + 1,
                    coluna: coluna + 1,
                });
            }
        });
        return tokens;
    }
    obterTabelaDeSimbolos() {
        return this.tabelaDeSimbolos.obterSimbolos();
    }
}
exports.Lexer = Lexer;
