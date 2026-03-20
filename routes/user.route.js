import express from "express";
import {
  loginPostrequestBodySchema,
  signupPostrequestBodySchema,
} from "../validators/user.validator.js";
import { getUserByEmail, storeUserInDb } from "../services/user.service.js";
import { hashedPasswordWithSalt } from "../utils/hash.js";
import { createUserTocken } from "../utils/token.js";

const router = express.Router();

// user signup router
router.post("/auth/register", async (req, res) => {
  // get the velidate body data
  const validationResult = await signupPostrequestBodySchema.safeParseAsync(
    req.body,
  );
  // check the velidation
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.format() });
  }

  // get the data from zod
  const { name, email, password } = validationResult.data;

  // get the existing user
  const existingUser = await getUserByEmail(email);

  // check is it existing user
  if (existingUser) {
    return res.status(400).json(`user with the email ${email} already exist`);
  }

  // change the password to hashpassword and get salt
  const { salt, password: hashedPassword } = hashedPasswordWithSalt(password);

  // get the user and  data in db
  const user = await storeUserInDb({
    name,
    email,
    password: hashedPassword,
    salt,
  });
  console.log(user);
  return res.status(201).json({ data: { userid: user.id } });
});

// user login router
router.post("/auth/login", async (req, res) => {
  const validationResult = await loginPostrequestBodySchema.safeParseAsync(
    req.body,
  );

  // check the velidation
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.format() });
  }

  // get the data from zod velidation
  const { email, password } = validationResult.data;

  // get the user by the email
  const user = await getUserByEmail(email);

  // check existing user
  if (!user) {
    return res.status(400).json(`user with the email ${email} does not exist`);
  }

  // get the  password with the salt
  const { password: hashedPassword } = hashedPasswordWithSalt(
    password,
    user.salt,
  );

  // verify the user password
  if (user.password !== hashedPassword) {
    return res.status(400).json({ error: "password is invelid" });
  }

  // create user token
  const token = await createUserTocken({ id: user.id });

  return res.json({ token });
});

export default router;
