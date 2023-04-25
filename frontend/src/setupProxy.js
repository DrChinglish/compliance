const urlmapping = require("./urlMapping.json")
const {createProxyMiddleware} = require('http-proxy-middleware')
let gameApiPattern = RegExp("^"+urlmapping.apibase.game)
let otherApiPattern = RegExp("^"+urlmapping.apibase.other)
module.exports = function (app){
    
    app.use(
        [urlmapping.apibase.game,urlmapping.apibase.other,urlmapping.apibase.platform],
        createProxyMiddleware({
            target:'http://127.0.0.1:8000',
            changeOrigin:true,
            pathRewrite:function (path, req){
                if(path.match(gameApiPattern))
                    return path.replace(gameApiPattern,"/api")
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