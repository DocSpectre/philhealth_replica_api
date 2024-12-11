import { EmployerDAO } from "../dao/employer-dao";
import { EmployerFull, EmployerId,  } from "../model/api/employer-api";
import { DatabaseService } from "./database-service";

export class EmployerService {
    private static instance: EmployerService;
    private employerDAO: EmployerDAO;

    constructor() {
        this.employerDAO = EmployerDAO.getInstance();
    }

    public static getInstance(): EmployerService {
        if (!EmployerService.instance) {
            EmployerService.instance = new EmployerService();
        }
        return EmployerService.instance;
    }

    public async createEmployer(employer: EmployerFull) {
        const result = this.employerDAO.create(employer);
        return result;
    }


    public async getEmployerById(employerId: number) {
        const result = this.employerDAO.findById(employerId);
        return result;
    }

    public async getMultipleEmployer(limit: number, offset: number) {
        const result = this.employerDAO.findAll(limit, offset);
        return result;
    }

    public async updateEmployer(employer: EmployerFull) {
        const result = this.employerDAO.update(employer);
        return result;
    }

    public async deleteEmployer(employerId: number) {
        const result = this.employerDAO.delete(employerId);
        return result;
    }
}