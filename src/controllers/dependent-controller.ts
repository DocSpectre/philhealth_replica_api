import { DependentFull } from "../model/api/dependent-api";
import { DependentService } from "../service/dependent-service";

export class DependentController {
    private dependentService: DependentService;

    constructor() {
        this.dependentService = DependentService.getInstance();
    }
    public async createDependent(reqBody: DependentFull) {
        try {
            console.log('Inserting record to dependent table...', reqBody);
            const result = await this.dependentService.createDependent(reqBody);
            return result;
        } catch (error) {
            console.error(`Error during insertion to dependent table`, error);
            throw error;
        }
    }

    public async getDependentById(dependentId: number) {
        try {
            console.log('Retrieving dependent record...', { dependentId });
            const result = await this.dependentService.getDependentById(dependentId);
            return result;
        } catch (error) {
            console.error(`Error during retrieval of record from dependent table`, error);
            throw error;
        }
    }

    public async getMultipleDependents() {
        try {
            console.log('Retrieving multiple dependent record...',);
            const result = await this.dependentService.getMultipleDependent(5, 0);
            return result;
        } catch (error) {
            console.error(`Error during retrieval of record from dependent table`, error);
            throw error;
        }
    }

    public async updateDependent(reqBody: DependentFull, dependent_id: number) {
        try {
            console.log('Updating dependent record...', { dependent_id, reqBody });
            const result = await this.dependentService.updateDependent({ dependent_id, ...reqBody });
            return result;
        } catch (error) {
            console.error(`Error during update to dependent table`, error);
            throw error;
        }
    }

    public async deleteDependent(id: number) {
        try {
            console.log('Deleting dependent record...',);
            const result = await this.dependentService.deleteDependent(id);
            return result;
        } catch (error) {
            console.error(`Error during deletion to dependent table`, error);
            throw error;
        }
    }
}