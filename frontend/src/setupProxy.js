const urlmapping = require("./urlMapping.json")
const {createProxyMiddleware} = require('http-proxy-middleware')
let gameApiPattern = RegExp("^"+urlmapping.apibase.game)
let otherApiPattern = RegExp("^"+urlmapping.apibase.other)
module.exports = function (app){
    
    app.use(
        [urlmapping.apibase.game,urlmapping.apibase.other],
        createProxyMiddleware({
            target:'http://localhost:8000',
            changeOrigin:true,
            pathRewrite:function (path, req){
                if(path.match(gameApiPattern))
                    return path.replace(gameApiPattern,"")
                else
                    return path.replace(otherApiPattern,"")
            }
        })
    )
}

/*:{
                gameApiPattern:"",
                otherApiPattern:""
                // '^/api/test/':'/test/',
                // '^/api/new_project':'/new_project/',
                //'^/api/project_list':'/project_list/',
                //'^/api/project_info':'/project_list/',
                //'^/api':"" //old rules, deprecated
            } */