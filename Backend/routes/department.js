const express = require("express");
const { auth, isManager } = require("../middleware/auth");
const departmentController = require("../controllers/departmentController");

const router = express.Router();

router.post("/", auth, isManager, departmentController.createDepartment);
router.get("/", auth, departmentController.getDepartments);
router.put("/:id", auth, isManager, departmentController.updateDepartment);
router.delete(
  "/:id",
  auth,
  isManager,
  departmentController.deleteDepartment
);

module.exports = router;
