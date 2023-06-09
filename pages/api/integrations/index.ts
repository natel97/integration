// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../../database";
import type { Integration } from "../../../database/tables";

const database = getDatabase();

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Integration[]>
) {
  const integrations = database.getIntegrations();
  res.send(integrations);
}
