const {createProxyMiddleware} = require('http-proxy-middleware')

module.exports = function (app){
    app.use(
        '/api',
        createProxyMiddleware({
            target:'http://localhost:8000',
            changeOrigin:true,
            pathRewrite:{
                // '^/api/test/':'/test/',
                // '^/api/new_project':'/new_project/',
                //'^/api/project_list':'/project_list/',
                //'^/api/project_info':'/project_list/',
                '^/api':""
            }
        })
    )
}