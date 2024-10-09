import React from 'react'
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, CheckCheck } from "lucide-react";

type Params = {
    success: string | undefined | null;
    error: string | undefined | null;
}
function FormMessageAlert({success, error}: Params) {
  return (
    <>
        { (error || success) && (
            <Alert variant={error ? "destructive" : "default"} className={success ? 'text-green-600 border-green-600': ''}>
                {error ? (<AlertCircle className="h-4 w-4" />) : (<CheckCheck className="h-4 w-4" color='#16a34a' />)}
                <AlertTitle>{error ?? success}</AlertTitle>
            </Alert>
        )}
    </>
  )
}

export default FormMessageAlert