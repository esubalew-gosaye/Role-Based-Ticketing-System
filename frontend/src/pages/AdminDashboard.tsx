import { Component } from 'react';
import { Card } from '@/components/ui/card';
import TicketList from './TicketList';

class AdminDashboard extends Component {
  render() {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <Card className="p-6">
          <TicketList isAdmin={true} />
        </Card>
      </div>
    );
  }
}

export default AdminDashboard;