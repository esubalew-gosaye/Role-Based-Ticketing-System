import { Component } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TicketList from './TicketList';
import TicketForm from './TicketForm';

class UserDashboard extends Component {
  state = {
    isModalOpen: false,
  };

  handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  openModal = () => {
    this.setState({ isModalOpen: true });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  render() {
    const { isModalOpen } = this.state;

    return (
      <div className="flex flex-col min-h-screen p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Dashboard</h1>
          <Button
            onClick={this.handleLogout}
            variant="destructive"
            className="cursor-pointer"
          >
            Logout
          </Button>
        </div>

        <div className="flex flex-col gap-6">
        <Button onClick={this.openModal} className="w-fit">
            Create Ticket
          </Button>

          <Card className="p-6">
            <TicketList />
          </Card>
        </div>

        <Dialog open={isModalOpen} onOpenChange={this.closeModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Ticket</DialogTitle>
            </DialogHeader>
            <TicketForm onSuccess={this.closeModal} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default UserDashboard;
