import { EmployerFull } from "../model/api/employer-api";
import { EmployerService } from "../service/employer-service";

export class EmployerController {
    private employerService: EmployerService;

    constructor() {
        this.employerService = EmployerService.getInstance();
    }
    public async createEmployer(reqBody: EmployerFull) {
        try {
            console.log('Inserting record to employer table...', reqBody);
            const result = await this.employerService.createEmployer(reqBody);
            return result;
        } catch (error) {
            console.error(`Error during insertion to employer table`, error);
            throw error;
        }
    }

    public async getEmployerById(employerId: number) {
        try {
            console.log('Retrieving employer record...', { employerId });
            const result = await this.employerService.getEmployerById(employerId);
            return result;
        } catch (error) {
            console.error(`Error during retrieval of record from employer table`, error);
            throw error;
        }
    }

    public async getMultipleEmployers() {
        try {
            console.log('Retrieving multiple employer record...',);
            const result = await this.employerService.getMultipleEmployer(5, 0);
            return result;
        } catch (error) {
            console.error(`Error during retrieval of record from employer table`, error);
            throw error;
        }
    }

    public async updateEmployer(reqBody: EmployerFull, employer_number: number) {
        try {
            console.log('Updating employer record...', { employer_id: employer_number, reqBody });
            const result = await this.employerService.updateEmployer({ employer_number, ...reqBody });
            return result;
        } catch (error) {
            console.error(`Error during update to employer table`, error);
            throw error;
        }
    }

    public async deleteEmployer(id: number) {
        try {
            console.log('Deleting employer record...',);
            const result = await this.employerService.deleteEmployer(id);
            return result;
        } catch (error) {
            console.error(`Error during deletion to employer table`, error);
            throw error;
        }
    }
}