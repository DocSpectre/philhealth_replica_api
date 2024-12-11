import express, { NextFunction, Request, Response } from 'express';
import { DependentController } from '../controllers/dependent-controller';
import { DependentFull } from '../model/api/dependent-api';

const router = express.Router();
const employerController = new DependentController();

router.route('/')
    .post(async function (req: Request, res: Response, next: NextFunction) {
        try {
            const reqBody: DependentFull = req.body;
            const result = await employerController.createDependent(reqBody);
            res.status(201).send();
        } catch (error) {
            next(error);
        }
    })
    .get(async function (req: Request, res: Response, next: NextFunction) {
        try {
            const result = await employerController.getMultipleDependents();
            res.json(result);
        } catch (error) {
            next(error);
        }
    });


router.route('/:employer_id')
    .get(async function (req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.employer_id;
            const result = await employerController.getDependentById(Number(id));
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
            const id = req.params.employer_id;
            const reqBody = req.body;
            const result = await employerController.updateDependent(reqBody, Number(id));
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
            const id = req.params.employer_id;
            const result = await employerController.deleteDependent(Number(id));
            res.json(result);
        } catch (error) {
            next(error);
        }
    });

export default router;