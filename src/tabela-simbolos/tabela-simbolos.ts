import { SymbolEnum } from "../enums/simbolo.enum";
import { SymbolTableEntry } from "../interfaces/simbolo.interface";

export class SymbolTable {
  private simbolos: SymbolTableEntry[] = [];

  adicionarSimbolo(nome: string, tipo: SymbolEnum, linha: number): void {
    const simboloExistente = this.simbolos.find(
      (simbolo) => simbolo.nome === nome
    );

    if (!simboloExistente) {
      this.simbolos.push({ nome, tipo, linha });
    }
  }

  obterSimbolos(): SymbolTableEntry[] {
    return this.simbolos;
  }
}
