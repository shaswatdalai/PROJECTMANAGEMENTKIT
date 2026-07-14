import dotenv from "dotenv"
import dns from "dns"
import app from "./app.js"
import connectDB from "./db/index.js"

dotenv.config({
  path: './.env'
})

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const port = process.env.PORT || 3000


connectDB()
 .then(() => {
  app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)// terminal pr aisa dikhega
})

 })
 .catch((err) => {
  console.error("MongoDB connection error",err)
  process.exit(1)
 })
