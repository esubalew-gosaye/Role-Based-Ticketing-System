import { Component } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast, Toaster } from 'sonner'; 
import TicketService from '@/services/ticketService'; 

class TicketForm extends Component {
  state = {
    title: '',
    description: '',
  };

  // Handle form input changes
  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  // Handle form submission
  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { title, description } = this.state;

    if (!title || !description) {

      toast.error('Please fill in all fields', {
        className: 'bg-red-500 text-white'
      });
      return;
    }

    try {
      // Call the TicketService to create a ticket
      await TicketService.createTicket({ title, description });
      toast.success('Ticket created successfully!');
      this.setState({ title: '', description: '' }); // Clear the form
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Failed to create ticket.', {
        className: 'bg-red-500 text-white'
      });
    }
  };

  render() {
    const { title, description } = this.state;

    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Create New Ticket</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="mb-4">
            <Input
              type="text"
              name="title"
              placeholder="Title"
              value={title}
              onChange={this.handleInputChange}
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              name="description"
              placeholder="Description"
              value={description}
              onChange={this.handleInputChange}
              className="w-full"
            />
          </div>
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
            Submit
          </Button>
        </form>
        <Toaster position="top-center" /> {/* Render the Toaster */}
      </div>
    );
  }
}

export default TicketForm;