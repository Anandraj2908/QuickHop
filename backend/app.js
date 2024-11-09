import express from "express";
import cors from "cors";

const app =express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', "DELETE"],
    credentials: true
}))

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({extended:true, limit:"16kb"}))

app.use(express.static("public"))

import userRouter from './routes/user.routes.js'
import riderRouter from './routes/rider.routes.js'

app.use("/api/v1/users", userRouter)
app.use("/api/v1/riders", riderRouter)

export {app}