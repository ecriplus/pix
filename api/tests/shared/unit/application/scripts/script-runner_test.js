import { databaseConnections } from '../../../../../db/database-connections.js';
import { Script } from '../../../../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../../../../src/shared/application/scripts/script-runner.js';
import { learningContentCache } from '../../../../../src/shared/infrastructure/caches/learning-content-cache.js';
import { expect, sinon } from '../../../../test-helper.js';

describe('Shared | Unit | Application | ScriptRunner', function () {
  let scriptFileUrl;
  let scriptRunStub;
  let ScriptClass;
  let isRunningFromCli;
  let logger;
  let getProcessArgs;

  beforeEach(function () {
    scriptFileUrl = 'file://script.js';
    isRunningFromCli = sinon.stub();
    logger = { info: sinon.stub(), error: sinon.stub() };
    getProcessArgs = sinon.stub();
    scriptRunStub = sinon.stub();
    ScriptClass = class extends Script {
      constructor() {
        super({
          description: 'Test script',
          permanent: true,
          options: { verbose: { type: 'boolean', default: false } },
          commands: {
            pouet: {
              description: 'la commande pouet',
              options: { volume: { type: 'integer', default: 11 } },
            },
          },
        });
      }
      async run(...args) {
        return scriptRunStub(...args);
      }
    };

    sinon.spy(databaseConnections.disconnect);
    sinon.stub(learningContentCache, 'quit');
  });

  context('when not running from CLI', function () {
    beforeEach(function () {
      isRunningFromCli.returns(false);
    });

    it('does not run the script', async function () {
      // given

      // when
      await ScriptRunner.execute(scriptFileUrl, ScriptClass, { logger, isRunningFromCli, getProcessArgs });

      // then
      expect(logger.info).not.to.have.been.called;
      expect(logger.error).not.to.have.been.called;
    });
  });

  context('when running from CLI', function () {
    beforeEach(function () {
      isRunningFromCli.returns(true);
    });

    it('parses process args and runs the script', async function () {
      // given
      scriptRunStub.resolves();
      getProcessArgs.returns(['--verbose', 'pouet', '--volume', '666']);

      // when
      await ScriptRunner.execute(scriptFileUrl, ScriptClass, { logger, isRunningFromCli, getProcessArgs });

      // then
      expect(logger.info).to.have.been.calledWith('Start script');
      expect(scriptRunStub).to.have.been.calledWith({
        command: 'pouet',
        options: { verbose: true, volume: 666 },
        logger,
      });
      expect(logger.info).to.have.been.calledWith('Script execution successful.');
    });

    context('when an error occurs in the script', function () {
      it('handles errors during script execution and log failure', async function () {
        // given
        scriptRunStub.rejects(new Error('Error!!!'));
        getProcessArgs.returns([]);

        // when
        await ScriptRunner.execute(scriptFileUrl, ScriptClass, { logger, isRunningFromCli, getProcessArgs });

        // then
        expect(scriptRunStub).to.have.been.calledOnce;
        expect(logger.error).to.have.been.calledWith('Script execution failed.');
        expect(logger.error).to.have.been.calledWithMatch(sinon.match.instanceOf(Error));
        expect(process.exitCode).to.equal(1);
      });
    });
  });
});
