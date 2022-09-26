let mysql = require('mysql')

export default class DBConnection{
    constructor(variant){
        //to be implemented...
        this.connection = undefined
    }
    connect = (host,user,pwd,db)=>{
        this.connection = mysql.createConnection({
            host:host,
            user:user,
            password:pwd,
            database:db
        })
        console.log(this.connection.state)
        if(this.connection){
            this.connection.connect()
            console.log(this.connection.state)
        }
    }
    

}