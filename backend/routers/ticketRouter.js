import express from 'express';
import ticketController from '../controllers/ticketController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, ticketController.createTicket);
router.get('/', authMiddleware, ticketController.getTickets);
router.put('/:id', authMiddleware, ticketController.updateTicketStatus);
router.delete('/:id', authMiddleware, ticketController.deleteTicket);


export default router;
