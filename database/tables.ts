export enum IntegrationType {
  string = "string",
  fieldMapping = "field_mapping",
}

export interface User {
  id: string;
  given_name: string;
  family_name: string;
  email: string;
}

export interface Contact {
  id: string;
  given_name: string;
  family_name: string;
  email: string;
  met_at_location: string;
  notes?: string;
}

// ContactFields could be automated with a metadata query in the db
export const ContactFields = [
  "id",
  "given_name",
  "family_name",
  "email",
  "met_at_location",
  "notes",
];

export interface Integration {
  id: string;
  name: string;
}

export interface IntegrationDetail {
  id: string;
  integration_id: string;
  name: string;
  type: IntegrationType;
  display: string;
}

export interface UserIntegrationDetail {
  id: string;
  user_id: string;
  integration_id: string /* Not needed in a real DB because of join on integration_detail_id */;
  integration_detail_id: string;
  detail_value: string;
}
