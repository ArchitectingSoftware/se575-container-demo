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
const loki = require("lokijs");
const pubsUrls = require("./urls.json");
const config = require("./config.json");
let app = new Koa();
let router = new Router();
//setup host and port optionally via the environment
const NODE_PORT = +process.env.PORT || 9100;
const NODE_HOST = process.env.HOST || '0.0.0.0';
const environment = process.env.NODE_ENV || 'development';
const envConfig = config[environment];
//Load the database
var db = new loki('my-app');
let urlC = db.addCollection('urls');
pubsUrls.map(u => urlC.insert(u));
router.get('/url/:pubKey', (http) => __awaiter(this, void 0, void 0, function* () {
    let pubId = http.params['pubKey'];
    let thisPub = urlC.findOne({ key: pubId });
    if (thisPub) {
        delete thisPub.meta;
        delete thisPub.$loki;
        http.response.body = thisPub;
    }
    else
        http.response.ctx.throw(404);
}));
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(envConfig.local_port);
console.log('Server started on port', envConfig.local_port);
//# sourceMappingURL=app.js.map