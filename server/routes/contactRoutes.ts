import { Router, Request, Response } from 'express';
import { sendContactEmail } from '../utils/contactService';

const router = Router();

// POST /api/contact - Send contact form email to admin
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Send email to admin
    await sendContactEmail({ name, email, phone, subject, message });

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error: any) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ message: error.message || 'Error processing contact form' });
  }
});

export default router;
