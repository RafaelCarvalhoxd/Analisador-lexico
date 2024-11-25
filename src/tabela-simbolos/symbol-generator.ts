import { SymbolEnum } from "../enums/simbolo.enum";
import { SymbolTable } from "./tabela-simbolos";

export class SymbolGenerator {
  private tabelaDeSimbolos: SymbolTable;

  constructor() {
    this.tabelaDeSimbolos = new SymbolTable();
  }

  gerarTabela(codigo: string): SymbolTable {
    const linhas = codigo.split("\n");
    let linhaAtual = 1;

    for (const linha of linhas) {
      const caracteres = linha
        .split(
          /(\s+|[;,.{}()\[\]]|["'].*?["']|\d+|\w+|==|!=|<=|>=|\+|-|\*|\/)/g
        )
        .filter((x) => x.trim() !== "");

      for (let i = 0; i < caracteres.length; i++) {
        const caractere = caracteres[i];
        this.analisarCaractere(caractere, linhaAtual, caracteres, i);
      }

      linhaAtual++;
    }

    return this.tabelaDeSimbolos;
  }

  private analisarCaractere(
    caractere: string,
    linha: number,
    contexto: string[],
    index: number
  ): void {
    if (caractere === "/" && contexto[index + 1] === "/") {
      return;
    }

    if (caractere === "/" && contexto[index + 1] === "*") {
      let i = index + 2;
      while (
        i < contexto.length &&
        !(contexto[i] === "*" && contexto[i + 1] === "/")
      ) {
        i++;
      }
      return;
    }
    // Palavras reservadas (não adicionadas à tabela de símbolos)
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
      return;
    }

    // Classes (primeira letra maiúscula)
    if (/^[A-Z]/.test(caractere) && /^[a-zA-Z_]\w*$/.test(caractere)) {
      this.tabelaDeSimbolos.adicionarSimbolo(
        caractere,
        SymbolEnum.CLASSE,
        linha
      );
      return;
    }

    // Funções (seguidas por parênteses)
    if (/^[a-zA-Z_]\w*$/.test(caractere) && contexto[index + 1] === "(") {
      this.tabelaDeSimbolos.adicionarSimbolo(
        caractere,
        SymbolEnum.FUNCAO,
        linha
      );
      return;
    }

    // Variáveis (não reservadas, nem seguidas por parênteses)
    if (/^[a-zA-Z_]\w*$/.test(caractere)) {
      this.tabelaDeSimbolos.adicionarSimbolo(
        caractere,
        SymbolEnum.VARIAVEL,
        linha
      );
    }
  }
}
