import { config } from "dotenv"
config()

import express from "express"
import { usersRouter } from "./routes/users"
import { jobListingsRouter } from "./routes/jobListings"
import { env } from "./config"
import { setupSession } from "./setup/session"
import { setupCors } from "./setup/cors"
import { stripeRouter } from "./routes/stripe"

const app = express()
// app.set("trust proxy", 1); // needed if behind Render's proxy


setupSession(app)
setupCors(app)

app.use("/stripe-webhooks", express.raw({ type: "*/*" }), stripeRouter)
app.use(express.json())

// Routes
app.use("/users", usersRouter)
app.use("/job-listings", jobListingsRouter)

app.listen(env.PORT, () => {
  console.log(env.NODE_ENV === "production"? " Production Mode": "Development Mode")
  console.log(`Server listening at port ${env.PORT}`)
})
