import { Component } from 'react';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
interface Ticket {
  id: number;
  title: string;
  status: string;
}

interface TicketListProps {
  isAdmin?: boolean;
}

class TicketList extends Component<TicketListProps> {
  render() {
    const tickets: Ticket[] = [
      { id: 1, title: 'Ticket 1', status: 'Open' },
      { id: 2, title: 'Ticket 2', status: 'Closed' },
    ];

    return (
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            {this.props.isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.title}</td>
              <td>{ticket.status}</td>
              {this.props.isAdmin && (
                <td>
                  <Button size="sm" variant="outline">
                    Update Status
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

export default TicketList;