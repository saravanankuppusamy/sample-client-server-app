const express = require("express");
const path = require("path");

const app = express();

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Additional routes and middleware can be defined here

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
