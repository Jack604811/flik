import { Button } from "@/components/ui/button";
import { updateOnboardingState } from "@/server/actions/auth.action";
import React from "react";
import CompleteOnboardingButton from "./CompleteOnboardingButton";

const BasicPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="max-w-md w-full text-center bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome to Basic Page
        </h1>
        <p className="text-gray-600">
          This is a simple page in your Next.js application. Customize it as
          needed to suit your requirements.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition"
          >
            Go Back to Home
          </a>
          <CompleteOnboardingButton />
        </div>
      </div>
    </div>
  );
};

export default BasicPage;
