Lost & Found Campus
I made this for GFG Hacktober. The idea is simple: if you lose something on campus, or find something that isn't yours, you post it here and the owner can come and claim it.
Anyone can browse the items. To report something or claim something you have to make an account.

What you can do-
1.Sign up and log in
2.Report a lost or found item (title, description, category, location, date, and a photo from your device)
3.Browse everything and filter by category, location, lost/found and status. There's also a search box
4.Open any item to see the full details
5.Claim an item by writing a short message about why it's yours
6.If you posted the item, you can see all the claims on it and approve or reject them. Approving one marks the item as recovered
7.Edit, delete or manually mark your own item as recovered
8.Dashboard that shows how many reports you have and their status
Built with
React + Vite, React Router, Axios, Tailwind
Node and Express
MongoDB with Mongoose
JWT and bcryptjs for login
Multer for photo uploads.

Folder structure-
lost-found-campus/
  backend/
    src/
      app.js
      db/
      models/        User, Item, Claim
      controllers/   auth, item, claim
      routes/
      middleware/    auth.middleware.js, upload.js
      uploads/       gets created on its own
  frontend/
    src/
      components/
      context/       AuthContext
      pages/
      services/      api.js

How to run it-
You need Node installed and a MongoDB database (local or Atlas, either is fine).
Backend first:
cd backend
npm install
Create a .env file inside backend/:
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=some_long_random_string
then
npm run dev
Server comes up on http://localhost:3000
Now the frontend, in a second terminal:
cd frontend
npm install
npm run dev
Opens on http://localhost:5173. It talks to the backend on port 3000, so if you change the port in .env also change baseURL in frontend/src/services/api.js.
API routes
Auth
POST /auth/register
POST /auth/login
GET /auth/me (token needed)
Items
GET /items (can take search, category, location, type, status as query params)
GET /items/:id
POST /items (token needed, sent as form data because of the image)
PUT /items/:id (only the owner)
PATCH /items/:id/status (only the owner)
DELETE /items/:id (only the owner)
Claims
POST /items/:itemId/claims
GET /items/:itemId/claims (only the item owner)
PATCH /claims/:id (only the item owner, body has status: approved or rejected)

Every route also works with /api in front of it, because one page in the frontend was calling it that way and I never went back to clean it up.
Still left to do
Photos are stored in the uploads folder on the server itself. That's fine locally but it will break on hosts that reset the disk, so I need to switch to Cloudinary or similar before deploying
The search box fires a request on every key press, needs a debounce
There is a claimed status but nothing actually sets it, approving a claim jumps straight to recovered
The user model has an admin role but there's no admin page yet
SearchBar.jsx and FilterBar.jsx are empty files. The search and filters live inside Items.jsx for now. Person can't see proof message which someone wrote for claiming the item.