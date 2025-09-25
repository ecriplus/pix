import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Service | QrocmSolutionVerification', function (hooks) {
  setupTest(hooks);

  module('#applyTolerancesToSolutions(solutions, enabledTolerances)', function () {
    test('t1 and t2 should be executed (lowerCase, trim, breaking space)', function (assert) {
      // given
      const solutions = { '3lettres': ['OUI', 'NON   '], '4lettres': ['Good', 'Bad'] };
      const enabledTolerances = { '3lettres': ['t1', 't2'], '4lettres': ['t1', 't2'] };
      const qrocmSolutionVerificationService = this.owner.lookup('service:qrocm-solution-verification');

      // when
      const actual = qrocmSolutionVerificationService.applyTolerancesToSolutions(solutions, enabledTolerances);

      // then
      const expected = { '3lettres': ['oui', 'non'], '4lettres': ['good', 'bad'] };
      assert.deepEqual(actual, expected);
    });
  });

  module('#applyTolerancesToAnswers(answers, enabledTolerances)', function () {
    test('should be transformed in string', function (assert) {
      // given
      const qrocmSolutionVerificationService = this.owner.lookup('service:qrocm-solution-verification');
      const answers = { Num1: 1, Num2: 2 };
      const enabledTolerances = { Num1: ['t1', 't2'], Num2: ['t1', 't2'] };

      // when
      const actual = qrocmSolutionVerificationService.applyTolerancesToAnswers(answers, enabledTolerances);

      // then
      const expected = { Num1: '1', Num2: '2' };
      assert.deepEqual(actual, expected);
    });

    test('should be transformed', function (assert) {
      // given
      const answers = { Num1: 1, Num2: 2 };
      const enabledTolerances = { Num1: [], Num2: [] };
      const qrocmSolutionVerificationService = this.owner.lookup('service:qrocm-solution-verification');

      // when
      const actual = qrocmSolutionVerificationService.applyTolerancesToAnswers(answers, enabledTolerances);

      // then
      const expected = { Num1: '1', Num2: '2' };
      assert.deepEqual(actual, expected);
    });
  });

  module('#areAnswersComparableToSolutions', function () {
    module('when there is no solutions for one input', function () {
      test('should return false', function (assert) {
        // given
        const qrocmSolutionVerificationService = this.owner.lookup('service:qrocm-solution-verification');
        const answers = { phraseSansSolution: 'lasagne', phrase1: "Le silence est d'ours", phrase2: 'facebook' };
        const solutions = { phrase1: ["Le silence est d'or"], phrase2: ['facebook'] };

        // when
        const actual = qrocmSolutionVerificationService.areAnswersComparableToSolutions(answers, solutions);

        // then
        assert.false(actual);
      });
    });

    module('when there is a corresponding solution for all answers', function () {
      test('should return true', function (assert) {
        // given
        const qrocmSolutionVerificationService = this.owner.lookup('service:qrocm-solution-verification');
        const answers = { phraseAvecSolution: 'lasagne', phrase1: "Le silence est d'ours", phrase2: 'facebook' };
        const solutions = { phraseAvecSolution: ['lasagne'], phrase1: ["Le silence est d'or"], phrase2: ['facebook'] };

        // when
        const actual = qrocmSolutionVerificationService.areAnswersComparableToSolutions(answers, solutions);

        // then
        assert.true(actual);
      });
    });
  });

  module('#compareAnswersAndSolutions', function () {
    module('when T3 is disabled', function () {
      test('should return results comparing answers and solutions strictly', function (assert) {
        // given
        const answers = { Num1: '1', Num2: '3' };
        const solutions = { Num1: ['1', 'un', '01'], Num2: ['2', 'deux', '02'] };
        const allTolerancesDisabled = [];
        const qrocmSolutionVerificationService = this.owner.lookup('service:qrocm-solution-verification');

        // when
        const actual = qrocmSolutionVerificationService.compareAnswersAndSolutions(
          answers,
          solutions,
          allTolerancesDisabled,
        );

        // then
        const expected = { Num1: true, Num2: false };
        assert.deepEqual(actual, expected);
      });
    });

    module('when T3 is enabled', function () {
      test('should return results comparing answers and solutions with Levenshtein ratio', function (assert) {
        // given
        const answers = { phrase1: "Le silence est d'ours", phrase2: 'faceboo', phrase3: 'lasagne' };
        const solutions = { phrase1: ["Le silence est d'or"], phrase2: ['facebook'], phrase3: ['engasal'] };
        const t3ToleranceEnabled = { phrase1: ['t3'], phrase2: ['t3'], phrase3: ['t3'] };
        const qrocmSolutionVerificationService = this.owner.lookup('service:qrocm-solution-verification');

        // when
        const actual = qrocmSolutionVerificationService.compareAnswersAndSolutions(
          answers,
          solutions,
          t3ToleranceEnabled,
        );

        // then
        const expected = { phrase1: true, phrase2: true, phrase3: false };
        assert.deepEqual(actual, expected);
      });
    });
  });

  module('#formatResult', function () {
    module('when one user responses is incorrect', function () {
      test('should return false', function (assert) {
        // given
        const qrocmSolutionVerificationService = this.owner.lookup('service:qrocm-solution-verification');
        const resultDetails = { phrase1: true, phrase2: false, phrase3: true };

        // when
        const actual = qrocmSolutionVerificationService.formatResult(resultDetails);

        // then
        assert.false(actual);
      });
    });

    module('when all user responses are correct', function () {
      test('should return true', function (assert) {
        // given
        const resultDetails = { phrase1: true, phrase2: true, phrase3: true };
        const qrocmSolutionVerificationService = this.owner.lookup('service:qrocm-solution-verification');

        // when
        const actual = qrocmSolutionVerificationService.formatResult(resultDetails);

        // then
        assert.true(actual);
      });
    });
  });

  module('Nominal and weird, combined cases', function () {
    const successfulCases = [
      {
        case: '(nominal case) Each answer strictly respect a corresponding solution',
        result: true,
        userResponses: [
          { input: '9lettres', answer: 'courgette' },
          { input: '6lettres', answer: 'tomate' },
        ],
        proposals: [
          {
            input: '9lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['courgette'],
            tolerances: ['t1', 't2', 't3'],
          },
          {
            input: '6lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['tomate'],
            tolerances: ['t1', 't2', 't3'],
          },
        ],
      },
      {
        case: 'solution contains numbers',
        result: true,
        userResponses: [
          { input: 'num1', answer: '888' },
          { input: 'num2', answer: '64' },
        ],
        proposals: [
          {
            input: 'num1',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['888'],
            tolerances: ['t1', 't2', 't3'],
          },
          {
            input: 'num2',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['64'],
            tolerances: ['t1', 't2', 't3'],
          },
        ],
      },
      {
        case: 'solution contains decimal numbers with a comma',
        result: true,
        userResponses: [
          { input: 'num1', answer: '888,00' },
          { input: 'num2', answer: '64' },
        ],
        proposals: [
          {
            input: 'num1',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['888,00'],
            tolerances: ['t1', 't2', 't3'],
          },
          {
            input: 'num2',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['64'],
            tolerances: ['t1', 't2', 't3'],
          },
        ],
      },
      {
        case: 'solution contains decimal numbers with a dot',
        result: true,
        userResponses: [
          { input: 'num1', answer: '888.00' },
          { input: 'num2', answer: '64' },
        ],
        proposals: [
          {
            input: 'num1',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['888.00'],
            tolerances: ['t1', 't2', 't3'],
          },
          {
            input: 'num2',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['64'],
            tolerances: ['t1', 't2', 't3'],
          },
        ],
      },
      {
        case: 'leading/trailing spaces in solution',
        result: true,
        userResponses: [
          { input: '9lettres', answer: 'c o u r g e t t e' },
          { input: '6lettres', answer: 't o m a t e' },
        ],
        proposals: [
          {
            input: '9lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: [' courgette '],
            tolerances: ['t1', 't2', 't3'],
          },
          {
            input: '6lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: [' tomate ', ' chicon ', ' legume '],
            tolerances: ['t1', 't2', 't3'],
          },
        ],
      },
      {
        case: 'uppercases and leading/trailing spaces in solution',
        result: true,
        userResponses: [
          { input: '9lettres', answer: 'c o u r g e t t e' },
          { input: '6lettres', answer: 't o m a t e' },
        ],
        proposals: [
          {
            input: '9lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['COUrgETTE'],
            tolerances: ['t1', 't2', 't3'],
          },
          {
            input: '6lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['TOmaTE', 'CHICON', 'LEGUME'],
            tolerances: ['t1', 't2', 't3'],
          },
        ],
      },
      {
        case: 'spaces in answer',
        result: true,
        userResponses: [
          { input: '9lettres', answer: 'c o u r g e t t e' },
          { input: '6lettres', answer: 't o m a t e' },
        ],
        proposals: [
          {
            input: '9lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['courgette'],
            tolerances: ['t1', 't2', 't3'],
          },
          {
            input: '6lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['tomate', 'chicon', 'legume'],
            tolerances: ['t1', 't2', 't3'],
          },
        ],
      },
      {
        case: 'answer with levenshtein distance below 0.25',
        result: true,
        userResponses: [
          { input: '9lettres', answer: 'ourgette' },
          { input: '6lettres', answer: 'tomae' },
        ],
        proposals: [
          {
            input: '9lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['courgette'],
            tolerances: ['t1', 't2', 't3'],
          },
          {
            input: '6lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['tomate', 'chicon', 'legume'],
            tolerances: ['t1', 't2', 't3'],
          },
        ],
      },
      {
        case: 'answer with uppercases',
        result: true,
        userResponses: [
          { input: '9lettres', answer: 'COURGETTE' },
          { input: '6lettres', answer: 'TOMATE' },
        ],
        proposals: [
          {
            input: '9lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['courgette'],
            tolerances: ['t1', 't2', 't3'],
          },
          {
            input: '6lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['tomate', 'chicon', 'legume'],
            tolerances: ['t1', 't2', 't3'],
          },
        ],
      },
      {
        case: 'answer with uppercases and spaces',
        result: true,
        userResponses: [
          { input: '9lettres', answer: 'C O U R G E T T E' },
          { input: '6lettres', answer: 'T O M A T E' },
        ],
        proposals: [
          {
            input: '9lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['courgette'],
            tolerances: ['t1', 't2', 't3'],
          },
          {
            input: '6lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['tomate', 'chicon', 'legume'],
            tolerances: ['t1', 't2', 't3'],
          },
        ],
      },
      {
        case: 'answer with uppercases spaces, and levenshtein > 0 but <= 0.25',
        result: true,
        userResponses: [
          { input: '9lettres', answer: 'C O U G E T T E' },
          { input: '6lettres', answer: ' O M A T E' },
        ],
        proposals: [
          {
            input: '9lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['courgette'],
            tolerances: ['t1', 't2', 't3'],
          },
          {
            input: '6lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['tomate', 'chicon', 'legume'],
            tolerances: ['t1', 't2', 't3'],
          },
        ],
      },
      {
        case: 'answer with uppercases spaces, and levenshtein > 0 but <= 0.25, and accents',
        result: true,
        userResponses: [
          { input: '9lettres', answer: 'ç O u -- ;" ;--- _ \' grè TTÊ' },
          { input: '6lettres', answer: ' O M A T E' },
        ],
        proposals: [
          {
            input: '9lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['courgette'],
            tolerances: ['t1', 't2', 't3'],
          },
          {
            input: '6lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['tomate', 'chicon', 'legume'],
            tolerances: ['t1', 't2', 't3'],
          },
        ],
      },
      {
        case: 'unbreakable spaces in answer',
        result: true,
        userResponses: [
          { input: '9lettres', answer: 'c o u r g e t t e' },
          { input: '6lettres', answer: ' t o m a t e' },
        ],
        proposals: [
          {
            input: '9lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['courgette'],
            tolerances: ['t1', 't2', 't3'],
          },
          {
            input: '6lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['tomate', 'chicon', 'legume'],
            tolerances: ['t1', 't2', 't3'],
          },
        ],
      },
      {
        case: 'Solution has spaces in-between',
        result: true,
        userResponses: [
          { input: '9lettres', answer: 'abcdefg' },
          { input: '6lettres', answer: 'ghjkl' },
        ],
        proposals: [
          {
            input: '9lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['a b c d e f g'],
            tolerances: ['t1', 't2', 't3'],
          },
          {
            input: '6lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['ghjklm', 'ghjklp', 'ghjklz'],
            tolerances: ['t1', 't2', 't3'],
          },
        ],
      },
      {
        case: 'Each answer correctly match its solution, with worst levenshtein distance below or equal to 0.25',
        result: true,
        userResponses: [
          { input: '9lettres', answer: 'abcd' },
          { input: '6lettres', answer: 'ghjkl' },
        ],
        proposals: [
          {
            input: '9lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['abcde'],
            tolerances: ['t1', 't2', 't3'],
          },
          {
            input: '6lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['ghjklm', 'ghjklp', 'ghjklz'],
            tolerances: ['t1', 't2', 't3'],
          },
        ],
      },
    ];

    successfulCases.forEach(function (testCase) {
      const userResponse = testCase.userResponses.map((ur) => ur.answer).join();
      test(
        testCase.case +
          ', should return true  "' +
          userResponse +
          '" and solution is "' +
          encodeURI(testCase.solution) +
          '"',
        function (assert) {
          const qrocmSolutionVerificationService = this.owner.lookup('service:qrocm-solution-verification');

          assert.deepEqual(
            qrocmSolutionVerificationService.match({
              userResponses: testCase.userResponses,
              proposals: testCase.proposals,
            }),
            testCase.result,
          );
        },
      );
    });

    const failingCases = [
      {
        case: 'solution do not exists',
        result: false,
        userResponses: [
          { input: '9lettres', answer: 'any answer' },
          { input: '6lettres', answer: 'any answer' },
        ],
        proposals: [
          {
            input: '9lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            tolerances: ['t1', 't2', 't3'],
          },
          {
            input: '6lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            tolerances: ['t1', 't2', 't3'],
          },
        ],
      },
      {
        case: 'solution is empty',
        userResponses: [
          { input: '9lettres', answer: 'any answer' },
          { input: '6lettres', answer: 'any answer' },
        ],
        proposals: [
          {
            input: '9lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: [],
            tolerances: ['t1', 't2', 't3'],
          },
          {
            input: '6lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: [],
            tolerances: ['t1', 't2', 't3'],
          },
        ],
        result: false,
      },
      {
        case: 'answer is not a valid object',
        result: false,
        userResponses: [
          { input: '9lettres', answer: 'courgette' },
          { input: '6lettres', answer: new Date() },
        ],
        proposals: [
          {
            input: '9lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['courgette'],
            tolerances: ['t1', 't2', 't3'],
          },
          {
            input: '6lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['tomate', 'chicon', 'legume'],
            tolerances: ['t1', 't2', 't3'],
          },
        ],
      },
      {
        case: 'Each answer points to the solution of another question',
        result: false,
        userResponses: [
          { input: '9lettres', answer: 'tomate' },
          { input: '6lettres', answer: 'courgette' },
        ],
        proposals: [
          {
            input: '9lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['courgette'],
            tolerances: ['t1', 't2', 't3'],
          },
          {
            input: '6lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['tomate', 'chicon', 'legume'],
            tolerances: ['t1', 't2', 't3'],
          },
        ],
      },
      {
        case: 'One of the levenshtein distance is above 0.25',
        result: false,
        userResponses: [
          { input: '9lettres', answer: 'abcde' },
          { input: '6lettres', answer: 'ghjkl' },
        ],
        proposals: [
          {
            input: '9lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['abcdefg'],
            tolerances: ['t1', 't2', 't3'],
          },
          {
            input: '6lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['ghjklm', 'ghjklp', 'ghjklz'],
            tolerances: ['t1', 't2', 't3'],
          },
        ],
      },
      {
        case: 'All of the levenshtein distances are above 0.25',
        result: false,
        userResponses: [
          { input: '9lettres', answer: 'abcde' },
          { input: '6lettres', answer: 'ghjklpE11!!' },
        ],
        proposals: [
          {
            input: '9lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['abcdefg'],
            tolerances: ['t1', 't2', 't3'],
          },
          {
            input: '6lettres',
            type: 'input',
            display: 'block',
            placeholder: '',
            ariaLabel: 'select-aria',
            defaultValue: '',
            solutions: ['ghjklm', 'ghjklp', 'ghjklz'],
            tolerances: ['t1', 't2', 't3'],
          },
        ],
      },
    ];

    failingCases.forEach(function (testCase) {
      const userAnswer = testCase.userResponses.map((ur) => ur.answer).join();
      const solution = testCase.proposals.map((p) => (p.solutions ? p.solutions.join() : 'no solution')).join();
      test(
        testCase.case +
          ', should return "false" when answer is "' +
          userAnswer +
          '" and solution is "' +
          solution +
          '"',
        function (assert) {
          const qrocmSolutionVerificationService = this.owner.lookup('service:qrocm-solution-verification');

          assert.deepEqual(
            qrocmSolutionVerificationService.match({
              userResponses: testCase.userResponses,
              proposals: testCase.proposals,
            }),
            testCase.result,
          );
        },
      );
    });
  });

  module('when the QROCM is of type select', function () {
    test('should return true when answer is correct', function (assert) {
      // given
      const qrocmSolutionVerificationService = this.owner.lookup('service:qrocm-solution-verification');
      const userResponses = [{ input: 'question1', answer: '2' }];
      const proposals = [
        {
          input: 'question1',
          type: 'select',
          display: 'block',
          placeholder: 'Selectionner réponse',
          options: [
            {
              id: '1',
              content: 'bleu',
            },
            {
              id: '2',
              content: 'rouge',
            },
          ],
          solutions: ['2'],
        },
      ];

      // when
      const result = qrocmSolutionVerificationService.match({ userResponses, proposals });

      // then
      assert.true(result);
    });
  });
});
