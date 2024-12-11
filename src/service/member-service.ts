import { MemberDao } from "../dao/member-dao";
import { MemberFull, MemberId, MemberInitial } from "../model/api/member-api";
import { DatabaseService } from "./database-service";

export class MemberService {
    private static instance: MemberService;
    private memberDAO: MemberDao;

    constructor() {
        this.memberDAO = MemberDao.getInstance();
    }

    public static getInstance(): MemberService {
        if (!MemberService.instance) {
            MemberService.instance = new MemberService();
        }
        return MemberService.instance;
    }

    public async createMember(member: MemberInitial) {
        const result = this.memberDAO.create(member);
        return result;
    }


    public async getMemberById(memberId: number) {
        const result = this.memberDAO.findById(memberId);
        return result;
    }

    public async getMultipleMember(limit: number, offset: number) {
        const result = this.memberDAO.findAll(limit, offset);
        return result;
    }

    public async updateMember(member: MemberFull) {
        const result = this.memberDAO.update(member);
        return result;
    }

    public async deleteMember(memberId: number) {
        const result = this.memberDAO.delete(memberId);
        return result;
    }
}