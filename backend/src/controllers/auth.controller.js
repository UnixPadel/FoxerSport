import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import prisma from '../utils/prisma.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, phoneCountry } = req.body;
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: email.trim(),
          mode: 'insensitive'
        }
      }
    });

    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Cet email est déjà utilisé.' });
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        phoneCountry
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error registering user' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email ? email.trim() : '';

    const user = await prisma.user.findFirst({ 
      where: { 
        email: {
          equals: cleanEmail,
          mode: 'insensitive'
        }
      } 
    });
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Email ou mot de passe incorrect' });
    }

    if (!user.isActive) {
      return res.status(403).json({ status: 'error', message: 'Account is deactivated' });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({
      status: 'success',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error logging in' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        preferredLang: true,
        preferredCurrency: true,
        createdAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    
    res.json({ status: 'success', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error fetching profile' });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ status: 'error', message: 'Google token is required' });
    }

    let email, given_name, family_name;
    
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${credential}` }
      });
      const data = await response.json();
      email = data.email;
      given_name = data.given_name;
      family_name = data.family_name;
    } catch (err) {
      console.error('Google userinfo error:', err);
      return res.status(401).json({ status: 'error', message: 'Failed to fetch Google profile' });
    }
    
    if (!email) {
      return res.status(400).json({ status: 'error', message: 'Email is required from Google' });
    }

    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(404).json({ 
        status: 'error', 
        code: 'USER_NOT_FOUND',
        message: 'Compte non trouvé. Veuillez vous inscrire.',
        googleData: {
          email: email.toLowerCase(),
          firstName: given_name || '',
          lastName: family_name || ''
        }
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ status: 'error', message: 'Account is deactivated' });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({
      status: 'success',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ status: 'error', message: 'Invalid Google token' });
  }
};

export const logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0)
  });
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};