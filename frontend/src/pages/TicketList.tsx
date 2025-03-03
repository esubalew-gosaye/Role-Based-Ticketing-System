import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import TicketService from '@/services/ticketService';

interface Ticket {
  id: number;
  title: string;
  status: string;
  description: string;
  user: {
    email: string;
    role: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface TicketListProps {
  isAdmin?: boolean;
}

const TicketList = ({ isAdmin }: TicketListProps) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tickets from the API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await TicketService.getTickets();
        setTickets(data.data);
      } catch (err) {
        setError('Failed to fetch tickets');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return <div>Loading tickets...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <>
      <div>Total Count: {tickets? tickets.length : 0}</div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Owner</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>CreatedAt</TableHead>
              <TableHead>UpdatedAt</TableHead>
              {isAdmin && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets &&
              tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.user.email}</TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell className="whitespace-pre-line break-words max-w-xs">
                    {ticket.description}
                  </TableCell>

                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        ticket.status === 'OPEN'
                          ? 'bg-green-100 text-green-800'
                          : ticket.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(ticket.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(ticket.updatedAt).toLocaleString()}
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <Button size="sm" variant="outline">
                        Update Status
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default TicketList;
