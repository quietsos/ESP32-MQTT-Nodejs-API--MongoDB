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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt_1 = __importDefault(require("mqtt"));
const dbConnection_1 = require("./dbConnection");
const esp32Schema_1 = require("./mongodSchema/esp32Schema");
let mqttConnection = mqtt_1.default.connect("mqtt://test.mosquitto.org");
let jsonTopic = 'esp32/json';
mqttConnection.on("connect", () => {
    mqttConnection.subscribe(jsonTopic);
    console.log("Successfully Subscribed");
});
mqttConnection.on('message', (topic, message) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(message.toString());
    let deviceData = message.toString();
    let funRes_MongoDB = yield saveDataInMongoDB(JSON.parse(deviceData));
    console.log(funRes_MongoDB);
}));
(0, dbConnection_1.mongoConn)();
function saveDataInMongoDB(inputJSON) {
    try {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield esp32Schema_1.esp32DataSchema.insertMany(inputJSON).then((result) => {
                if (result.length > 0) {
                    resolve({ statusCode: 100, message: "Saved in MongoDB" });
                }
                else {
                    reject({ statusCode: 201, message: "No data to insert" });
                }
            }).catch((e) => {
                reject({ statusCode: 400, message: e.message });
            });
        }));
    }
    catch (e) {
        console.log(e.message);
    }
}
//# sourceMappingURL=app.js.map