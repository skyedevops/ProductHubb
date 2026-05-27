import { Request, Response } from 'express';
import { quoteService } from '../services/quote.service';
import { QuoteSchema } from '@producthubb/shared';
import { AuthRequest } from '../middleware/auth.middleware';

export const createQuote = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = QuoteSchema.parse(req.body);
    const quote = await quoteService.createQuote(req.user!.id, validatedData);
    res.status(201).json(quote);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getQuote = async (req: AuthRequest, res: Response) => {
  try {
    const quote = await quoteService.getQuoteById(req.params.id as string);
    if (!quote) return res.status(404).json({ error: 'Quote not found' });
    res.json(quote);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const versionQuote = async (req: AuthRequest, res: Response) => {
  try {
    const newVersion = await quoteService.createNewVersion(req.params.id as string);
    res.status(201).json(newVersion);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const listMyQuotes = async (req: AuthRequest, res: Response) => {
  try {
    const quotes = await quoteService.getQuotesByUser(req.user!.id);
    res.json(quotes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
