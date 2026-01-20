import { Page } from '@playwright/test';

export function* rightWrongAnswerCycle({ numRight = 1, numWrong = 1 }) {
  const answers: boolean[] = [];

  for (let i = 0; i < numRight; i++) {
    answers.push(true);
  }
  for (let i = 0; i < numWrong; i++) {
    answers.push(false);
  }

  let i = 0;
  while (true) {
    yield answers[i % answers.length];
    i++;
  }
}

export async function getStringValueFromDescriptionList(page: Page, dataTestId: string, dtLabel: string) {
  const dd = await getLocatorFromDescriptionList(page, dataTestId, dtLabel);
  return (await dd.innerText()).trim();
}

export async function getNumberValueFromDescriptionList(page: Page, dataTestId: string, dtLabel: string) {
  const val = await getStringValueFromDescriptionList(page, dataTestId, dtLabel);
  return Number(val);
}

/* This util method is tightly coupled to the expectations that the description list has a datatest-id
 It could be a more maintainable and a11y friendly way to read data from it, if you find it be our guests !
 */
async function getLocatorFromDescriptionList(page: Page, dataTestId: string, dtLabel: string) {
  const dts = page.getByTestId(dataTestId).locator('dt');
  const count = await dts.count();

  for (let i = 0; i < count; i++) {
    const dt = dts.nth(i);
    const text = await dt.evaluate((el) => el.textContent!.replace(/\s+/g, ' ').trim());

    if (text === dtLabel) {
      return dt.locator('xpath=following-sibling::dd[1]');
    }
  }

  throw new Error(`No dt found with label: "${dtLabel}"`);
}
