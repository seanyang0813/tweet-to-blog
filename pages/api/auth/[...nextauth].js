import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  // Configure one or more authentication providers
  providers: [
    Providers.Twitter({
        clientId: process.env.TWITTER_ID,
        clientSecret: process.env.TWITTER_SECRET
    }),
  ],

}

export default (req, res) => NextAuth(req, res, options)