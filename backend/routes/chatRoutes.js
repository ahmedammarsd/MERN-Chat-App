const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require("../controllers/chatControllers");

const router = express.Router();

router.route("/").post(protect, accessChat)
router.route("/").get(protect, fetchChats)
router.route("/group").post(protect, createGroupChat);
router.route("/rename").patch(protect, renameGroup)
router.route("/group-remove").put(protect, removeFromGroup)
router.route("/group-add").put(protect, addToGroup)

module.exports = router