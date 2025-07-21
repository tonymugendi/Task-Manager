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
exports.default = taskRoutes;
const auth_1 = require("../middleware/auth");
const task_controller_1 = require("../controllers/task.controller");
function taskRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.post('/:boardId/lists/:listId/tasks', { preHandler: [auth_1.authenticate] }, task_controller_1.createTask);
        fastify.get('/:boardId/lists/:listId/tasks', { preHandler: [auth_1.authenticate] }, task_controller_1.getTasks);
        fastify.get('/:boardId/lists/:listId/tasks/:taskId', { preHandler: [auth_1.authenticate] }, task_controller_1.getTask);
        fastify.put('/:boardId/lists/:listId/tasks/:taskId', { preHandler: [auth_1.authenticate] }, task_controller_1.updateTask);
        fastify.delete('/:boardId/lists/:listId/tasks/:taskId', { preHandler: [auth_1.authenticate] }, task_controller_1.deleteTask);
    });
}
