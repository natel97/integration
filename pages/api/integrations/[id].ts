// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "../../../database";
import type { UserIntegrationDetail } from "../../../database/tables";
import { StatusCode } from "../../../utils/status";
import { randomUUID } from "crypto";
import type { IntegrationDetails } from "../../../utils/types";

const database = getDatabase();

const handleGet = (
  _req: NextApiRequest,
  res: NextApiResponse<IntegrationDetails>
) => {
  const id = _req.query.id as string;
  const user = database.getUser();
  const integration = database.getIntegration(id);
  if (!integration) {
    res.status(StatusCode.NOT_FOUND).end();
    return;
  }
  const integrated = !!database
    .getUserIntegrations(user.id)
    .find((userIntegration) => userIntegration.id === id);
  const fields = database.getIntegrationDetails(id);
  res.json({ ...integration, fields, integrated });
};

const handlePost = (
  _req: NextApiRequest,
  res: NextApiResponse<IntegrationDetails | string>
) => {
  const user = database.getUser();
  const integrations = database.getUserIntegrations(user.id);
  const integrationID = _req.query.id as string;
  if (integrations.find((integration) => integration.id === integrationID)) {
    res.status(StatusCode.CONFLICT);
    res.json("Integration already exists");
    res.end();
    return;
  }

  const fieldObj: { [key: string]: any } = {};
  const fields = database.getIntegrationDetails(integrationID);
  fields.forEach((field) => (fieldObj[field.name] = { fieldProps: field }));

  const body = _req.body as { [key: string]: string };
  try {
    Object.keys(body).forEach(
      (key: string) => (fieldObj[key].value = body[key])
    );
  } catch (e) {
    console.error(e);
    res.status(StatusCode.BAD_REQUEST);
    res.json("Unexpected field " + e);
    res.end();
    return;
  }

  const values: UserIntegrationDetail[] = [];
  let missingField = "";
  Object.keys(fieldObj).forEach((key) => {
    const value = fieldObj[key];
    if (!value.value) {
      missingField = key;
    }

    values.push({
      user_id: user.id,
      integration_id: integrationID,
      detail_value: value.value,
      integration_detail_id: value.fieldProps.id,
      id: randomUUID(),
    });
  });

  if (missingField) {
    res.status(StatusCode.BAD_REQUEST);
    res.json("Missing field " + missingField);
    res.end();
    return;
  }

  values.forEach((value) => database.createIntegrationDetail(value));

  res.status(StatusCode.CREATED);
  res.end();
};

const handleDelete = (
  _req: NextApiRequest,
  res: NextApiResponse<IntegrationDetails | string>
) => {
  const user = database.getUser();
  const integrationID = _req.query.id as string;
  const deleted = database.deleteIntegration(user.id, integrationID);

  if (!deleted) {
    res.status(StatusCode.NOT_FOUND);
    res.send("Integration does not exist");
    res.end();
    return;
  }

  res.status(StatusCode.NO_CONTENT);
  res.end();
  return;
};

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<IntegrationDetails | string>
) {
  if (_req.method === "GET") {
    return handleGet(_req, res);
  }

  if (_req.method === "POST") {
    return handlePost(_req, res);
  }

  if (_req.method === "DELETE") {
    return handleDelete(_req, res);
  }

  res.end();
}
