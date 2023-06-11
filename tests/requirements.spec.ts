import { test, expect } from "@playwright/test";

// Should be environment variable
const baseURL = "http://localhost:3000";

test.describe("Base requirements", () => {
  test("shows available integrations", async ({ page }) => {
    await page.goto(`${baseURL}`);
    await page.waitForLoadState("networkidle");
    const expectedIntegrations = ["Salesforce", "HubSpot", "Zapier"];
    for (const integration of expectedIntegrations) {
      const integrationItem = await page.getByText(integration);
      expect(integrationItem).toBeVisible();
    }
  });

  test("Shows fields", async ({ page }, testInfo) => {
    await page.goto(`${baseURL}`);
    await page.waitForLoadState("networkidle");
    const expectedIntegrations = {
      Salesforce: ["Client ID", "Client Secret"],
      HubSpot: ["Tenant Domain", "Client ID", "Client Secret", "Assign Fields"],
      Zapier: ["API Key"],
    };

    for (const integration in expectedIntegrations) {
      await page.goto(`${baseURL}`);
      await page.waitForLoadState("networkidle");
      await page.getByText(integration).click();
      const heading = await page.getByText(`${integration} Integration`);
      await heading.waitFor({ state: "visible" });
      for (const field of expectedIntegrations[integration]) {
        const label = await page.getByText(field);
        expect(label).toBeVisible();
      }
      const capture = await page.screenshot();
      testInfo.attach("screenshot", {
        body: capture,
        contentType: "image/png",
      });
    }
  });

  test("integration set up", async ({ page }, testInfo) => {
    await page.goto(`${baseURL}`);
    await page.getByText("Salesforce").click();
    const heading = await page.getByText(`Salesforce Integration`);
    await heading.waitFor({ state: "visible" });
    await page.getByLabel("Client ID").fill("test-client-id");
    await page.getByLabel("Client Secret").fill("test-client-secret");
    let capture = await page.screenshot();
    testInfo.attach("screenshot", {
      body: capture,
      contentType: "image/png",
    });
    await page.getByRole("button", { name: "Submit" }).click();
    const integrated = await page
      .locator("div")
      .filter({ hasText: /^Salesforce$/ });

    expect(integrated).toHaveClass(/integrated/);
    capture = await page.screenshot();
    testInfo.attach("screenshot", {
      body: capture,
      contentType: "image/png",
    });
    await page.getByText("Salesforce").click();
    await page.getByText("Yes").click();
  });
});
