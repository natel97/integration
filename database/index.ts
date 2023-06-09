import type {
  User,
  Contact,
  Integration,
  IntegrationDetail,
  UserIntegrationDetail,
} from "./tables";
import {
  defaultContacts,
  defaultIntegrationDetails,
  defaultIntegrations,
  defaultUsers,
} from "./data";
import { randomUUID } from "crypto";

/**
 * MVP Database Implementation
 *
 * The following were not included that would be included:
 * - Timestamps and soft delete (created_at, updated_at, deleted_at)
 * - Database error handling
 */
export class Database {
  constructor(
    private users: User[] = defaultUsers,
    private contacts: Contact[] = defaultContacts,
    private integrations: Integration[] = defaultIntegrations,
    private integrationDetails: IntegrationDetail[] = defaultIntegrationDetails,
    private userIntegrationDetails: UserIntegrationDetail[] = []
  ) {}

  public getUser(): User {
    return this.users[0];
  }

  public getContacts(): Contact[] {
    return this.contacts;
  }

  public getIntegrations() {
    return this.integrations;
  }

  public getIntegration(integrationID: string) {
    return this.integrations.find(({ id }) => id === integrationID);
  }

  public getIntegrationDetails(id: string) {
    return this.integrationDetails.filter(
      ({ integration_id }) => integration_id === id
    );
  }

  public getUserIntegrations(id: string) {
    const integrations: { [key: string]: boolean } = {};
    this.userIntegrationDetails.forEach(({ integration_id, user_id }) => {
      if (user_id === id) {
        integrations[integration_id] = true;
      }
    });
    const userIntegrations = this.integrations.filter(
      ({ id }) => integrations[id]
    );

    return userIntegrations;
  }

  public createIntegrationDetail(detail: UserIntegrationDetail): void {
    detail.id = randomUUID();
    this.userIntegrationDetails.push(detail);
  }

  public deleteIntegration(userID: string, integrationID: string): boolean {
    const originalLength = this.userIntegrationDetails.length;
    this.userIntegrationDetails = this.userIntegrationDetails.filter(
      ({ user_id, integration_id }) =>
        user_id !== userID && integrationID !== integration_id
    );
    return originalLength !== this.userIntegrationDetails.length;
  }
}

const database = new Database();

export function getDatabase() {
  return database;
}
