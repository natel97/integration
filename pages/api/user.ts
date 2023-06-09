// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../database";
import type { User } from "../../database/tables";

const database = getDatabase();

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<User>
) {
  res.json(database.getUser());
}
