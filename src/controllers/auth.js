const { users } = require("../../models");
const cloudinary = require("../thirdparty/cloudinary");

//import package
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  const { fullname, password, email, gender, phone, address } = req.body;
  const schema = Joi.object({
    fullname: Joi.string().min(5).required(),
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().min(6).required(),
    address: Joi.string().min(1).required(),
    gender: Joi.string().min(1).required(),
  });

  const { error } = schema.validate(req.body);

  //do validation and get error
  if (error) {
    return res.status(400).send({
      message: error.details[0].message,
    });
  }
  const userExist = await users.findOne({
    where: {
      email: req.body.email,
    },
  });

  //check if user exists or not
  if (userExist) {
    return res.status(409).json({
      error: "failed",
      message: "Email already exist",
    });
  } else {
    try {
      //generate salt
      const salt = await bcrypt.genSalt(10);

      // encrypt password
      const hashedPassword = await bcrypt.hash(password, salt);

      //create new user
      const newUser = await users.create({
        fullname,
        password: hashedPassword,
        email,
        gender,
        phone,
        address,
        role: "user",
      });

      //generate token
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        process.env.ACCESS_TOKEN_SECRET
      );

      res.status(200).send({
        status: "register success",
        token,
      });
    } catch (error) {
      res.status(500).send({
        status: "register failed",
      });
    }
  }
};

exports.login = async (req, res) => {
  const userExist = await users.findOne({
    where: {
      email: req.body.email,
    },
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });
  //check if user exists or not
  if (!userExist) {
    return res.status(404).send({
      status: "failed",
      message: "User doesn't exist,register please ",
    });
    //check if password valid or not
  } else if (!bcrypt.compareSync(req.body.password, userExist.password)) {
    return res.status(401).send({
      status: "failed",
      message: "Email or password incorrect",
    });
  } else {
    try {
      //generate token
      const token = jwt.sign(
        { id: userExist.id, role: userExist.role },
        process.env.ACCESS_TOKEN_SECRET
      );

      res.status(200).send({
        status: "success",
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        status: "failed",
        mesage: "server error",
      });
    }
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const id = req.user.id;

    const dataUser = await users.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!dataUser) {
      return res.status(404).send({
        status: "failed",
      });
    }

    res.send({
      status: "success",
      ...dataUser,
      attachment: cloudinary.url(data.image, { secure: true }),
    });
  } catch (error) {
    res.status({
      status: "failed",
      message: "Server Error",
    });
  }
};
