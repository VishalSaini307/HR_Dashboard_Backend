import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { User } from '../Authentication/user.model.js';


if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn('⚠️ GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set - Google OAuth disabled');
} else {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/google/callback',

            },
            async(_accessToken , _refreshToken , profile ,done) =>{
                try{
                    const email = profile.emails?.[0].value
                    if(!email){
                        return done(new Error('No email found from Google'),false)
                    }
                    let user = await User.findOne({email});
                    if(!user){
                    user = await User.create({
  fullName: profile.displayName,
  email,
  password: null,
  googleId: profile.id,
  authProvider: 'google',
});
                }
                return done(null , user);


            }catch(err){
                return done(err , false)
            }
        }

    )
    );
}

export default passport;