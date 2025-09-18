import Service from '@ember/service';
import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import {
  areApproximatelyEqualAccordingToLevenshteinDistanceRatio,
  useLevenshteinRatio,
} from 'mon-pix/utils/levenshtein-validation';
import { applyTolerances } from 'mon-pix/utils/tolerances-validation';

export default class QrocmSolutionVerification extends Service {
  match({ userResponses, proposals }) {
    const answers = {};
    const values = {};
    const enabledTolerances = {};

    for (const response of userResponses) {
      answers[response.input] = response.answer;
    }

    for (const proposal of proposals) {
      values[proposal.input] = proposal.solutions;
      if (proposal.tolerances) {
        enabledTolerances[proposal.input] = proposal.tolerances;
      }
    }

    const solutions = { values, enabledTolerances };

    if (isString(answers) || isEmpty(answers) || !this._isValidObject(solutions.enabledTolerances)) {
      return false;
    }

    if (!this.areAnswersComparableToSolutions(answers, solutions.values)) {
      return false;
    }

    const treatedSolutions = this.applyTolerancesToSolutions(solutions.values, solutions.enabledTolerances);
    const treatedAnswers = this.applyTolerancesToAnswers(answers, solutions.enabledTolerances);

    const resultDetails = this.compareAnswersAndSolutions(
      treatedAnswers,
      treatedSolutions,
      solutions.enabledTolerances,
    );

    return this.formatResult(resultDetails);
  }

  applyTolerancesToSolutions(solutions, enabledTolerances) {
    const treatedSolutions = {};
    for (const solutionKey in solutions) {
      const solutionVariants = solutions[solutionKey];

      treatedSolutions[solutionKey] = solutionVariants.map((variant) => {
        const tolerancesForVariant = enabledTolerances[solutionKey];

        return applyTolerances(variant, tolerancesForVariant);
      });
    }

    return treatedSolutions;
  }

  applyTolerancesToAnswers(answers, enabledTolerances) {
    const treatedAnswers = {};
    for (const answerKey in answers) {
      const answer = answers[answerKey];
      const tolerancesForAnswer = enabledTolerances[answerKey];
      treatedAnswers[answerKey] = applyTolerances(answer, tolerancesForAnswer);
    }

    return treatedAnswers;
  }

  areAnswersComparableToSolutions(answers, solutions) {
    for (const answerKey in answers) {
      const solutionValue = solutions[answerKey];
      if (!solutionValue) {
        return false;
      }
    }
    return true;
  }

  compareAnswersAndSolutions(answers, solutions, enabledTolerances) {
    const results = {};
    for (const answerKey in answers) {
      const answer = answers[answerKey];
      const solutionVariants = solutions[answerKey];

      if (useLevenshteinRatio(enabledTolerances[answerKey])) {
        results[answerKey] = areApproximatelyEqualAccordingToLevenshteinDistanceRatio(answer, solutionVariants);
      } else if (solutionVariants) {
        results[answerKey] = solutionVariants.includes(answer);
      }
    }

    return results;
  }

  formatResult(resultDetails) {
    for (const resultDetail of Object.values(resultDetails)) {
      if (!resultDetail) {
        return false;
      }
    }
    return true;
  }

  _isValidObject(object) {
    return isObject(object);
  }
}
