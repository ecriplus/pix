import { Page } from '@playwright/test';
export class ChallengePage {
  constructor(public readonly page: Page) {}

  async getChallengeImprint() {
    const instruction = await this.page.locator('p', { hasText: 'ninaimprint' }).textContent();
    if (!instruction) throw new Error('No ninaimprint found in instruction for challenge');
    const match = instruction.match(/ninaimprint (\d+)/);
    const challengeNumber = match?.[1];
    if (!challengeNumber) throw new Error('No ninaimprint found in instruction for challenge');
    return challengeNumber;
  }

  async setRightOrWrongAnswer(shouldAnswerCorrectly: boolean) {
    await this.page.getByRole('radio', { name: shouldAnswerCorrectly ? 'Oui.' : 'Non.' }).check();
  }

  async skip() {
    const previousUrl = this.page.url();
    const challengeNumber = await this.getChallengeImprint();
    const validateAnswerButton = this.page.getByRole('button', {
      name: 'Je passe et je vais à la prochaine question',
    });
    // Forces to wait until next challenge is loaded
    const selector = `p:has-text("ninaimprint ${challengeNumber}")`;
    await validateAnswerButton.click();
    await this.page.waitForSelector(selector, { state: 'detached' });
    const hasLoader = await this.page.locator('.app-loader').isVisible();
    if (hasLoader) {
      await this.page.waitForSelector('.app-loader', { state: 'detached' });
    }
    await this.page.waitForURL((url) => url.toString() !== previousUrl);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async validateAnswer() {
    const previousUrl = this.page.url();
    const challengeNumber = await this.getChallengeImprint();
    const validateAnswerButton = this.page.getByRole('button', {
      name: 'Je valide et je vais à la prochaine question',
    });
    // Forces to wait until next challenge is loaded
    const selector = `p:has-text("ninaimprint ${challengeNumber}")`;
    await validateAnswerButton.click();
    await this.page.waitForSelector(selector, { state: 'detached' });
    const hasLoader = await this.page.locator('.app-loader').isVisible();
    if (hasLoader) {
      await this.page.waitForSelector('.app-loader', { state: 'detached' });
    }
    await this.page.waitForURL((url) => url.toString() !== previousUrl);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async hasUserLeveledUp() {
    const notification = this.page.getByText('Niveau 1 gagné !');
    try {
      await notification.waitFor({ timeout: 200 });
      return true;
    } catch {
      return false;
    }
  }

  async leave() {
    await this.page.getByRole('button', { name: 'Quitter' }).click();
    await this.page.getByRole('link', { name: "Quitter l'épreuve et retourner à la page d'accueil" }).click();
  }

  async getCertificationNumber() {
    return await this.page.locator('.certification-number__value').innerText();
  }
}
