"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const Router = require("koa-router");
const paperDB_1 = require("./paperDB");
const axios_1 = require("axios");
const config = require("./config.json");
let app = new Koa();
let router = new Router();
//setup host and port optionally via the environment
const NODE_PORT = process.env.PORT || 8080;
const NODE_HOST = process.env.HOST || '0.0.0.0';
const environment = process.env.NODE_ENV || 'development';
const envConfig = config[environment];
router.get('/publications', (http) => __awaiter(this, void 0, void 0, function* () {
    http.response.body = paperDB_1.PaperDB;
}));
router.get('/publications/:id', (http) => __awaiter(this, void 0, void 0, function* () {
    let id = http.params['id'];
    //http.response.body = http.params['id']
    let paper = paperDB_1.PaperDB.find(p => p.id == id);
    if (paper)
        http.response.body = paper;
    else
        http.response.ctx.throw(404);
}));
function getRemoteUrlData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(url);
            return response.data;
        }
        catch (error) {
            console.log('Error from fetching url data ', error);
            return null;
        }
    });
}
router.get('/publications/:id/location', (http) => __awaiter(this, void 0, void 0, function* () {
    let id = http.params['id'];
    let paper = paperDB_1.PaperDB.find(p => p.id == id);
    if (paper) {
        const remoteUrl = "http://" + envConfig.code_host + ":" + envConfig.code_port + "/url/" + paper.code;
        let rData = yield getRemoteUrlData(remoteUrl);
        paper.meta = rData;
        http.response.body = paper;
    }
    else
        http.response.ctx.throw(404);
}));
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(envConfig.local_port);
console.log('Server started on port', envConfig.local_port);
//# sourceMappingURL=app.js.map