const express = require("express");
const items = require("../fakeDb");
const router = express.Router();

router.get("", (req, res, next) => {
  try {
    return res.json(items);
  } catch (e) {
    return next(e);
  }
});

router.post("", (req, res, next) => {
  try {
    if (!req.body.name || !req.body.price) {
      throw { message: "Name and price are required", status: 404 };
    }
    let newItem = { name: req.body.name, price: req.body.price };
    items.push(newItem);
    return res.status(201).json({ added: newItem });
  } catch (e) {
    return next(e);
  }
});

router.get("/:name", (req, res, next) => {
  try {
    let foundItem = items.find((val) => val.name === req.params.name);
    if (!foundItem) throw { message: "Not Found.", status: 404 };
    return res.json({ item: foundItem });
  } catch (e) {
    return next(e);
  }
});

router.patch("/:name", (req, res, next) => {
  try {
    let foundItem = items.find((val) => val.name === req.params.name);
    if (!foundItem) throw { message: "Not Found.", status: 404 };
    foundItem.name = req.body.name;
    foundItem.price = req.body.price;
    return res.json({ updated: foundItem });
  } catch (e) {
    return next(e);
  }
});

router.delete("/:name", (req, res, next) => {
  let foundIdx = items.findIndex((val) => val.name === req.params.name);
  if (foundIdx === -1) throw { message: "Not Found.", status: 404 };
  items.splice(foundIdx, 1);
  res.json({ message: "Deleted" });
});
module.exports = router;
