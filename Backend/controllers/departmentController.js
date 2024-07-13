const Department = require("../models/department");

exports.createDepartment = async (req, res) => {
  const { name } = req.body;
  const department = new Department({ name, managerId: req.user._id });
  try {
    await department.save();
    res.status(201).send(department);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate("managerId", "email");
    res.send(departments);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateDepartment = async (req, res) => {
  const updates = Object.keys(req.body);
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).send();
    }

    updates.forEach((update) => (department[update] = req.body[update]));
    await department.save();
    res.send(department);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).send();
    }
    res.send(department);
  } catch (error) {
    res.status(500).send(error);
  }
};
