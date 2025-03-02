import { Component } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

class Signup extends Component {
  render() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
          <form>
            <div className="mb-4">
              <Input type="text" placeholder="Name" className="w-full" />
            </div>
            <div className="mb-4">
              <Input type="email" placeholder="Email" className="w-full" />
            </div>
            <div className="mb-6">
              <Input type="password" placeholder="Password" className="w-full" />
            </div>
            <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white">
              Signup
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

export default Signup;