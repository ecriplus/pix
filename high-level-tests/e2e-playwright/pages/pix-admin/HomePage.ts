import type { Page } from '@playwright/test';

import { CertificationSessionsMainPage, OrganizationsListPage, UsersListPage } from './index.ts';

export class HomePage {
  constructor(public readonly page: Page) {}

  async goToCertificationSessionsTab() {
    await this.page.getByRole('link', { name: 'Sessions de certification', exact: true }).click();
    await this.page.waitForURL(/\/sessions\/list\/with-required-action\?version=3$/);

    return new CertificationSessionsMainPage(this.page);
  }

  async goToUsersTab() {
    await this.page.getByRole('link', { name: 'Utilisateurs', exact: true }).click();
    await this.page.waitForURL(/\/users\/list$/);

    return new UsersListPage(this.page);
  }

  async goToOrganizationsTab() {
    await this.page.getByRole('link', { name: 'Organisations', exact: true }).click();
    await this.page.waitForURL(/\/organizations\/list$/);

    return new OrganizationsListPage(this.page);
  }
}
