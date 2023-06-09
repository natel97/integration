import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../../database";
import type { MyIntegration } from "../../../utils/types";

const database = getDatabase();

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<MyIntegration[]>
) {
  const allIntegrations = database.getIntegrations();

  // Ideally fetch from JWT/Authentication details
  const user = database.getUser();

  const userIntegrations = database.getUserIntegrations(user.id);
  const integrationMap: { [key: string]: boolean } = {};
  userIntegrations.forEach(
    (integration) => (integrationMap[integration.id] = true)
  );
  const connectedIntegrations = allIntegrations.map((integration) => ({
    ...integration,
    integrated: integrationMap[integration.id] || false,
  }));
  res.json(connectedIntegrations);
}
