const crypto = require("crypto"); // bultin module for hashing in nodejs
const {
  UserSignUpValidationSchema,
  UserSigninValidationSchema,
} = require("../lib/validations/user.validator");
const User = require("../models/user.model");

exports.handlegetAllUSers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ users });
  } catch (err) {
    res.json(500).json({ error: "Internal Server Error" });
  }
};

exports.handleUserSignup = async (req, res) => {
  // This particular line will return the data(fields) present zod vlaidation
  // if extra data is sent ({a:1,b:2}) this will get fitered out and get required field data
  const validationResult = UserSignUpValidationSchema.safeParse(req.body);

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error });
  }

  const { email, firstName, password, lastName } = validationResult.data;

  //cretaing salt
  const salt = crypto.randomBytes(16).toString("hex");

  //Hashing password
  const hash = crypto.createHmac("sha256", salt).update(password).digest("hex");

  try {
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hash,
      salt,
    });

    return res.status(201).json({ data: { id: user._id } });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ error: "email address is already taken" });

    res.json(500).json({ error: "Internal Server Error" });
  }
};

exports.handleUSerSignin = async (req, res) => {
  const validationResult = UserSigninValidationSchema.safeParse(req.body);

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error });
  }

  const { email, password } = validationResult.data;

  try {
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(400).json({ error: "email does not exist" });
    }

    const hash = crypto
      .createHmac("sha256", userData.salt)
      .update(password)
      .digest("hex");

    if (hash !== userData.password) {
      return res.status(400).json({ error: "Invalid email or Password" });
    }

    return res
      .status(201)
      .json({ message: `Sucess Sign-in in for ${userData.firstName}` });
  } catch (err) {
    res.json(500).json({ error: "Internal Server Error" });
  }
};
