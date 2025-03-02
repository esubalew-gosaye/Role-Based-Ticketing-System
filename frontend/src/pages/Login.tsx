import{ Component } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

class Login extends Component {
  render() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form>
            <div className="mb-4">
              <Input type="email" placeholder="Email" className="w-full" />
            </div>
            <div className="mb-6">
              <Input type="password" placeholder="Password" className="w-full" />
            </div>
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              Login
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;