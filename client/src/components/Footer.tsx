import React from 'react';
import { Link } from 'wouter';
import { LineChart } from 'lucide-react';

const Footer = () => {
  const linkClass = "text-sm text-[#757575] hover:text-primary";
  
  return (
    <footer className="bg-white mt-12">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center">
              <LineChart className="h-6 w-6 text-primary mr-2" />
              <span className="font-bold text-xl text-primary">LoanPredictor</span>
            </div>
            <p className="mt-2 text-sm text-[#757575]">
              Powered by advanced machine learning algorithms to provide accurate loan approval predictions.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#212121] tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/" className={linkClass}>Documentation</Link>
              </li>
              <li>
                <Link href="/" className={linkClass}>API Reference</Link>
              </li>
              <li>
                <Link href="/" className={linkClass}>Guides</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#212121] tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/" className={linkClass}>Privacy Policy</Link>
              </li>
              <li>
                <Link href="/" className={linkClass}>Terms of Service</Link>
              </li>
              <li>
                <Link href="/" className={linkClass}>Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-[#e0e0e0] pt-8">
          <p className="text-sm text-[#757575]">&copy; {new Date().getFullYear()} LoanPredictor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
