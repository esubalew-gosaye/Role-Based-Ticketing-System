import { Component } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select'; // Assuming you have this Select component
import { Link, Navigate } from 'react-router-dom';
import axios from '@/lib/axiosInterceptor';

class Signup extends Component {


  render() {
    
    return (
      <div className="min-h-screen flex items-start justify-center bg-gray-100">
        <div className="bg-white px-8 py-6 rounded-lg shadow-md w-96 mt-20">
          <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={this.handleSubmit}>
            <div className="mb-4">
              <Input
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={this.handleChange}
                className="w-full"
                required
              />
            </div>
            <div className="mb-6">
              <Input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={this.handleChange}
                className="w-full"
                required
              />
            </div>

            <div className="mb-6">
              <Select
                name="role"
                value={role}
                onChange={this.handleChange}
                className="w-full"
                required
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="admin">ADMIN</option>
                <option value="user">USER</option>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white mb-4"
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Signup'}
            </Button>
          </form>

          <div className="text-center mt-4 text-sm text-gray-600">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Signup;
