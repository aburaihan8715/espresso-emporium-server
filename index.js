const app = require("./app");

// server port
const port = process.env.PORT || 5000;

// server listening
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
