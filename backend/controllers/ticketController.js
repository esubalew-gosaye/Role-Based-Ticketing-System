import db from '../utils/db.js';
import ticketValidator from '../validators/ticketValidator.js';

// Create a ticket
const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;
    const { error, value } = ticketValidator.createTicketSchema.validate({
      title,
      description,
    });

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const ticket = await db.ticket.create({
      data: {
        title,
        description,
        userId,
      },
    });

    res.status(201).json({
      success: true,
      message: 'ticket successfully created',
      data: ticket,
    });
  } catch (error) {
    res.status(400).json({success: false, message: error.message});
  }
};

// Get tickets based on user role
const getTickets = async (req, res) => {
  try {
    const userRole = req.user;
    let tickets;
    if (!userRole) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (userRole.role === 'ADMIN') {
      tickets = await db.ticket.findMany({ where: {active: false }, include: {
        user: {select: {email: true, role: true}},
      } });
    } else {
      tickets = await db.ticket.findMany({ where: { userId: req.user.id, active: false }, include: {
        user: {select: {email: true, role: true}},
      } });
    }

    res.status(200).json({
      success: true,
      message: 'successfully fetch tickets',
      data: tickets,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update ticket status
const updateTicketStatus = async (req, res) => {
  try {
    const userRole = req.user;
    if (!userRole) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (userRole.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const existingTicket = await db.ticket.findUnique({ where: { id } });
    if (!existingTicket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    const ticket = await db.ticket.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({
      success: true,
      message: 'Ticket status updated successfully',
      data: ticket,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete ticket

const deleteTicket = async (req, res) => {
  try {
    const userRole = req.user;
    if (!userRole) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (userRole.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;

    const existingTicket = await db.ticket.findUnique({ where: { id } });
    if (!existingTicket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    } 
    await db.ticket.update({
      where: { id },
      data: { active: true},
    });

    res.status(200).json({
      success: true,
      message: 'Ticket archived successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  createTicket,
  getTickets,
  updateTicketStatus,
  deleteTicket
};
