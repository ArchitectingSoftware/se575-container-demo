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
const Koa = require("koa");
const Router = require("koa-router");
const paperDB_1 = require("./paperDB");
const axios_1 = require("axios");
const config = require("./config.json");
let app = new Koa();
let router = new Router();
// Environmental Setup
const environment = process.env.NODE_ENV || 'development';
let envConfig = config[environment.toLowerCase()];
if (!envConfig) {
    let msg = "Cant find the desired configuration for environment variable NODE_ENV " +
        "that is currently set to " + process.env.NODE_ENV + " using environment " +
        "for development as default.  If you think this might be incorrect please " +
        "check and likely adjust the config.json file.";
    console.log(msg);
    envConfig = config['development'];
}
console.log('Using this configuration: ', envConfig);
//Get all publications from the PaperDB object
router.get('/publications', (http) => __awaiter(void 0, void 0, void 0, function* () {
    http.response.body = paperDB_1.PaperDB;
}));
//Filter on the PaperDB object by paper id
router.get('/publications/:id', (http) => __awaiter(void 0, void 0, void 0, function* () {
    let id = http.params['id'];
    //http.response.body = http.params['id']
    let paper = paperDB_1.PaperDB.find(p => p.id == id);
    if (paper)
        http.response.body = paper;
    else
        http.response.ctx.throw(404);
}));
//Get data from a remote (micro)service using the Axios http client. This client
//return a promise thus the await on the caller side. 
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
//Get a particular paper by its id and enrich with location information
router.get('/publications/:id/location', (http) => __awaiter(void 0, void 0, void 0, function* () {
    let id = http.params['id'];
    //adding an optional location_details option that is provided from a 
    //companion service
    let paper = paperDB_1.PaperDB.find(p => p.id == id);
    if (paper) {
        const remoteUrl = "http://" + envConfig.code_host + ":" + envConfig.code_port + "/url/" + paper.code;
        let rData = yield getRemoteUrlData(remoteUrl);
        if (rData)
            paper.location_details = rData;
        http.response.body = paper;
    }
    else
        http.response.ctx.throw(404);
}));
//Now setup the internal middleware and listen for connections on target
//port based on the configuration 
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(envConfig.local_port);
console.log('Server started on port', envConfig.local_port);
//# sourceMappingURL=app.js.map