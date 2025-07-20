import { Calendar } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">EventBook</span>
          </div>
          <div className="text-gray-400">
            © 2024 EventBook. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
