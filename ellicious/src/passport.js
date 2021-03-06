import dotenv from 'dotenv';
import path from 'path';  
dotenv.config({path: path.resolve(__dirname, '.env')});

import passport from 'passport';//passport는 인증관련 모든 일을 한다. jwt토큰이나 쿠키에서 정보를 가져와서 사용자 정보에 저장함
import {Strategy, ExtractJwt} from 'passport-jwt';
import { prisma } from '../generated/prisma-client';


const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.JWT_SECRET
}

const verifyUser = async (payload, done)=>{
    try{
        const user = await prisma.user({id: payload.id});
        if(user !== null){
            return done(null, user);
        }else{
            return done(null, false);
        }
    }catch(error){
        return done(error, false);
    }
}

export const authenticateJwt = (req, res, next)=>
    passport.authenticate("jwt", {session: false}, (error,user)=>{
        if(user){
            req.user = user;
        }
        next();
    })(req, res, next);

passport.use(new Strategy(jwtOptions, verifyUser));
passport.initialize();
