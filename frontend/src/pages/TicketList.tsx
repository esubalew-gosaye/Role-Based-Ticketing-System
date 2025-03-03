import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import {  } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; 
import TicketService from '@/services/ticketService';

interface Ticket {
  id: string;
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

enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
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

  // Handle status update
  const handleStatusUpdate = async (ticketId: string, newStatus: TicketStatus) => {
    try {
      await TicketService.updateTicket(ticketId, {"status": newStatus});
      toast.success('Ticket status updated successfully');
      // Refresh the ticket list after updating the status
      const data = await TicketService.getTickets();
      setTickets(data.data);
    } catch (err) {
      console.error('Failed to update ticket status:', err);
    }
  };

  if (loading) {
    return <div>Loading tickets...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <>
      <div>Total Count: {tickets ? tickets.length : 0}</div>
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
                      className={`px-3 py-2 rounded-full text-sm ${
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline" className='bg-green-700 cursor-pointer hover:bg-green-600'>
                            Update Status
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(ticket.id, TicketStatus.OPEN)
                            }
                          >
                            Open
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(
                                ticket.id,
                                TicketStatus.IN_PROGRESS,
                              )
                            }
                          >
                            In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(ticket.id, TicketStatus.CLOSED)
                            }
                          >
                            Closed
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <Toaster  position='top-center'/>
      </div>
    </>
  );
};

export default TicketList;