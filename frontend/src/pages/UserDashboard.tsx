import { Component } from "react";
import { Card } from "@/components/ui/card";
import TicketList from "./TicketList";
import TicketForm from "./TicketForm";
import { Button } from "@/components/ui/button";

class UserDashboard extends Component {
  handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  render() {
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

        <div className="">
          <Card className="p-6 mb-6 w-[50%]">
            <TicketForm />
          </Card>
          <Card className="p-6">
            <TicketList />
          </Card>
        </div>
      </div>
    );
  }
}

export default UserDashboard;
