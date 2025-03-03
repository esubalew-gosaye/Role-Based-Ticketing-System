import { Component } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // Import the Button component
import TicketList from './TicketList';

class AdminDashboard extends Component {
  handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  render() {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button onClick={this.handleLogout} variant="destructive" className='cursor-pointer'>
            Logout
          </Button>
        </div>
        <Card className="p-6">
          <TicketList isAdmin={true} />
        </Card>
      </div>
    );
  }
}

export default AdminDashboard;