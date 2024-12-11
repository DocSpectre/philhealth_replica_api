import { ContributionFull } from "../model/api/contribution-api";
import { ContributionService } from "../service/contribution";

export class ContributionController {
    private contributionService: ContributionService;

    constructor() {
        this.contributionService = ContributionService.getInstance();
    }
    public async createContribution(reqBody: ContributionFull) {
        try {
            console.log('Inserting record to contribution table...', reqBody);
            const result = await this.contributionService.createContribution(reqBody);
            return result;
        } catch (error) {
            console.error(`Error during insertion to contribution table`, error);
            throw error;
        }
    }

    public async getContributionById(contributionId: number) {
        try {
            console.log('Retrieving contribution record...', { contributionId });
            const result = await this.contributionService.getContributionById(contributionId);
            return result;
        } catch (error) {
            console.error(`Error during retrieval of record from contribution table`, error);
            throw error;
        }
    }

    public async getMultipleContributions() {
        try {
            console.log('Retrieving multiple contribution record...',);
            const result = await this.contributionService.getMultipleContribution(5, 0);
            return result;
        } catch (error) {
            console.error(`Error during retrieval of record from contribution table`, error);
            throw error;
        }
    }

    public async updateContribution(reqBody: ContributionFull, contribution_id: number) {
        try {
            console.log('Updating contribution record...', { contribution_id, reqBody });
            const result = await this.contributionService.updateContribution({ employer_number: contribution_id, ...reqBody });
            return result;
        } catch (error) {
            console.error(`Error during update to contribution table`, error);
            throw error;
        }
    }

    public async deleteContribution(id: number) {
        try {
            console.log('Deleting contribution record...',);
            const result = await this.contributionService.deleteContribution(id);
            return result;
        } catch (error) {
            console.error(`Error during deletion to contribution table`, error);
            throw error;
        }
    }
}