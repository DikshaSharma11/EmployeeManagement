const Employee = require("../models/employee");

exports.createEmployee = async (req, res) => {
  const employee = new Employee(req.body);
  try {
    await employee.save();
    res.status(201).send(employee);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("departmentId", "name")
      .populate("userId", "email");
    res.send(employees);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateEmployee = async (req, res) => {
  const updates = Object.keys(req.body);
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).send();
    }

    updates.forEach((update) => (employee[update] = req.body[update]));
    await employee.save();
    res.send(employee);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).send();
    }
    res.send(employee);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.filterEmployeesByLocation = async (req, res) => {
  const order = req.query.order === "desc" ? -1 : 1;
  try {
    const employees = await Employee.find().sort({ location: order });
    res.send(employees);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.filterEmployeesByName = async (req, res) => {
  const order = req.query.order === "desc" ? -1 : 1;
  try {
    const employees = await Employee.find().sort({ name: order });
    res.send(employees);
  } catch (error) {
    res.status(500).send(error);
  }
};
