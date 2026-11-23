import session from 'express-session'
import MongoStore from 'connect-mongo'
import { env } from './env.js'
export const sessionMiddleware = session({
  name: env.SESSION_COOKIE_NAME,
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: env.MONGODB_URI ? MongoStore.create({ mongoUrl: env.MONGODB_URI }) : undefined,
  cookie: { httpOnly: true, sameSite: env.SESSION_COOKIE_SAME_SITE, secure: env.SESSION_COOKIE_SECURE ?? env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 },
})

