import { User, PrismaClient } from "@prisma/client"
import { Express } from "express"
import session from "express-session"
import { env } from "../config"
import { PrismaSessionStore } from "@quixo3/prisma-session-store"

declare module "express-session" {
  interface SessionData {
    user: Pick<User, "id" | "email">
  }
}

// export function setupSession(app: Express) {
//   app.use(
//     session({
//       name: "sid",
//       secret: env.SESSION_SECRET,
//       cookie: {
//         httpOnly: true,
//         secure: env.NODE_ENV === "production",
//         sameSite: "none",
//         maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
//       },
//       resave: true,
//       saveUninitialized: true,
//       store: new PrismaSessionStore(new PrismaClient(), {
//         checkPeriod: 2 * 60 * 1000, //ms
//         dbRecordIdIsSessionId: true,
//         dbRecordIdFunction: undefined,
//       }),
//     })
//   )
// }

export function setupSession(app: Express) {
  app.use(
    session({
      name: "sid",
      secret: env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "production" ? "none": "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      },
      store: new PrismaSessionStore(new PrismaClient(), {
        checkPeriod: 2 * 60 * 1000, //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
    })
  )
}
