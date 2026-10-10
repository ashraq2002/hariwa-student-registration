import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Strict regex validation for RFC 5322 compliant email formats
 * Validates domain, structure, avoids illegal double dots, special chars, etc.
 */
export const validateEmailFormat = (email) => {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  
  // Length limits
  if (trimmed.length < 5 || trimmed.length > 254) return false;
  
  // RFC 5322 compliant email regex
  const emailRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/;
  
  if (!emailRegex.test(trimmed)) return false;
  
  // Disallow double consecutive dots in local part or domain
  if (trimmed.includes('..')) return false;

  const parts = trimmed.split('@');
  if (parts.length !== 2) return false;

  const [localPart, domain] = parts;
  if (localPart.length > 64) return false;
  
  const domainParts = domain.split('.');
  if (domainParts.length < 2) return false;
  
  // Check top-level domain (TLD) is at least 2 alpha characters
  const tld = domainParts[domainParts.length - 1];
  if (!/^[a-zA-Z]{2,}$/.test(tld)) return false;

  return true;
};

/**
 * Hashes password using bcrypt.hash() with 10 salt rounds
 */
export const hashPassword = async (password) => {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a valid non-empty string');
  }
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Synchronous variant of bcrypt hashing for initial setup or seeds
 */
export const hashPasswordSync = (password) => {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a valid non-empty string');
  }
  return bcrypt.hashSync(password, 10);
};

/**
 * Verifies password using bcrypt.compare() with fallback for legacy seeds and PBKDF2 hashes
 */
export const verifyPassword = async (password, storedPassword) => {
  if (!storedPassword || typeof password !== 'string') return false;

  // 1. Standard bcrypt hash format ($2a$, $2b$, $2y$)
  if (
    typeof storedPassword === 'string' &&
    (storedPassword.startsWith('$2a$') ||
      storedPassword.startsWith('$2b$') ||
      storedPassword.startsWith('$2y$'))
  ) {
    try {
      return await bcrypt.compare(password, storedPassword);
    } catch (e) {
      console.error('[Auth Security] bcrypt compare error:', e.message);
      return false;
    }
  }

  // 2. Backward compatibility for previously generated PBKDF2 hashes (salt:hash)
  if (storedPassword.includes(':')) {
    const [salt, originalHash] = storedPassword.split(':');
    const hash25k = crypto.pbkdf2Sync(password, salt, 25000, 64, 'sha512').toString('hex');
    if (hash25k === originalHash) return true;

    const hash10k = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash10k === originalHash;
  }

  // 3. Direct comparison for default demo seeds ('admin123', 'student123')
  return password === storedPassword;
};

/**
 * Generates a cryptographically secure 6-digit numerical OTP code using crypto.randomInt
 */
export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Generates a high-entropy random URL-safe token for email verification links
 */
export const generateSecureToken = () => {
  return crypto.randomBytes(32).toString('hex');
};
