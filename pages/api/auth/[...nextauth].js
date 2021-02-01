import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
var needle = require('needle');

const options = {
  // Configure one or more authentication providers
  providers: [
    Providers.Twitter({
        clientId: process.env.TWITTER_ID,
        clientSecret: process.env.TWITTER_SECRET
    }),
  ],
  
  callbacks: { 
    signIn: async (user, account, profile) => {
        user.name = profile.screen_name;
        user.id = profile.id_str    
        return Promise.resolve(user)
    },
    jwt: async (token, user, account, profile, isNewUser) => {
        //  "user" parameter is the object received from "authorize"
        //  "token" is being send below to "session" callback...
        //  ...so we set "user" param of "token" to object from "authorize"...
        //  ...and return it...
        user && (token.user = user);
        return Promise.resolve(token)   // ...here
    },
    session: async (session, user) => {
        //retrieve the tweets with the session
        session.user = user.user;
        return Promise.resolve(session)
    }
  },

}

export default (req, res) => NextAuth(req, res, options)