import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

const DEFAULT_PAGE_NUMBER = 1;

export default class CombinedCoursesController extends Controller {
  @tracked pageNumber = DEFAULT_PAGE_NUMBER;
  @tracked pageSize = 25;

  get combinedCoursesCount() {
    return this.model.combinedCourses.meta?.rowCount || 0;
  }
}
