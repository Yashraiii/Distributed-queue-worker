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
const taskQueue_1 = require("./queues/taskQueue");
const fun = () => __awaiter(void 0, void 0, void 0, function* () {
    yield taskQueue_1.taskQueue.add('process-payment', {
        orderId: "order_999",
        amount: 1000,
        customerEmail: "raiyas2002@gmail.com"
    });
    yield taskQueue_1.taskQueue.add('process-payment', {
        orderId: "order_999",
        amount: 1000,
        customerEmail: "raiyas2002@gmail.com"
    });
    console.log("Both jobs added! Check your worker terminal.");
    process.exit(0);
});
fun();
