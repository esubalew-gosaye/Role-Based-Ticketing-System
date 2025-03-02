import { Component } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

class TicketForm extends Component {
  render() {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Create New Ticket</h2>
        <form>
          <div className="mb-4">
            <Input type="text" placeholder="Title" className="w-full" />
          </div>
          <div className="mb-4">
            <Input type="text" placeholder="Description" className="w-full" />
          </div>
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
            Submit
          </Button>
        </form>
      </div>
    );
  }
}

export default TicketForm;