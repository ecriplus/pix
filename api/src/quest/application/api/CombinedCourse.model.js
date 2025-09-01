/**
 * Constructor wraps a quest CombinedCourse object
 * @class
 * @classdesc exposed CombinedCourse object from api
 */
export class CombinedCourse {
  /**
   * @typedef {object} CombinedCourseArgs
   * @property {number} id
   * @property {string} name
   */

  /**
   * @param {CombinedCourseArgs} args
   */
  constructor({ id, name }) {
    this.id = id;
    this.name = name;
  }
}
