"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processarTokens = processarTokens;
function processarTokens(tokens, tabelaSimbolos) {
    let contextoAtual = null;
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        // Identificar declaração de classe
        if (token.type === "PALAVRA_CHAVE" && token.value === "class") {
            const identificador = tokens[i + 1]; // Próximo token deve ser o nome da classe
            if (identificador.type === "IDENTIFICADOR") {
                tabelaSimbolos.adicionar(identificador.value, "CLASSE", identificador.line);
                contextoAtual = "CLASSE";
                i++; // Pular o nome da classe
            }
        }
        // Identificar declaração de métodos
        if (token.type === "PALAVRA_CHAVE" &&
            (token.value === "void" ||
                token.value === "int" ||
                token.value === "String")) {
            const identificador = tokens[i + 1]; // Próximo token deve ser o nome do método
            if (identificador.type === "IDENTIFICADOR") {
                tabelaSimbolos.adicionar(identificador.value, "METODO", identificador.line);
                contextoAtual = "METODO";
                // Processar parâmetros do método
                let j = i + 2; // Avance para o próximo token depois do nome
                while (tokens[j] &&
                    tokens[j].type !== "SIMBOLO_ESPECIAL" &&
                    tokens[j].value !== "{") {
                    if (tokens[j].type === "PALAVRA_CHAVE" && // Tipo do parâmetro
                        (tokens[j].value === "int" ||
                            tokens[j].value === "String" ||
                            tokens[j].value === "boolean")) {
                        const param = tokens[j + 1]; // Nome do parâmetro
                        if (param && param.type === "IDENTIFICADOR") {
                            tabelaSimbolos.adicionar(param.value, "PARAMETRO", param.line);
                            j++; // Pular o nome do parâmetro
                        }
                    }
                    j++;
                }
                i = j - 1; // Atualizar índice para pular tokens processados
            }
        }
        // Identificar variáveis locais
        if (token.type === "PALAVRA_CHAVE" &&
            (token.value === "int" ||
                token.value === "String" ||
                token.value === "boolean")) {
            const identificador = tokens[i + 1]; // Próximo token deve ser o nome da variável
            if (identificador && identificador.type === "IDENTIFICADOR") {
                tabelaSimbolos.adicionar(identificador.value, "VARIAVEL", identificador.line);
                i++; // Pular o nome da variável
            }
        }
        // Identificar métodos externos (opcional, como System.out.println)
        if (token.type === "IDENTIFICADOR") {
            let value = token.value;
            let j = i + 1;
            // Combine identificadores conectados por '.'
            while (tokens[j] &&
                tokens[j].type === "DESCONHECIDO" &&
                tokens[j].value === ".") {
                const nextToken = tokens[j + 1];
                if (nextToken && nextToken.type === "IDENTIFICADOR") {
                    value += "." + nextToken.value;
                    j += 2;
                }
                else {
                    break;
                }
            }
            if (value.includes(".")) {
                tabelaSimbolos.adicionar(value, "METODO", token.line);
                i = j - 1; // Atualize o índice para pular os tokens processados
            }
        }
    }
}
