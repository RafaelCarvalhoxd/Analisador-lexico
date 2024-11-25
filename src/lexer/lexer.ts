import { TokenEnum } from "../enums/token.enum";
import { Token } from "../interfaces/token.interface";

export class Lexer {
  private tokens: Token[];

  constructor() {
    this.tokens = [];
  }

  analisarCodigo(codigo: string): Token[] {
    const linhas = codigo.split("\n");
    let linhaAtual = 1;

    for (const linha of linhas) {
      const caracteres = linha
        .split(
          /(\s+|[;,.{}()\[\]]|["'].*?["']|\d+|\w+|==|!=|<=|>=|\+|-|\*|\/)/g
        )
        .filter((x) => x.trim() !== "");

      let colunaAtual = 1;

      for (const caractere of caracteres) {
        const token = this.analisarCaractere(
          caractere,
          linhaAtual,
          colunaAtual
        );
        if (token) this.tokens.push(token);

        colunaAtual += caractere.length + 1;
      }

      linhaAtual++;
    }

    return this.tokens;
  }

  private analisarCaractere(
    caractere: string,
    linha: number,
    coluna: number
  ): Token | null {
    const palavrasReservadas = [
      "public",
      "static",
      "void",
      "class",
      "float",
      "int",
      "String",
    ];
    if (palavrasReservadas.includes(caractere)) {
      return {
        tipo: TokenEnum.PALAVRA_RESERVADA,
        valor: caractere,
        linha,
        coluna,
      };
    }

    if (/^[a-zA-Z_]\w*$/.test(caractere)) {
      return { tipo: TokenEnum.IDENTIFICADOR, valor: caractere, linha, coluna };
    }

    if (/^\d+(\.\d+)?$/.test(caractere)) {
      return { tipo: TokenEnum.NUMERO, valor: caractere, linha, coluna };
    }

    if (/^["'].*["']$/.test(caractere)) {
      return { tipo: TokenEnum.STRING, valor: caractere, linha, coluna };
    }

    const operadores = [
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
    ];
    if (operadores.includes(caractere)) {
      return { tipo: TokenEnum.OPERADOR, valor: caractere, linha, coluna };
    }

    const separadores = [";", ",", ".", "{", "}", "(", ")", "[", "]"];
    if (separadores.includes(caractere)) {
      return { tipo: TokenEnum.SEPARADOR, valor: caractere, linha, coluna };
    }

    if (/^\s+$/.test(caractere)) {
      return null;
    }

    return { tipo: TokenEnum.DESCONHECIDO, valor: caractere, linha, coluna };
  }
}
