import express from "express"
import cors from "cors"
import healthCheckRouter from "./routes/healthCheck.route.js"

const app = express()

// middleware : app.use
// basic configurations
app.use(express.json({ limit: "16kb" })) // automatically converts the json into javascript object
app.use(express.urlencoded({ extended: true, limit: "16kb" })) // extended: true allows nested objects to pass
app.use(express.static("public")) // without this middleware ppl cant access those files in public

// cors configurations — tells express who is allowed to communicate with the backend
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true, // allows cookies to be sent with requests
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"]
}))

// routes
app.use(healthCheckRouter)

app.get("/", (req, res) => { // root route
    res.send("welcome to basecampy!")
})

export default app // exports the express application so other files can use it