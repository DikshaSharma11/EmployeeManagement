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
  const { name, location, sort, page = 1, limit = 10 } = req.query;

  try {
    const filter = {};

    // Add filters based on query parameters
    if (name) {
      filter.name = { $regex: name, $options: "i" }; // Case-insensitive search
    }
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    // Determine the sorting order
    const sortOrder = sort === "desc" ? -1 : 1;

    // Fetch employees with pagination
    const employees = await Employee.find(filter)
      .populate("departmentId", "name")
      .populate("userId", "email")
      .sort({ name: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalEmployees = await Employee.countDocuments(filter);

    res.json({
      employees,
      totalPages: Math.ceil(totalEmployees / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employeeId = req.params.id; // Ensure this is employeeId
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).send("Employee not found");
    }

    res.send(employee);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateEmployee = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "location", "departmentId"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!employee) {
      return res.status(404).send("Employee not found");
    }

    res.send(employee);
  } catch (error) {
    res.status(400).send("Error updating employee: " + error.message);
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
