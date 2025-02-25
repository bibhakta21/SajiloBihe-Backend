const app = require("./app");


// Start the Express server
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// Export the server instance (Important for tests)
module.exports = server; // Export for tests
