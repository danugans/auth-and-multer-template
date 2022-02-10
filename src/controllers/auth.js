// import model here
const { user } = require("../../models");
// import package here
const joi = require("joi");

exports.register = async (req, res) => {
  // code here
  const schema = joi.object({
    name: joi.string().min(4).required(),
    email: joi.string().email().min(4).required(),
    password: joi.string().min(3).required(),
  });

  const { error } = schema.validate(req.body);
  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });

  try {
    const newUser = await user.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    res.status(201).send({
      status: "success",
      data: {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.login = async (req, res) => {
  // code here
  const schema = joi.object({
    email: joi.string().email().min(4).required(),
    password: joi.string().min(3).required(),
  });

  const { error } = schema.validate(req.body);

  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });

  try {
    const userExist = await user.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (userExist.password !== req.body.password) {
      return res.status(400).send({
        status: "failed",
        message: "Credential is invalid",
      });
    }

    res.status(200).send({
      status: "success",
      data: {
        name: userExist.name,
        email: userExist.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};
