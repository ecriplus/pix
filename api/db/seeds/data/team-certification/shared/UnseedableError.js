/**
 * When this error is thrown, it means that we could not fully build a full representative set of seeds
 * using the given Pix env configuration.
 *
 * IF THIS ERROR IS THROWN THE API IS WORKING, it just means that we could not populate some Pix functionalities
 * with fake data for those functionalities
 * You will either have to give the right env conf/data, or you will have to setup some of the functionalities manually.
 *
 * Example: Pix Certif expects some data from learning-content that are missing, meaning you will not be able
 * to have questions presented to you because there are no questions available
 */
export class UnseedableError extends Error {}
