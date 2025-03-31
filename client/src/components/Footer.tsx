import { LineChart } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white mt-12">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            <LineChart className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold text-xl text-primary">LoanPredictor</span>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-sm text-[#757575]">&copy; {new Date().getFullYear()} LoanPredictor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;