import User from '../models/auth-model.js';
import _ from 'lodash';
import { OAuth2Client } from 'google-auth-library';
import fetch from 'node-fetch';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import { response } from 'express';
import sha256 from 'crypto-js/sha256.js';
import CryptoJS from 'crypto-js';

dotenv.config();

sgMail.setApiKey(process.env.MAIL_API_KEY);

export const registerTask = (req, res) => {
    const { name, email, password, address, phone, gender, birthday } = req.body;
    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()) {
        const err = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            error: err
        });
    } else {
        User.findOne({ email }).exec((err, user) => {
            if(user) {
                return res.status(400).json({
                    error: "This email already exists."
                })
            }
        })

        const token = jwt.sign(
            { name, email, password, address, phone, gender, birthday },
            process.env.JWTACCOUNT || "null",
            { expiresIn: '15m' }
        )

        const emailForm = {
            from: "7r4nquocbao@gmail.com",
            to: email,
            subject: 'Account activation link',
            html: `
                <h1>Click link below to activate your account<h1/>
                <p>${process.env.CLIENT_URL}/activationJWT/${token}</p>
            `
        }

        sgMail.send(emailForm).then(sent => {
            return res.json({
                message: `Email has been sent to ${email}`
            })
        }).catch (err => {
            return res.status(400).json({
                error: err
            })
        })
    }
}

export const activationTask = (req, res) => {
    const {token} = req.body;
    console.log(token);
    if(token) {
        jwt.verify(token, process.env.JWTACCOUNT, (err, decoded) => {
            if(err) {
                return res.status(401).json({
                    error: 'Expired token. Sign un again'
                })
            } else {
                const { name, email, password, address, phone, gender, birthday } = jwt.decode(token);
                console.log('asdasd',birthday);
                const user = new User({ name, email, password, address, phone, gender, birthday });
                console.log(user);
                user.save((err, user) => {
                    if(err) {
                        return res.status(401).json({
                            error: err
                        })
                    } else {
                        res.json({
                            success: true,
                            message: 'Sign up success'
                        })
                    }
                })
            }
        })
    } else {
        res.json({
            message: 'Error, try again.'
        })
    }
}

export const loginTask = (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()) {
        const err = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            error: err
        });
    } else {
        User.findOne({ email: email }).exec((err, user) => {
            if(err || !user) {
                return res.status(400).json({
                    error: 'User with that email does not exists!'
                })
            } else if(!user.authenticate(password)) {
                return res.status(400).json({
                    error: 'Email and password do not match!'
                })
            }
            
            const userUpdated = {...user._doc, lastLogin: new Date()};
            User.findByIdAndUpdate(userUpdated._id, userUpdated, {new: true}).exec((err,data) => {
                console.log(userUpdated);
            })
            const token = jwt.sign(
                { _id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '3d' }
            )

            const { _id, name, email, role, address, phone, gender } = user;

            return res.json({
                token,
                user: { _id, name, email, role, gender, address, phone }
            })
        })
    }
}

export const resetPasswordRequest = (req, res) => {
    const { email } = req.body;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).json({
            error: errors
        })
    } else {
        User.findOne({ email: email },  (err, user) => {
            if(err || !user) {
                return res.status(400).json({
                    error: err
                })
            }

            const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD , {expiresIn: '10m'});

            const emailForm = {
                from: process.env.EMAILFROM,
                to: email,
                subject: `Password Reset link`,
                html: `
                          <h1>Please use the following link to reset your password</h1>
                          <p>${process.env.CLIENT_URL}/reset/${token}</p>
                      `
              };
              
            return user.updateOne({ resetPasswordLink: token }, (err, success) => {
                if(err) {
                    return res.status(400).json({
                        error: err
                    })
                } else {
                    sgMail.send(emailForm).then(sent => {
                        return res.json({
                            message: `Email has been sent to ${email}.`
                        })
                    }).catch(err => {
                        return res.json({
                            message: err
                       })
                    })
                }
            })
        })
    }
}

export const resetPasswordTask = (req, res) => {
    const {resetPasswordLink, newPassword} = req.body;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors
        })
    } else {
        if(resetPasswordLink) {
            jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, (err, decoded) => {
                if(err) {
                    return res.status(400).json({
                        error: 'Expired link. Try again'
                    })
                }

                User.findOne({ resetPasswordLink }, (err, user) => {
                    if(err || !user) {
                        return res.status(400).json({
                            error: err
                        })
                    }

                    const newHashedPassword = sha256(newPassword + user.salt);

                    const updatedFields = {
                        hashedPassword: newHashedPassword,
                        resetPasswordLink: ''
                    }

                    user = _.extend(user, updatedFields);

                    user.save((err, result) => {
                        if(err) {
                            return res.status(400).json({
                                error: err
                            })
                        }
                        res.json({
                            message: 'Password reseted!'
                        })
                    })
                })

            })
        }
    }
}

export const facebookLoginTask = (req, res) => {
    console.log(req.body);

    const { userID, accessToken } = req.body;

    const url = `https://graph.facebook.com/${userID}?fields=id,name,email,picture&access_token=${accessToken}`;

    return (
        fetch(url, { method: 'GET' })
            .then(response => response.json())
            .then(response => {
                console.log("aaaa", response);
                const { email, name } = response;

                User.findOne({ email: email }).exec((err, user) => {
                    if(user) {
                        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                        const { _id, email, name, role } = user;
                        return res.json({
                            token: token,
                            user: { _id, email, name, role }
                        });
                    } else {
                        let password = email + process.env.JWT_SECRET;
                        user = new User({ name, email, password });
                        user.save((err, data) => {
                            if (err) {
                                return res.status(400).json({
                                    error: err
                                });
                            }
                            const token = jwt.sign(
                                { _id: data._id },
                                process.env.JWT_SECRET,
                                { expiresIn: '7d' }
                            );
                            const { _id, email, name, role } = data;
                                return res.json({
                                token,
                                user: { _id, email, name, role }
                            });
                        });
                    }
                })
            }).catch(error => {
                res.json({
                    error: error
                })
            })
    );
}