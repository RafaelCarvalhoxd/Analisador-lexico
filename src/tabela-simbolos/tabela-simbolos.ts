import { SymbolEnum } from "../enums/simbolo.enum";
import { SymbolTableEntry } from "../interfaces/simbolo.interface";

export class SymbolTable {
  private simbolos: SymbolTableEntry[] = [];

  // Adiciona um símbolo à tabela, caso ele não exista
  adicionarSimbolo(nome: string, tipo: SymbolEnum, linha: number): void {
    const simboloExistente = this.simbolos.find(
      (simbolo) => simbolo.nome === nome
    );
    if (!simboloExistente) {
      this.simbolos.push({ nome, tipo, linha });
    }
  }

  // Obtém todos os símbolos da tabela
  obterSimbolos(): SymbolTableEntry[] {
    return this.simbolos;
  }
}
