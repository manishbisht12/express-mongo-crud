    const express = require("express");
    const fs = require('fs');
    const mongoose =  require("mongoose");
    const users = require("./MOCK_DATA.json");
    const { error } = require("console");

    const app = express();
    const  PORT = 8000;

    //Connetion
    mongoose
    .connect('mongodb://127.0.0.1:27017/mani-app-1')
    .then(()=> console.log("MongoDB  Connected"))
    .catch((err) => console.log("Mongo Error", err));

    //Schema
    const userSchema = new mongoose.Schema({
        firstName:{
            type: String,
            required: true,
        },
        lastName:{
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique : true,
        },
        jobTitle: {
            type: String,
        },
        gender: {
            type: String,
        }
    },
    {timestamps: true}
    );


    const User = mongoose.model("user", userSchema);


    //Middleware -Plugin
    app.use(express.urlencoded({extended : false}));

    app.use((req, res, next) => {
        //console.log("hello from middleware 1");
    fs.appendFile('log.txt', `${Date.now()}: ${req.method} : ${req.path}\n`,
    (err,data) => {
        next();
    } );
        // return res.json({msg:" hello from middleware 1"}); not next move
        next();
    });

    // app.use((req, res, next) => {
    //     console.log("hello from middleware 2");
    //     next();
    //      //res.send("hey"); when it will be off then it can reach routes. we use next()
    //      next();
    // });

    //Routes
    app.get('/users',  async(req,res) => {
        const allDbUsers = await User.find({});
        const html = `
        <ul>
        ${allDbUsers.map( user => `<li>${user.firstName} - ${users.email}</li>`).join("")}
        </ul>`;
        res.send(html);
    });

    //REST API
    app.get("/api/users", async (req , res) => {
        const allDbUsers = await User.find({});
    // console.log(req.headers);
       // res.setHeader("X-myName", "Manish Bisht");       //custom header
        //Always add X to custom headers
        return  res.json(allDbUsers);
    });


    app
    .route("/api/users/:id")
    .get( async(req,res) => {
        const  user  = await User.findById(req.params.id);
        // const id = Number(req.params.id);
        // const user = users.find((user) => user.id === id);
        if(!user) return  res.status(404).json({error: "user not found"});
        return res.json(user);
    })
    .patch(async(req,res) => {
        //Edit user with id
    await User.findByIdAndUpdate(req.params.id, { lastName: "Changed"});
    return  res.json({status : "Success"});
    })
    .delete(async(req,res) => {
        //Delete user with id
     await User.findByIdAndDelete(req.params.id);
        return  res.json({status : "Sucess"});
    });

    // app.get("/api/user/:id", (req,res) => {
    //      const id = Number(req.params.id);
    //      const user = users.find((user) => user.id === id);
    //      return res.json(user);
    // });


    app.post("/api/users", async(req , res) => {
        const body = req.body;
        if(!body || !body.first_name  || !body.last_name || !body.email || !body.gender || !body.job_title)
            return res.status(400).json({ msg: "All fields are req..."})


    const result =   await User.create({
            firstName: body.first_name,
            lastName: body.last_name,
            email: body.email,
            gender: body.gender,
            jobTitle: body.job_title,
        });

    //  console.log("result", result);

        return res.status(201).json({msg:  "sucess"});

        // console.log("Body", body)


        // users.push({...body, id: users.length + 1 });
        // fs.writeFile('./MOCK_DATA.json', JSON.stringify(users),(err, data)  => {
        //     return res.status(201).json({status : "success",id: users.length  });
        // })
        
    });

    // app.patch("/api/users/:id", (req , res) => {
    //     return res.json({status : "pending"});
    // });


    // app.delete("/api/users", (req , res) => {
    //     return res.json({status : "pending"});
    // });

    app.listen(PORT , () => console.log(`Server started at PORT: ${PORT}`))