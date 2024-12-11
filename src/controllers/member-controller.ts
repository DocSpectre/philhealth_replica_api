import { MemberInitial } from "../model/api/member-api";
import { MemberService } from "../service/member-service";

export class MemberController {
    private memberService: MemberService;

    constructor() {
        this.memberService = MemberService.getInstance();
    }
    public async createMember(reqBody: MemberInitial) {
        try {
            console.log('Inserting record to member table...', reqBody);
            const result = await this.memberService.createMember(reqBody);
            return result;
        } catch (error) {
            console.error(`Error during insertion to member table`, error);
            throw error;
        }
    }

    public async getMemberById(memberId: number) {
        try {
            console.log('Retrieving member record...', { memberId });
            const result = await this.memberService.getMemberById(memberId);
            return result;
        } catch (error) {
            console.error(`Error during retrieval of record from member table`, error);
            throw error;
        }
    }

    public async getMultipleMembers() {
        try {
            console.log('Retrieving multiple member record...',);
            const result = await this.memberService.getMultipleMember(5, 0);
            return result;
        } catch (error) {
            console.error(`Error during retrieval of record from member table`, error);
            throw error;
        }
    }

    public async updateMember(reqBody: MemberInitial, member_id: number) {
        try {
            console.log('Updating member record...', { member_id, reqBody });
            const result = await this.memberService.updateMember({ id: member_id, ...reqBody });
            return result;
        } catch (error) {
            console.error(`Error during update to member table`, error);
            throw error;
        }
    }

    public async deleteMember(id: number) {
        try {
            console.log('Deleting member record...',);
            const result = await this.memberService.deleteMember(id);
            return result;
        } catch (error) {
            console.error(`Error during deletion to member table`, error);
            throw error;
        }
    }
}