import { chromium } from "playwright";

const views = [
  "dashboard",
  "ventas",
  "productos",
  "caja",
  "reportes",
  "configuracion"
];

const settingsTabs = [
  "negocio",
  "ticket",
  "preferencias"
];

async function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function login(page) {
  await page.goto("http://localhost:5173", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.fill("#loginUser", "admin");
  await page.fill("#loginPassword", "1234");
  await page.click("#loginButton");
  await page.waitForSelector("#appView:not(.hidden)", { timeout: 15000 });
}

async function openView(page, view, viewportName) {
  if (view === "dashboard") {
    await page.waitForSelector("#dashboardView:not(.hidden)", { timeout: 10000 });
    return;
  }

  if (view !== "dashboard" && viewportName === "mobile") {
    await page.locator("#mobileMenuButton").click();
  }

  const trigger = page.locator(`.nav-link[data-view="${view}"]`).first();
  if (await trigger.count()) {
    await trigger.click();
  }

  await page.waitForSelector(`#${view}View:not(.hidden)`, { timeout: 10000 });
  if (viewportName === "mobile") {
    await page.waitForSelector("#appView:not(.menu-open)", { timeout: 10000 });
    await page.waitForTimeout(220);
    const sidebarBox = await page.locator(".sidebar").boundingBox();
    await assert(!sidebarBox || sidebarBox.x < -100, `Sidebar visible en mobile cerrado: x=${sidebarBox?.x}`);
  }
}

async function assertVisibleSection(page, view) {
  const section = page.locator(`#${view}View`);
  const box = await section.boundingBox();
  await assert(box && box.width > 0 && box.height > 0, `Vista sin tamaño: ${view}`);

  const textLength = await section.evaluate(element => element.innerText.trim().length);
  await assert(textLength > 20, `Vista sin contenido visible: ${view}`);
}

async function waitForStableContent(page) {
  try {
    await page.waitForFunction(() => !document.querySelector(".skeleton-row"), null, { timeout: 6000 });
  } catch {
    await page.waitForTimeout(500);
  }
}

async function checkViewport(browser, name, viewport) {
  const page = await browser.newPage({ viewport });
  const consoleErrors = [];
  page.on("console", message => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await login(page);

  for (const view of views) {
    await openView(page, view, name);
    await assertVisibleSection(page, view);
    await waitForStableContent(page);
    await page.screenshot({ path: `test-results/visual-${name}-${view}.png`, fullPage: name !== "mobile" });

    if (view === "configuracion") {
      for (const tab of settingsTabs) {
        await page.locator(`#configuracionView [data-settings-tab="${tab}"]`).first().click();
        await page.screenshot({ path: `test-results/visual-${name}-configuracion-${tab}.png`, fullPage: name !== "mobile" });
      }
    }
  }

  await assert(consoleErrors.length === 0, `Errores de consola: ${consoleErrors.join(" | ")}`);
  await page.close();
}

const browser = await chromium.launch();
try {
  await checkViewport(browser, "desktop", { width: 1440, height: 900 });
  await checkViewport(browser, "mobile", { width: 390, height: 844 });
} finally {
  await browser.close();
}
