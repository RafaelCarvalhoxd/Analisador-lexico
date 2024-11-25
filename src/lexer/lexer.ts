// Importações de tipos e interfaces
import { SymbolEnum } from "../enums/simbolo.enum";
import { TokenEnum } from "../enums/token.enum";
import { SymbolTableEntry } from "../interfaces/simbolo.interface";
import { Token } from "../interfaces/token.interface";
import { SymbolTable } from "../tabela-simbolos/tabela-simbolos";

export class Lexer {
  private palavrasReservadas = [
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

  private operadores = [
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

  private separadores = ["(", ")", "{", "}", "[", "]", ";", ",", "."];

  private tabelaDeSimbolos: SymbolTable;

  constructor() {
    this.tabelaDeSimbolos = new SymbolTable();
  }

  analisarCodigo(codigo: string): Token[] {
    const tokens: Token[] = []; // Lista que armazenará os tokens gerados
    const linhas = codigo.split("\n"); // Separa o código em linhas
    let contextoAtual: SymbolEnum | null = null; // Contexto atual para identificar variáveis, classes, funções, etc.
    const contextoPilha: SymbolEnum[] = []; // Pilha para armazenar contextos ao entrar e sair de funções ou blocos

    linhas.forEach((linha, numeroLinha) => {
      const regex =
        /(".*?")|\/\/.*$|\/\*[\s\S]*?\*\/|[\w]+|[+-/*=<>!&|]+|[(){}\[\];,.\s]/g;

      const matches = linha.matchAll(regex);

      // Para cada correspondência encontrada (cada token possível)
      for (const match of matches) {
        const valor = match[0]; // O valor do token encontrado
        const coluna = match.index ?? 0; // A posição do token na linha

        // Se o valor for vazio (apenas espaços ou quebras de linha), ignora
        if (valor.trim() === "") continue;

        let tipo: TokenEnum;

        // Verifica se o valor é uma palavra reservada (por exemplo, 'class', 'int', etc.)
        if (this.palavrasReservadas.includes(valor)) {
          tipo = TokenEnum.PALAVRA_RESERVADA;

          // Ajusta o contexto dependendo da palavra reservada
          if (["int", "double", "String", "void"].includes(valor)) {
            contextoAtual = SymbolEnum.VARIAVEL; // Quando chega uma palavra reservada de tipo, define o contexto como variáveis
          } else if (valor === "class") {
            contextoAtual = SymbolEnum.CLASSE; // Quando encontrar 'class', define o contexto como CLASSE
          }
        }
        // Verifica se o valor é um operador (como '+', '-', '==', etc.)
        else if (this.operadores.includes(valor)) {
          tipo = TokenEnum.OPERADOR;
        }
        // Verifica se o valor é um separador (como parênteses, chaves, vírgulas, etc.)
        else if (this.separadores.includes(valor)) {
          tipo = TokenEnum.SEPARADOR;

          // Detecta a abertura de parâmetros ou blocos (como ao encontrar '(')
          if (valor === "(") {
            contextoPilha.push(contextoAtual ?? SymbolEnum.INDEFINIDO); // Salva o contexto atual na pilha
            if (contextoAtual === SymbolEnum.VARIAVEL) {
              contextoAtual = SymbolEnum.PARAMETRO; // Se for uma variável, trata como parâmetro
            }
          }

          // Detecta o fechamento de parâmetros ou blocos (como ao encontrar ')')
          if (valor === ")" && contextoPilha.length > 0) {
            contextoAtual = contextoPilha.pop() ?? null; // Restaura o contexto ao fechar parênteses
          }
        }
        // Verifica se o valor é um número inteiro
        else if (/^\d+$/.test(valor)) {
          tipo = TokenEnum.NUMERO;
        }
        // Verifica se o valor é uma string (entre aspas)
        else if (/^".*"$/.test(valor)) {
          tipo = TokenEnum.STRING;
        }
        // Verifica se o valor é um identificador (nome de variável, função, etc.)
        else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(valor)) {
          tipo = TokenEnum.IDENTIFICADOR;

          // Define o tipo do identificador com base no contexto atual
          let tipoSimbolo = SymbolEnum.INDEFINIDO;

          if (valor === "main") {
            tipoSimbolo = SymbolEnum.FUNCAO;
          } else if (contextoAtual === SymbolEnum.CLASSE) {
            tipoSimbolo = SymbolEnum.CLASSE;
          } else if (contextoAtual === SymbolEnum.VARIAVEL) {
            tipoSimbolo = SymbolEnum.VARIAVEL;
          } else if (contextoAtual === SymbolEnum.PARAMETRO) {
            tipoSimbolo = SymbolEnum.PARAMETRO;
          }

          this.tabelaDeSimbolos.adicionarSimbolo(
            valor,
            tipoSimbolo,
            numeroLinha + 1
          );

          // Reseta o contexto para variáveis locais ou indefinido
          if (contextoAtual !== SymbolEnum.PARAMETRO) {
            contextoAtual = null;
          }
        } else if (/^\/\/.*$/.test(valor) || /^\/\*[\s\S]*\*\/$/.test(valor)) {
          tipo = TokenEnum.COMENTARIO;
        } else {
          tipo = TokenEnum.DESCONHECIDO;
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

  obterTabelaDeSimbolos(): SymbolTableEntry[] {
    return this.tabelaDeSimbolos.obterSimbolos();
  }
}
