const express = require("express");
const app = express();

const ExpressError = require("./expressError");
const itemsRoutes = require("./routes/items")
// handles JSON request bodies 
app.use(express.json());

app.use("/items", itemsRoutes);

// generic error handlier
app.use((req, res, next) => {
  const e = new ExpressError("Page Not Found", 404);
  next(e);
});

// global error handler
app.use((err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});


// app.listen(3000, () => {
//   console.log("App on port 3000");
// });

module.exports = app;
