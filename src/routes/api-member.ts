import express, { NextFunction, Request, Response } from 'express';
import { MemberController } from '../controllers/member-controller';
import { MemberFull, MemberId, MemberInitial } from '../model/api/member-api';

const router = express.Router();
const memberController = new MemberController();

router.route('/')
    .post(async function (req: Request, res: Response, next: NextFunction) {
        try {
            const reqBody: MemberFull = req.body;
            const result = await memberController.createMember(reqBody);
            res.status(201).send();
        } catch (error) {
            next(error);
        }
    })
    .get(async function (req: Request, res: Response, next: NextFunction) {
        try {
            const result = await memberController.getMultipleMembers();
            res.json(result);
        } catch (error) {
            next(error);
        }
    });


router.route('/:member_id')
    .get(async function (req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.member_id;
            const result = await memberController.getMemberById(Number(id));
            if (!result) {
                return res.status(404).json({ message: "Invalid data."});
            }
            res.json(result);
        } catch (error) {
            next(error);
        }
    })
    .put(async function (req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.member_id;
            const reqBody = req.body;
            const result = await memberController.updateMember(reqBody, Number(id));
            if (!result) {
                return res.status(404).json({ message: "Not Found."});
            }
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    })
    .delete(async function (req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.member_id;
            const result = await memberController.deleteMember(Number(id));
            res.json(result);
        } catch (error) {
            next(error);
        }
    });

export default router;