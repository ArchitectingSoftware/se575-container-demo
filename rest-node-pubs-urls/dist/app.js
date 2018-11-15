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
//setup environment
const environment = process.env.NODE_ENV || 'development';
let envConfig = config[environment];
if (!envConfig) {
    let msg = "Cant find the desired configuration for environment variable NODE_ENV " +
        "that is currently set to " + process.env.NODE_ENV + " using environment " +
        "for development as default.  If you think this might be incorrect please " +
        "check and likely adjust the config.json file.";
    console.log(msg);
    envConfig = config['development'];
}
console.log('Using this configuration: ', envConfig);
//Load the database
var db = new loki('my-app');
let urlC = db.addCollection('urls');
pubsUrls.map(u => urlC.insert(u));
//implement the API
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
//setup the middleware and run the server
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(envConfig.local_port);
console.log('Server started on port', envConfig.local_port);
//# sourceMappingURL=app.js.map