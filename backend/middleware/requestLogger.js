/**
 * HTTP Request Logging Middleware
 *
 * Logs HTTP requests with method, URL, status, response time, and IP
 */

const morgan = require('morgan');
const logger = require('../config/logger');

// Custom format for request logging
const requestFormat = (tokens, req, res) => {
  return JSON.stringify({
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: tokens.status(req, res),
    responseTime: `${tokens['response-time'](req, res)}ms`,
    ip: tokens['remote-addr'](req, res),
    userAgent: tokens['user-agent'](req, res),
    contentLength: tokens.res(req, res, 'content-length'),
  });
};

// Development format (more readable)
const devFormat =
  ':method :url :status :response-time ms - :res[content-length]';

// Production format (JSON)
const prodFormat = requestFormat;

// Create morgan middleware
const requestLogger = morgan(
  process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  {
    stream: logger.stream,
    skip: (req, res) => {
      // Skip logging for health check endpoint
      return req.url === '/api/health';
    },
  }
);

module.exports = requestLogger;
