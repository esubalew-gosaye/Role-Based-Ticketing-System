import jwt from 'jsonwebtoken';
import db from '../utils/db.js'

import { contentHash, compareHashedContent, hashCode } from '../utils/hash.js';
import validator from '../validators/authValidator.js';
import transporter from '../utils/sendMail.js';

const signUp = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    // validate input data using Joi schema
    const { error, value } = validator.signupSchema.validate({
      email,
      role,
      password,
    });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    // check if user already exists
    const existingUser = await db.user.findUnique({ where: {email} });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: 'User already exists' });
    }

    // hash password
    const hashedPassword = await contentHash(password, 12);

    // create new user
    const newUser = await db.user.create({data: { email: email, role: role, password: hashedPassword }});
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = validator.loginSchema.validate({
      email,
      password,
    });

    if (error) {
      return res.json({ success: false, message: error.details[0].message });
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({ where: { email: email } });
    if (!existingUser) {
      return res.json({ success: false, message: 'User not found!' });
    }

    // Check if password matches
    const isMatch = await compareHashedContent(password, existingUser.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid Credentials!' });
    }

    const token = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
        verified: existingUser.verified,
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res
      .cookie('Authorization', 'Bearer ' + token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
      })
      .json({ success: true, data: token, message: 'Logged in successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const logout = async (req, res) => {
  res
    .clearCookie('Authorization')
    .json({ success: true, message: 'Logged out successfully' });
};

const sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  try {
    // check if email is provided
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: 'Email is required!' });
    }

    // check if user exists with the provided email
    const existingUser = await db.user.findUnique({ where: {email: email}});
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found!' });
    }
    // check if user has already verified their account
    if (existingUser.verified) {
      return res
        .status(400)
        .json({ success: false, message: 'User is already verified!' });
    }
    // generate a verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // send the code
    let send = await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: existingUser.email,
      subject: 'Verification Code',
      html: `Your verification code is: <h1>${code}</h1>`,
    });
    if (send.accepted.length == 0) {
      res.status(400).json({ success: false, message: 'Code sent failed!' });
    }

    const hashedCode = hashCode(code, process.env.HMAC_SECRET);

    await db.user.update({ where: {id: existingUser.id}, data: { verificationCode: hashedCode, verificationCodeValidation: Date.now() }})

    res
      .status(200)
      .json({ success: true, message: 'Verification code sent successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const verifyVerificationCode = async (req, res) => {
  const { email, code } = req.body;
  try {
    const { error, value } = validator.acceptCodeSchema.validate({
      email: email,
      code: code,
    });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    const existingUser = await db.user.findUnique({where: { email: email }, select:{
      id: true,
      verified: true,
      verificationCode: true,
      verificationCodeValidation: true,
    }})
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found!' });
    }
    if (existingUser.verified) {
      return res
        .status(400)
        .json({ success: false, message: 'You already verified!' });
    }
    if (
      !existingUser.verificationCode ||
      !existingUser.verificationCodeValidation
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'Start verification process first!' });
    }

    if (Date.now() - parseInt(existingUser.verificationCodeValidation) > 1 * 60 * 1000) {
      return res
        .status(400)
        .json({ success: false, message: 'Verification code expired!' });
    }
    const hashedCode = hashCode(code, process.env.HMAC_SECRET);
    if (hashedCode !== existingUser.verificationCode) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid verification code!' });
    }
    // update the user's verification status and clear the code
    await db.user.update({where: {id: existingUser.id}, data: {verified: true, verificationCode: undefined, verificationCodeValidation: undefined}})

    res
      .status(200)
      .json({ success: true, message: 'User verified successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const sendForgotPasswordCode = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res
        .status(401)
        .json({ success: false, message: 'Email is required' });
    }
    // check if the user exists
    const existingUser = await db.user.findUnique({where: { email: email }});
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User Not found' });
    }

    // generate the code
    // TODO: implement forgot password through the link
    const code = Math.floor(1000000 + Math.random() * 9000000).toString();

    // send the code
    const sendMail = await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: existingUser.email,
      subject: 'Reset Password Code',
      html: `Your reset password code is: <h1>${code}</h1>`,
    });

    if (sendMail.accepted.length === 0) {
      return res
        .status(500)
        .json({ success: false, message: 'Code sent failed' });
    }

    // hash the code using HMAC
    const hashedCode = hashCode(code, process.env.HMAC_SECRET);
    await db.user.update({where: {id: existingUser.id}, data: {forgotPasswordCode: hashedCode, forgotPasswordValidation: Date.now()}})

    res.status(200).json({
      success: true,
      message: 'Reset password code sent successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const verifyForgotPasswordCode = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const { error, value } = validator.verifyForgotPasswordCodeSchema.validate({
      email: email,
      code: code,
      newPassword: newPassword,
    });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }
    const existingUser = await db.user.findUnique({ where: { email: email }})

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    if (
      !existingUser.forgotPasswordCode ||
      !existingUser.forgotPasswordValidation
    ) {
      return res.status(400).json({
        success: false,
        message: 'Forgot password code not found',
      });
    }

    if (
      Date.now() - parseInt(existingUser.forgotPasswordValidation) >
      8 * 60 * 1000
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'Reset password code expired' });
    }

    const hashedCode = hashCode(code, process.env.HMAC_SECRET);
    if (hashedCode !== existingUser.forgotPasswordCode) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid reset password code' });
    }

    // reset the password
    await db.user.update({where: {id: existingUser.id}, data:{ forgotPasswordCode: undefined, forgotPasswordValidation: undefined, password: await contentHash(newPassword, 12)}})
    res
      .status(200)
      .json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { email } = req.user;

  try {
    const { error, value } = validator.changePasswordSchema.validate({
      currentPassword,
      newPassword,
    });
    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    const existingUser = await db.user.findUnique({where: { email: email }, select:{id:true, password:true}});
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    const isMatch = await compareHashedContent(
      currentPassword,
      existingUser.password
    );
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Incorrect current password' });
    }

    // update the user's password in the database
    await db.user.update({ where: {id: existingUser.id}, data: {password: await contentHash(newPassword, 12)}})

    res
      .status(200)
      .json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  login,
  signUp,
  logout,
  changePassword,
  sendVerificationCode,
  verifyVerificationCode,
  sendForgotPasswordCode,
  verifyForgotPasswordCode,
};
