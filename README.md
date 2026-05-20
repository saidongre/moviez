# Moviez

Moviez is an Express.js web application for browsing, reviewing, and tracking movies. It uses EJS for server-side rendering, MongoDB for persistence, and Passport.js for authentication.

## Features

- User authentication with login and signup
- Movie browsing and filtering
- Review and watchlist management
- Responsive UI with cinematic styling

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the project root with the following values:
   ```env
   DB_URL=<your-mongodb-connection-string>
   SESSION_SECRET=<your-session-secret>
   CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>
   CLOUDINARY_KEY=<cloudinary-api-key>
   CLOUDINARY_SECRET=<cloudinary-api-secret>
   ```

3. Start the application:
   ```bash
   node index.js
   ```

4. Open the app in your browser locally at:
   ```
   http://localhost:5500
   ```

## Live Demo

- Vercel: https://moviez-eta.vercel.app/

## Project Structure

- `index.js` - Main Express server entrypoint
- `controllers/` - Route controller logic
- `routes/` - Route definitions
- `models/` - Mongoose models
- `views/` - EJS templates
- `public/` - Static assets

## Notes

- `node_modules/` and `.env` are excluded from version control.
- If you want live reload during development, install `nodemon` globally or use `npx nodemon index.js`.

## License

ISC
