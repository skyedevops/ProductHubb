import { Request, Response } from 'express';
import { pdfService } from '../services/pdf.service';

export const downloadQuotePdf = async (req: Request, res: Response) => {
  try {
    const pdfBuffer = await pdfService.generateQuotePdf(req.params.id as string);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=quote-${req.params.id}.pdf`);
    res.send(pdfBuffer);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
