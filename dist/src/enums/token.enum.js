"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenEnum = void 0;
var TokenEnum;
(function (TokenEnum) {
    TokenEnum["PALAVRA_RESERVADA"] = "PALAVRA_RESERVADA";
    TokenEnum["IDENTIFICADOR"] = "IDENTIFICADOR";
    TokenEnum["NUMERO"] = "NUMERO";
    TokenEnum["STRING"] = "STRING";
    TokenEnum["OPERADOR"] = "OPERADOR";
    TokenEnum["SEPARADOR"] = "SEPARADOR";
    TokenEnum["SIMBOLO"] = "SIMBOLO";
    TokenEnum["ESPACO"] = "ESPACO";
    TokenEnum["DESCONHECIDO"] = "DESCONHECIDO";
    TokenEnum["COMENTARIO"] = "COMENTARIO";
})(TokenEnum || (exports.TokenEnum = TokenEnum = {}));
