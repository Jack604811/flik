import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CustomCardProps {
  title: string;
  description: string;
  price: string;
  features: string[];
  buttonText: string;
}

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
};

const CustomCard: React.FC<CustomCardProps> = ({ title, description, price, features, buttonText }) => {
  return (
    <Card className="w-full p-6 bg-white rounded-lg shadow-lg flex justify-between transform transition-transform duration-300 hover:scale-105">
      <div className="flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="mt-2 text-gray-600">{description}</p>
        </div>
        <p className="text-4xl font-bold mt-6">{price}</p>
        <Button variant="default" className="w-48 h-16 mt-4">
          {buttonText}
        </Button>
      </div>
      <div className="flex flex-col justify-between">
        <p className="text-gray-600">Everything in free plan, plus</p>
        <ul className="list-none space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckIcon className="text-green-500 mr-2" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default CustomCard;
