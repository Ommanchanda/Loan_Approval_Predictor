import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { LineChart } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <LineChart className="h-6 w-6 text-primary mr-2" />
              <span className="font-bold text-xl text-primary">LoanPredictor</span>
            </div>
          </div>
          <div className="flex items-center">
            <Link href="/">
              <a className="text-[#757575] hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Home</a>
            </Link>
            <Link href="/">
              <a className="text-[#757575] hover:text-primary px-3 py-2 rounded-md text-sm font-medium">About</a>
            </Link>
            <Link href="/">
              <a className="text-[#757575] hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Contact</a>
            </Link>
            <Button variant="default" className="ml-4">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
