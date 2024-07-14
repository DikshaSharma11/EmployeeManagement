const express = require("express");
const { auth, isManager } = require("../middleware/auth");
const employeeController = require("../controllers/employeeController");

const router = express.Router();

router.post("/", auth, employeeController.createEmployee);
router.get("/", auth, employeeController.getEmployees);
router.get("/:id", auth, employeeController.getEmployeeById);
router.put("/:id", auth, isManager, employeeController.updateEmployee);
router.patch("/:id", auth, isManager, employeeController.updateEmployee);
router.delete("/:id", auth, isManager, employeeController.deleteEmployee);
router.get(
  "/filter/location",
  auth,
  employeeController.filterEmployeesByLocation
);
router.get("/filter/name", auth, employeeController.filterEmployeesByName);

module.exports = router;
