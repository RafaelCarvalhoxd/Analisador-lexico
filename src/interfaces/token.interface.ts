import { TokenEnum } from "../enums/token.enum";

export interface Token {
  tipo: TokenEnum;
  valor: string;
  linha: number;
  coluna: number;
}
