// src/models/user-model.js
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure users file exists
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]), 'utf8');
}

/**
 * Hash a password with a salt
 * @param {string} password - The password to hash
 * @returns {Object} - The hashed password and salt
 */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

/**
 * Verify a password against a hash and salt
 * @param {Object} user - The user object with hash and salt
 * @param {string} password - The password to verify
 * @returns {boolean} - Whether the password is valid
 */
function verifyPassword(user, password) {
  const hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
  return user.hash === hash;
}

/**
 * Get all users
 * @returns {Promise<Array>} - All users
 */
async function getUsers() {
  try {
    const data = await fs.promises.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
}

/**
 * Save users to file
 * @param {Array} users - The users to save
 * @returns {Promise<void>}
 */
async function saveUsers(users) {
  try {
    await fs.promises.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing users file:', error);
    throw error;
  }
}

/**
 * Create a new user
 * @param {Object} userData - The user data
 * @returns {Promise<Object>} - The created user
 */
async function createUser(userData) {
  const { email, password, ...rest } = userData;
  
  // Validate email and password
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  // Get all users
  const users = await getUsers();
  
  // Check if user already exists
  if (users.some(user => user.email === email)) {
    throw new Error('User already exists');
  }
  
  // Hash password
  const { hash, salt } = hashPassword(password);
  
  // Create user
  const user = {
    id: crypto.randomUUID(),
    email,
    hash,
    salt,
    createdAt: new Date().toISOString(),
    ...rest
  };
  
  // Add user to users
  users.push(user);
  
  // Save users
  await saveUsers(users);
  
  // Return user without hash and salt
  const { hash: _, salt: __, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Verify a user's credentials
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {Promise<Object|null>} - The user if verified, null otherwise
 */
async function verifyUser(email, password) {
  // Get all users
  const users = await getUsers();
  
  // Find user by email
  const user = users.find(user => user.email === email);
  
  // If user not found or password is invalid, return null
  if (!user || !verifyPassword(user, password)) {
    return null;
  }
  
  // Return user without hash and salt
  const { hash, salt, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Get a user by ID
 * @param {string} id - The user ID
 * @returns {Promise<Object|null>} - The user if found, null otherwise
 */
async function getUser(id) {
  // Get all users
  const users = await getUsers();
  
  // Find user by ID
  return users.find(user => user.id === id) || null;
}

/**
 * Update a user
 * @param {string} id - The user ID
 * @param {Object} updates - The updates to apply
 * @returns {Promise<Object>} - The updated user
 */
async function updateUser(id, updates) {
  // Get all users
  const users = await getUsers();
  
  // Find user index
  const userIndex = users.findIndex(user => user.id === id);
  
  // If user not found, throw error
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // Update user
  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  // Save users
  await saveUsers(users);
  
  // Return updated user
  return users[userIndex];
}

/**
 * Update a user's password
 * @param {string} id - The user ID
 * @param {string} newPassword - The new password
 * @returns {Promise<void>}
 */
async function updatePassword(id, newPassword) {
  // Get all users
  const users = await getUsers();
  
  // Find user index
  const userIndex = users.findIndex(user => user.id === id);
  
  // If user not found, throw error
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // Hash new password
  const { hash, salt } = hashPassword(newPassword);
  
  // Update user
  users[userIndex] = {
    ...users[userIndex],
    hash,
    salt,
    updatedAt: new Date().toISOString()
  };
  
  // Save users
  await saveUsers(users);
}

const userModel = {
  createUser,
  verifyUser,
  getUser,
  updateUser,
  updatePassword,
  verifyPassword
};

export default userModel;