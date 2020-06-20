import fs from 'fs'
import path from 'path'
import { Strategy } from 'passport-saml'

export default (passport) => {
  const SamlStrategy = Strategy
  const certPath = path.join(__dirname, '../config/ADFS/rebate.cert')

  passport.serializeUser((user, done) => {
    done(null, user)
  })

  passport.deserializeUser((user, done) => {
    done(null, user)
  })

  passport.use(
    new SamlStrategy(
      {
        entryPoint: "https://accessdev.scg.co.th/adfs/ls/",
        issuer: "https://rebateonline.nexterdigitals-dev.com",
        callbackUrl: "https://rebateonline.nexterdigitals-dev.com/login",
        //  privateCert: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath, "utf-8"),
        // other authn contexts are available e.g. windows single sign-on
        authnContext: "http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/password",
        // not sure if this is necessary?
        //  acceptedClockSkewMs: -1,
        identifierFormat: null,
        // this is configured under the Advanced tab in AD FS relying party
        signatureAlgorithm: "sha256"
        //  RACComparison: "exact" // default to exact RequestedAuthnContext Comparison Type
      },
      function(profile, done) {
        console.log("profile.nameID =====> : ");
        console.log(profile.nameID);
        // console.log(profile["nameID"]);
        // console.log(profile.SamAccountName);
        // user.saml = {};
        // user.saml.nameID = profile.nameID;
        // user.saml.nameIDFormat = profile.nameIDFormat;
        return done(null, {
            user_ad: profile.nameID 
            // upn: profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn"],
            // // e.g. if you added a Group claim
            // group: profile["http://schemas.xmlsoap.org/claims/Group"]
        })
      }
    )
  )
}