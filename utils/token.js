import { userTokenSchema } from "../validators/token.velidation.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// create user token
export async function createUserTocken(payload) {
  const valedationResult = await userTokenSchema.safeParseAsync(payload);

  //   check validation
  if (valedationResult.error) throw new Error(valedationResult.error.message);

  const velidatePayload = valedationResult.data;

  //   create token using payload
  const token = jwt.sign(velidatePayload, JWT_SECRET);

  return token;
}

// // validate user token
// export function validUserToken(token) {
//   try {
//     const payload = jwt.verify(token, JWT_SECRET);
//     return payload;
//   } catch (error) {
//     return null;
//   }
// }
