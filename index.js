    const express = require("express");
    const {logReqRes} =require("./middlewares");
    const {connectMongoDb} = require('./connection') 

    const userRouter  = require("./routes/user");

    const app = express();
    const  PORT = 8000;

    //Connetion
    connectMongoDb("mongodb://127.0.0.1:27017/mani-app-1").then(()=> 
     console.log("MongoDb connected!")
     );
   


    //Middleware -Plugin
    app.use(express.urlencoded({extended : false}));
    app.use(logReqRes('log.txt'));




    //Routes
    app.use("/api/users", userRouter);
    


     app.listen(PORT , () => console.log(`Server started at PORT: ${PORT}`))