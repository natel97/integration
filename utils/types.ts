import type { IntegrationDetail, Integration } from "../database/tables";

export type MyIntegration = Integration & { integrated: boolean };

export type IntegrationDetails = Integration & {
  integrated: boolean;
  fields: IntegrationDetail[];
};
