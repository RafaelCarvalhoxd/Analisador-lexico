import { SymbolEnum } from "../enums/simbolo.enum";

export interface SymbolTableEntry {
  nome: string;
  tipo: SymbolEnum;
  linha: number;
}
