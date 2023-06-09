import axios, { AxiosInstance } from "axios";
import type { Integration, IntegrationDetail } from "../database/tables";
import { StatusCode } from "./status";
import { IntegrationDetails, type MyIntegration } from "./types";

export class APIClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
    });
  }

  async getIntegrations(): Promise<Integration[]> {
    const response = await this.client.get("/api/integrations");
    return response.data;
  }

  async getUserIntegrations(): Promise<MyIntegration[]> {
    const response = await this.client.get("/api/integrations/me");
    return response.data;
  }

  async getIntegration(id: string): Promise<IntegrationDetails> {
    const response = await this.client.get(`/api/integrations/${id}`);
    return response.data;
  }

  async deleteIntegration(id: string): Promise<IntegrationDetails> {
    const response = await this.client.delete(`/api/integrations/${id}`);
    return response.data;
  }

  async createIntegration(
    id: string,
    details: { [key: string]: string | number }
  ): Promise<boolean> {
    const response = await this.client.post(`/api/integrations/${id}`, details);
    if (response.status === StatusCode.CREATED) {
      return true;
    }

    return false;
  }
}

// May want with value from .env file for server in the future
const client = new APIClient("/");

export function getAPIClient(): APIClient {
  return client;
}
