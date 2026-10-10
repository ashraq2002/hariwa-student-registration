/**
 * Security Middleware Suite for Hariwa University Portal
 * Provides:
 * 1. Rate Limiting for Auth, OTP, and General API routes
 * 2. Security Headers (Anti-MIME-sniffing, Clickjacking protection, XSS protection, Cache-Control for private data)
 * 3. Body Sanitization (Prototype pollution prevention, null byte stripping)
 */

// In-memory sliding window store for rate limiting
const ipRequestBuckets = new Map();

// Periodic cleanup every 3 minutes to avoid memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of ipRequestBuckets.entries()) {
    if (now > record.resetTime) {
      ipRequestBuckets.delete(key);
    }
  }
}, 3 * 60 * 1000);

/**
 * Factory for IP-based rate limiting middleware
 */
export const createRateLimiter = ({ windowMs = 60 * 1000, maxRequests = 60, message = 'Too many requests' }) => {
  return (req, res, next) => {
    // Extract client IP address safely
    const forwarded = req.headers['x-forwarded-for'];
    const clientIp = (forwarded ? forwarded.split(',')[0] : req.socket?.remoteAddress || req.ip || '127.0.0.1')
      .toString()
      .trim();

    const bucketKey = `${req.baseUrl || req.path}:${clientIp}`;
    const now = Date.now();
    let record = ipRequestBuckets.get(bucketKey);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      ipRequestBuckets.set(bucketKey, record);
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - 1));
      return next();
    }

    record.count += 1;
    const remaining = Math.max(0, maxRequests - record.count);
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);

    if (record.count > maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({
        error: message,
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfterSeconds: retryAfter,
      });
    }

    next();
  };
};

/**
 * Sensitive Auth Endpoint Limiter (Login, Registration, Password Reset)
 * 35 requests per minute per IP
 */
export const authRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 35,
  message: 'Too many authentication attempts. Please wait 60 seconds and try again.',
});

/**
 * Strict OTP Verification & Resend Limiter
 * 15 requests per 2 minutes per IP
 */
export const otpRateLimiter = createRateLimiter({
  windowMs: 2 * 60 * 1000,
  maxRequests: 15,
  message: 'Too many verification code attempts. Please wait a moment before trying again.',
});

/**
 * General API Limiter
 * 300 requests per minute per IP
 */
export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 300,
  message: 'API request threshold exceeded. Please slow down.',
});

/**
 * HTTP Security Headers Middleware
 */
export const securityHeaders = (req, res, next) => {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Protect against clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  // Legacy XSS protection filter
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Prevent caching of sensitive JSON endpoints (Student Records, Auth Data, Notifications)
  if (req.path.startsWith('/api')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  next();
};

/**
 * Input sanitization to prevent prototype pollution and null byte exploits
 */
export const sanitizeInputs = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    // Block prototype pollution
    delete req.body.__proto__;
    delete req.body.constructor;
    delete req.body.prototype;

    // Sanitize string keys
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string') {
        // Strip null bytes
        req.body[key] = req.body[key].replace(/\0/g, '');
      }
    }
  }
  next();
};
