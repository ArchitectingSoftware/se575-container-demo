import * as Koa from 'koa'
import * as Router from 'koa-router'

import {PaperDB, IPaper} from './paperDB'
import Axios from 'axios'
import * as config from './config.json'

let app = new Koa();
let router = new Router();

// Environmental Setup
const environment = process.env.NODE_ENV || 'development'
let envConfig = config[environment.toLowerCase()]
if(!envConfig){
    let msg = "Cant find the desired configuration for environment variable NODE_ENV " +
            "that is currently set to " + process.env.NODE_ENV + " using environment " +
            "for development as default.  If you think this might be incorrect please "+
            "check and likely adjust the config.json file."
    console.log(msg)
    envConfig = config['development']
}
console.log('Using this configuration: ',envConfig)

//Get all publications from the PaperDB object
router.get('/publications', async http => {
    http.response.body = PaperDB
})

//Filter on the PaperDB object by paper id
router.get('/publications/:id', async http => {
    let id = http.params['id']
    //http.response.body = http.params['id']

    let paper = PaperDB.find(p => p.id == id)
    if (paper)
        http.response.body = paper
    else 
        http.response.ctx.throw(404)
})

//Get data from a remote (micro)service using the Axios http client. This client
//return a promise thus the await on the caller side. 
async function getRemoteUrlData(url: string){
    try{
        const response = await Axios.get(url)
        return response.data
    } catch(error){
        console.log ('Error from fetching url data ',error)
        return null
    }
}

//Get a particular paper by its id and enrich with location information
router.get('/publications/:id/location', async http => {
    let id = http.params['id']

    //adding an optional location_details option that is provided from a 
    //companion service
    let paper: IPaper & {location_details?: any} = PaperDB.find(p => p.id == id)
    if (paper) {
        const remoteUrl = "http://"+envConfig.code_host+":"+envConfig.code_port+"/url/"+paper.code
        let rData = await getRemoteUrlData(remoteUrl)

        if(rData)
            paper.location_details = rData
        http.response.body = paper
    }
    else 
        http.response.ctx.throw(404)
})


//Now setup the internal middleware and listen for connections on target
//port based on the configuration 
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(envConfig.local_port);
console.log('Server started on port', envConfig.local_port)

