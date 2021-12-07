import './env';
import {GraphQLServer} from 'graphql-yoga';
import logger from 'morgan';
import schema from './schema';
//import {sendSecretMail} from './utils';
import "./passport";
import passport from "passport";
import { authenticateJwt } from './passport';
import { uploadMiddleware, uploadController } from './upload';
import aligoapi from 'aligoapi';


console.log(process.env.PORT);
const PORT = process.env.PORT || 4000;

const server = new GraphQLServer({schema, context:({request})=>({request})});
server.express.use(logger("dev"));
server.express.use(authenticateJwt);
server.express.post("/api/upload", uploadMiddleware, uploadController)
server.express.post("/api/SMS", function(req, res) {

    console.log(req.body)
    const AuthData = {
        key: "l1hjdp2e20azqrmpqgyyibmn65pbwvmb",
        user_id: "ghdjk2216"
    }

    aligoapi.send(req, AuthData).then(console.log("ggg"))
} )


server.start({port: PORT}, ()=> console.log(`running server on http://localhost:${PORT}`));