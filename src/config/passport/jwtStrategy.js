import { Strategy, ExtractJwt } from "passport-jwt";
import User from "../../models/Users/index.js";
import * as env from "../env.js";

export const jwtStrategy = (passport) => {
  const options = {};
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  options.secretOrKey = env.jwtKey;

  passport.use(
    new Strategy(options, (payload, done) => {
      User.findOne({ email: payload.email }, (err, user) => {
        if (err) return done(err, false);
        if (user) {
          return done(null, {
            email: user.email,
          });
        }
        return done(null, false);
      });
    })
  );
};
