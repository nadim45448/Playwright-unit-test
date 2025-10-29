import { test, expect } from "@playwright/test";
import { generateRandomNumber } from "../utils/utils";
import { faker } from "@faker-js/faker";
import path from "path";


test("has title", async ({ page }) => {
    await page.goto("https://demoqa.com/text-box");
    await expect(page).toHaveTitle(/DEMOQA/);

})

test("Create new user", async ({ page }) => {
    await page.goto("https://demoqa.com/text-box");
    await page.getByRole("textbox", { name: "Full Name" }).fill(faker.person.fullName())
    await page.getByPlaceholder("name@example.com").fill(`nadim+${generateRandomNumber(1000, 9000)}@gmail.com`);
    await page.getByRole("button", { name: "Submit" }).click();
    await page.pause();
})


test("Button click", async ({ page }) => {
    await page.goto("https://demoqa.com/buttons")
    // double click
    await page.getByRole("button", { name: "Double Click Me" }).dblclick();
    const actualText = await page.getByText("a double click").textContent();
    //    const actualText= await page.getByText(" double click").nth(1).textContent();
    expect(actualText).toContain("You have done a double click");

    // right click
    await page.getByRole("button", { name: "Right Click Me" }).click({ button: "right" })
    const actualText2 = await page.getByText("right click").nth(1).textContent();
    expect(actualText2).toContain("You have done a right click")

    await page.pause()
})

// alert handle
test("Handle Alert", async ({ page }) => {
    await page.goto("https://demoqa.com/alerts")
    page.on("dialog", async (dialog) => {
        console.log("Message: ", dialog.message())
        await dialog.accept();
    })
    await page.getByRole("button", { name: "Click me" }).first().click();

})

test("Form submission", async ({ page }) => {
    await page.goto("https://demoqa.com/text-box");
    await page.getByRole("textbox", { name: "Full Name" }).fill(faker.person.fullName())
    await page.getByPlaceholder("name@example.com").fill(`nadim+${generateRandomNumber(1000, 9000)}@gmail.com`);
    await page.getByRole("textbox", { exact: true }).nth(3).fill("Dhaka") // if there is no name use exact
    await page.getByRole("button", { name: "Submit" }).click();
    // await page.locator("#submit").click()
    await page.pause();

})

//scroll
test("Manual scroll", async ({ page }) => {
    await page.goto("https://demoqa.com/text-box");
    await page.evaluate(() => {
        window.scrollTo(0, 600)
    })
})

// handle new tab
test("Tab Handling", async ({ page, context }) => {
    // untill the new page appears from the context we have to wait for it
    // button click = event

    await page.goto("https://demoqa.com/browser-windows")
    const pagePromise = context.waitForEvent("page"); // waiting for a new “page” event.
    await page.getByRole("button", { name: "New Tab" }).click(); //event triggering
    const newPage = await pagePromise; // event occurred (new tab opened), await pagePromise resolves and gives you the handle (reference) to that new tab.
    // newPage analogy: “The new tab just appeared — now I have it in my hands as newPage.”
    const txtActual = await newPage.getByText("sample page").textContent();
    console.log(txtActual);
    await newPage.close();
    await page.getByRole("button", { name: "New Tab" }).click();
    await page.pause();
})


test("Window Handling", async ({ page, context }) => {
    await page.goto("https://demoqa.com/browser-windows", {
        waitUntil: "domcontentloaded",
        timeout: 75000,
    });
    const popupPromise = page.waitForEvent("popup");
    await page.getByRole("button", { name: "New Window" }).first().click();
    const popupPage = await popupPromise;
    const txtActual = await popupPage.getByText("sample page").textContent();
    console.log(txtActual);
    await popupPage.close();
    await page.pause();
});

// dropdown
test("Select static dropdown", async ({ page }) => {
    await page.goto("https://demoqa.com/select-menu");
    await page.getByRole("combobox", { exact: true }).selectOption({ label: "Blue" });
    await page.pause();
});

test("Select dynamic dropdown", async ({ page }) => {
    await page.goto("https://demoqa.com/select-menu");
    await page.locator("#withOptGroup").click();
    await page.locator("#react-select-2-input").press("ArrowDown");
    await page.locator("#react-select-2-input").press("Enter");
    await page.pause();
});

test("Upload Files",async({page})=>{
  await page.goto("https://demoqa.com/upload-download")
  const filepath=path.join(process.cwd(),'resources','logo.png');
  await page.locator("#uploadFile").setInputFiles(filepath);
  await page.pause();
})

test("Scrap table data", async ({ page }) => {
  await page.goto("https://demoqa.com/webtables");
  const tableTexts = await page.locator(".rt-tbody .rt-td").allInnerTexts();
  console.log(tableTexts);
  await page.pause();
});