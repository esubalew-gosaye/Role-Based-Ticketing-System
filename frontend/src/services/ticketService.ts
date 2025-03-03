import axios from '@/lib/axiosInterceptor';


class TicketService {
  async createTicket(ticketData: any) {
    try {
      const response = await axios.post('/tickets', ticketData);
      return response.data;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  }

  async getTickets() {
    try {
      const response = await axios.get('/tickets');
      console.log(response)
      return response.data;
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  }

  async getTicketById(ticketId: string) {
    try {
      const response = await axios.get(`/tickets/${ticketId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ticket:', error);
      throw error;
    }
  }

  async updateTicket(ticketId: string, ticketData: any) {
    try {
      const response = await axios.put(`/tickets/${ticketId}`, ticketData);
      return response.data;
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  }

  async deleteTicket(ticketId: string) {
    try {
      const response = await axios.delete(`/tickets/${ticketId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting ticket:', error);
      throw error;
    }
  }
}

export default new TicketService();