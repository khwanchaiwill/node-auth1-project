
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const  bcrypt = require("bcryptjs");
const session = require('express-session');
const KnexSessionStore = require("connect-session-knex")(session);

const usersRouter = require('../usersRouter/users')
const authRouter = require('../auth/auth-router.js')
const dbConnection = require('../dbConnecton.js')
const protectedMw = require('../auth/protected-mw.js')

const server = express();

const sessionConfig = { 
    name: "cookieMonster",
    secret: "very secret!",
    cookie: {
        maxAge: 1000 * 60 * 20,  // the cookie will be expired in 20 minutes
        secure: process.env.COOKIE_SECURE || false, 
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: true,
    store: new KnexSessionStore({
        knex: dbConnection,
        tablename: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 1000 * 60 * 30,  // deleted expired sessions every 30 minutes

    }),

}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use(logger)



server.use("/api/users", protectedMw, usersRouter );
server.use("/api/auth",  authRouter )


server.get('/', (req, res) => {
    res.json({api: "Is working"})
})

server.get('/hash', (req, res) => {
    const password = req.headers.password;

    const rounds = process.env.HASH_ROUNDS || 8;
    const hash = bcrypt.hashSync(password, rounds)

    res.status(200).json({password, hash})
})

function logger (req, res, next){
    console.log(`${req.method} request the ${req.url}`, Date())
    next();
}

module.exports = server;
