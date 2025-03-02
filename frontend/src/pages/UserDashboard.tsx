import { Component } from 'react';
import { Card } from '@/components/ui/card';
import TicketList from './TicketList';
import TicketForm from './TicketForm';

class UserDashboard extends Component {
  render() {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>
        <Card className="p-6 mb-6">
          <TicketForm />
        </Card>
        <Card className="p-6">
          <TicketList />
        </Card>
      </div>
    );
  }
}

export default UserDashboard;