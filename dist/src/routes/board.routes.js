"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = boardRoutes;
const board_controller_1 = require("../controllers/board.controller");
const auth_1 = require("../middleware/auth");
function boardRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.post('/boards', { preHandler: auth_1.authenticate }, board_controller_1.createBoard);
        fastify.get('/boards', { preHandler: auth_1.authenticate }, board_controller_1.getBoards);
        fastify.get('/boards/:id', { preHandler: auth_1.authenticate }, board_controller_1.getBoard);
        fastify.put('/boards/:id', { preHandler: auth_1.authenticate }, board_controller_1.updateBoard);
        fastify.delete('/boards/:id', { preHandler: auth_1.authenticate }, board_controller_1.deleteBoard);
    });
}
