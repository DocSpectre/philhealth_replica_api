import { ContributionDAO } from "../dao/contribution-dao";
import { ContributionFull, ContributionId,  } from "../model/api/contribution-api";

export class ContributionService {
    private static instance: ContributionService;
    private contributionDAO: ContributionDAO;

    constructor() {
        this.contributionDAO = ContributionDAO.getInstance();
    }

    public static getInstance(): ContributionService {
        if (!ContributionService.instance) {
            ContributionService.instance = new ContributionService();
        }
        return ContributionService.instance;
    }

    public async createContribution(contribution: ContributionFull) {
        const result = this.contributionDAO.create(contribution);
        return result;
    }


    public async getContributionById(contributionId: number) {
        const result = this.contributionDAO.findById(contributionId);
        return result;
    }

    public async getMultipleContribution(limit: number, offset: number) {
        const result = this.contributionDAO.findAll(limit, offset);
        return result;
    }

    public async updateContribution(contribution: ContributionFull) {
        const result = this.contributionDAO.update(contribution);
        return result;
    }

    public async deleteContribution(contributionId: number) {
        const result = this.contributionDAO.delete(contributionId);
        return result;
    }
}