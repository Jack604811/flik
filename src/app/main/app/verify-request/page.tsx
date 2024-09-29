//user will be redirected to this page after signining up/in with email to let them know an email has been sent to their inbox
import { AtSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
export default async function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <Card className="py-12 ">
        <CardContent>
          <div className="space-y-2 text-center">
            <div className="bg-accent-bg-color/5 p-2 rounded-full w-auto inline-block">
              <AtSign className="mx-auto " size={30} />
            </div>
            <h1 className="font-bold text-xl">You&apos;re almost there</h1>
          </div>

          <p className="text-center">
            A sign in link has been sent to your email address.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
