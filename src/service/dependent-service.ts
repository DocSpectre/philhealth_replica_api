import { DependentDAO } from "../dao/dependent-dao";
import { DependentFull, DependentId,  } from "../model/api/dependent-api";
import { DatabaseService } from "./database-service";

export class DependentService {
    private static instance: DependentService;
    private dependentDAO: DependentDAO;

    constructor() {
        this.dependentDAO = DependentDAO.getInstance();
    }

    public static getInstance(): DependentService {
        if (!DependentService.instance) {
            DependentService.instance = new DependentService();
        }
        return DependentService.instance;
    }

    public async createDependent(dependent: DependentFull) {
        const result = this.dependentDAO.create(dependent);
        return result;
    }


    public async getDependentById(dependentId: number) {
        const result = this.dependentDAO.findById(dependentId);
        return result;
    }

    public async getMultipleDependent(limit: number, offset: number) {
        const result = this.dependentDAO.findAll(limit, offset);
        return result;
    }

    public async updateDependent(dependent: DependentFull) {
        const result = this.dependentDAO.update(dependent);
        return result;
    }

    public async deleteDependent(dependentId: number) {
        const result = this.dependentDAO.delete(dependentId);
        return result;
    }
}