'use strict';

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var secrets = require('./secrets.js');

module.exports = function (app, db) {
    ///ASHI mad important
    require('../../../db/models/user')(db);
    var User = db.models.user;

    var googleCredentials = {
        clientID: secrets.google.clientID,
        clientSecret: secrets.google.clientSecret,
        callbackURL: "http://localhost:1337/auth/google/callback"
    };

    var verifyCallback = function (accessToken, refreshToken, profile, done) {
        User.findOne({
                where: {
                    google_id: profile.id
                }
            })
            .then(function (userToLogin) {
                if (userToLogin) {
                    done(null, userToLogin);
                } else {
                    User.create({
                            google_id: profile.id,
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName
                        })
                        .then(function (user) {
                            done(null, user);
                        });
                }
            })
            .catch(function (err) {
                console.error('Error creating user from Google authentication', err);
                done(err);
            });

    };

    passport.use(new GoogleStrategy(googleCredentials, verifyCallback));

    app.get('/auth/google', passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            failureRedirect: '/login'
        }),
        function (req, res) {
            res.redirect('/');
        });

};
