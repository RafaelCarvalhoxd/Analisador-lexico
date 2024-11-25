"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolTable = void 0;
class SymbolTable {
    constructor() {
        this.simbolos = [];
    }
    // Adiciona um símbolo à tabela, caso ele não exista
    adicionarSimbolo(nome, tipo, linha) {
        const simboloExistente = this.simbolos.find((simbolo) => simbolo.nome === nome);
        if (!simboloExistente) {
            this.simbolos.push({ nome, tipo, linha });
        }
    }
    // Obtém todos os símbolos da tabela
    obterSimbolos() {
        return this.simbolos;
    }
}
exports.SymbolTable = SymbolTable;
