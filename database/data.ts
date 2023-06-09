import {
  type User,
  type Contact,
  type Integration,
  type IntegrationDetail,
  IntegrationType,
} from "./tables";

export const defaultUsers: User[] = [
  {
    id: "12345",
    given_name: "Jane",
    family_name: "Doe",
    email: "jane@blinq.me",
  },
];

export const defaultContacts: Contact[] = [
  {
    id: "1234",
    given_name: "Terry",
    family_name: "Walker",
    email: "terry@waffles.co",
    met_at_location: "Melbourne, Australia",
    notes: "Terry has a beard.",
  },
  {
    id: "1235",
    given_name: "Terry",
    family_name: "Walker",
    email: "terry@waffles.co",
    met_at_location: "Melbourne, Australia",
    notes: "Terry has a beard.",
  },
];

export const defaultIntegrations: Integration[] = [
  { id: "fd0f0fcc-da47-4738-b0a3-ad4dd4125b2b", name: "Salesforce" },
  { id: "d7d85646-804a-42e6-8fbd-14a0b9a37ae6", name: "Zapier" },
  { id: "8268fa92-17d5-4e17-9621-683e12faa2bd", name: "HubSpot" },
];

export const defaultIntegrationDetails: IntegrationDetail[] = [
  {
    id: "2ce9f6aa-918e-4a7d-a55f-002bf609525d",
    name: "client_id",
    type: IntegrationType.string,
    integration_id: "fd0f0fcc-da47-4738-b0a3-ad4dd4125b2b",
    display: "Client ID",
  },
  {
    id: "a4583a39-f2b4-4467-ac00-9df00f2ae6fb",
    name: "client_secret",
    type: IntegrationType.string,
    integration_id: "fd0f0fcc-da47-4738-b0a3-ad4dd4125b2b",
    display: "Client Secret",
  },
  {
    id: "27950f75-cd47-4219-8408-4204ee7273f5",
    name: "api_key",
    type: IntegrationType.string,
    integration_id: "d7d85646-804a-42e6-8fbd-14a0b9a37ae6",
    display: "API Key",
  },
  {
    id: "21197749-da97-489c-9d34-53f956c78861",
    name: "tenant_domain",
    type: IntegrationType.string,
    integration_id: "8268fa92-17d5-4e17-9621-683e12faa2bd",
    display: "Tenant Domain",
  },
  {
    id: "de9422aa-0e88-43e5-ad6f-4393ad4df07e",
    name: "client_id",
    type: IntegrationType.string,
    integration_id: "8268fa92-17d5-4e17-9621-683e12faa2bd",
    display: "Client ID",
  },
  {
    id: "0c038b7a-6679-490b-909f-b3331ab3da61",
    name: "client_secret",
    type: IntegrationType.string,
    integration_id: "8268fa92-17d5-4e17-9621-683e12faa2bd",
    display: "Client Secret",
  },
  {
    id: "5078fcb5-0d08-45a7-9a55-aa3b1bd99653",
    name: "field_mappings",
    type: IntegrationType.fieldMapping,
    integration_id: "8268fa92-17d5-4e17-9621-683e12faa2bd",
    display: "Field Mappings",
  },
];
