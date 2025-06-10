# Public Square Backend

This is the backend service for the Public Square chat application, built with Express.js and XMTP v3 integration for managing global chat groups.

## Features

- 🌍 **Global Group Management**: Automatically manages a single global chat group
- 🔗 **Auto-Invitations**: Automatically invites users to the global group
- 🔐 **Secure API**: Rate-limited endpoints with input validation
- 📊 **Statistics**: Group stats and member information
- 🛡️ **Error Handling**: Comprehensive error handling and logging

## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Ethereum wallet private key for the master account
- XMTP v3 compatible environment

## Setup

1. **Install Dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**

   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit the .env file with your configuration
   nano .env
   ```

3. **Required Environment Variables**

   ```env
   # Backend Configuration
   PORT=3001
   NODE_ENV=development

   # XMTP Configuration
   XMTP_ENV=production

   # Master Wallet Configuration (IMPORTANT: Keep this secure!)
   MASTER_WALLET_PRIVATE_KEY=your_private_key_here

   # Global Group Configuration
   GLOBAL_GROUP_ID=your_actual_group_id_here
   GLOBAL_GROUP_NAME=🌍 Public Square
   GLOBAL_GROUP_DESCRIPTION=The global chatroom for everyone on the platform

   # CORS Configuration
   ALLOWED_ORIGINS=http://localhost:5173,https://yourapp.com

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

## Running the Server

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## API Endpoints

### Base URL: `http://localhost:3001/api/v1/chat`

#### 1. Get Global Group Info

```
GET /global-group
```

Returns information about the global chat group.

**Response:**

```json
{
  "success": true,
  "data": {
    "groupId": "group_id_here",
    "masterAddress": "0x...",
    "groupName": "🌍 Public Square",
    "description": "The global chatroom...",
    "memberCount": 42,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. Request Group Invitation

```
POST /request-invitation
```

Request to join the global group.

**Body:**

```json
{
  "userAddress": "0x1234567890123456789012345678901234567890",
  "groupId": "group_id_here"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Invitation sent successfully",
  "data": {
    "groupId": "group_id_here",
    "status": "invitation_sent",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 3. Check Membership

```
POST /check-membership
```

Check if a user is already a member of the global group.

**Body:**

```json
{
  "userAddress": "0x1234567890123456789012345678901234567890"
}
```

#### 4. Get Statistics

```
GET /stats
```

Get general statistics about the chat system.

#### 5. Health Check

```
GET /health
```

Server health check endpoint.

## Architecture

### Core Components

1. **server.js**: Main Express server with middleware setup
2. **services/xmtpService.js**: XMTP client management and group operations
3. **routes/chat.js**: API endpoints for chat functionality

### Security Features

- Rate limiting (100 requests per 15 minutes per IP)
- Input validation using express-validator
- CORS configuration
- Helmet security headers
- Environment variable validation

### XMTP Integration

The service uses XMTP v3 Node SDK to:

- Initialize a master wallet client
- Create and manage the global group
- Send invitations to new users
- Track group membership

## Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Configure secure `MASTER_WALLET_PRIVATE_KEY`
3. Set appropriate `ALLOWED_ORIGINS`
4. Configure rate limiting for production load

### Process Management

Consider using PM2 for production deployment:

```bash
npm install -g pm2
pm2 start server.js --name "public-square-backend"
```

## Monitoring

The server provides several monitoring endpoints:

- `/health`: Basic health check
- `/api/v1/chat/stats`: Chat system statistics
- Console logs for all major operations

## Troubleshooting

### Common Issues

1. **XMTP Client Connection Fails**

   - Check your `MASTER_WALLET_PRIVATE_KEY`
   - Verify `XMTP_ENV` setting
   - Ensure wallet has sufficient ETH for gas

2. **Group Creation Issues**

   - Verify the master wallet can create groups
   - Check XMTP service status
   - Review console logs for detailed errors

3. **Rate Limiting Issues**
   - Adjust `RATE_LIMIT_MAX_REQUESTS` and `RATE_LIMIT_WINDOW_MS`
   - Consider implementing user-based rate limiting

### Logs

The server logs all major operations:

- Group creation and management
- Invitation requests and responses
- Error conditions
- Member updates

## Development

### Adding New Features

1. Add new routes in `routes/chat.js`
2. Extend XMTP service functions in `services/xmtpService.js`
3. Update validation schemas as needed
4. Add appropriate error handling

### Testing

```bash
# Install development dependencies
npm install

# Run tests (if configured)
npm test
```

## Security Considerations

⚠️ **IMPORTANT**:

- Never commit your `.env` file
- Keep your `MASTER_WALLET_PRIVATE_KEY` secure
- Use environment-specific configurations
- Monitor rate limiting and adjust as needed
- Regularly update dependencies

## Support

For issues or questions:

1. Check the console logs for detailed error messages
2. Verify your environment configuration
3. Ensure all dependencies are installed correctly
4. Check XMTP service status
# public-square-backend
