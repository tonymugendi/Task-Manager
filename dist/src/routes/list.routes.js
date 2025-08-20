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
exports.default = listRoutes;
const auth_1 = require("../middleware/auth");
const list_controller_1 = require("../controllers/list.controller");
function listRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.post('/:boardId/lists', { preHandler: [auth_1.authenticate] }, list_controller_1.createList);
        fastify.get('/:boardId/lists', { preHandler: [auth_1.authenticate] }, list_controller_1.getLists);
        fastify.get('/:boardId/lists/:listId', { preHandler: [auth_1.authenticate] }, list_controller_1.getList);
        fastify.put('/:boardId/lists/:listId', { preHandler: [auth_1.authenticate] }, list_controller_1.updateList);
        fastify.delete('/:boardId/lists/:listId', { preHandler: [auth_1.authenticate] }, list_controller_1.deleteList);
    });
}
