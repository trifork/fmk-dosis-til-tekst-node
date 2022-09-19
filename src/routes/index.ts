import express from "express";
import {DosisTilTekstController} from "../controllers/dosisTilTekstController";

const router = express.Router();


router.post("/getDosageProposalResult", async (_req, res) => {
    const controller = new DosisTilTekstController();
    const response = await controller.getDosageProposalResult(_req.body);
    return res.send(response);
});

router.post("/convertCombined", async (_req, res) => {
    const controller = new DosisTilTekstController();
    const response = await controller.convertCombined(_req.body);
    return res.send(response);
});

router.post("/convertLongText", async (_req, res) => {
    const controller = new DosisTilTekstController();
    const response = await controller.convertLongText(_req.body);
    return res.send(response);
});

router.post("/convertShortText", async (_req, res) => {
    const controller = new DosisTilTekstController();
    const response = await controller.convertShortText(_req.body);
    return res.send(response);
});

router.post("/getShortTextConverterClassName", async (_req, res) => {
    const controller = new DosisTilTekstController();
    const response = await controller.getShortTextConverterClassName(_req.body);
    return res.send(response);
});

router.post("/getLongTextConverterClassName", async (_req, res) => {
    const controller = new DosisTilTekstController();
    const response = await controller.getLongTextConverterClassName(_req.body);
    return res.send(response);
});

router.post("/getDosageType", async (_req, res) => {
    const controller = new DosisTilTekstController();
    const response = await controller.getDosageType(_req.body);
    return res.send(response);
});

router.post("/getDosageType144", async (_req, res) => {
    const controller = new DosisTilTekstController();
    const response = await controller.getDosageType144(_req.body);
    return res.send(response);
});

router.post("/calculateDailyDosis", async (_req, res) => {
    const controller = new DosisTilTekstController();
    const response = await controller.calculateDailyDosis(_req.body);
    return res.send(response);
});


export default router;
