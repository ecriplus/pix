import { JobController } from '../../../../shared/application/jobs/job-controller.js';
import { ParticipationResultCalculationJob } from '../../domain/models/ParticipationResultCalculationJob.js';
import { usecases } from '../../domain/usecases/index.js';

export class ParticipationResultCalculationJobController extends JobController {
  constructor() {
    super(ParticipationResultCalculationJob.name);
  }

  async handle({ data }) {
    const { campaignParticipationId } = data;

    await usecases.saveComputedCampaignParticipationResult({ campaignParticipationId });
  }
}
