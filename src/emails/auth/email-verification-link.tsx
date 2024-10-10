import { APP_NAME } from "@/app-settings";
import { Card, CardContent } from "@/components/ui/card";

interface EmailTemplateProps {
  link: string;
}

export const EmailVerificationLinkTemplate: React.FC<
  Readonly<EmailTemplateProps>
> = ({ link }) => (
  <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <Card className="py-12 ">
        <CardContent>
          <div className="space-y-2 text-center">
            <div className="bg-accent-bg-color/5 p-2 rounded-full w-auto inline-block">
            <h1>
            <strong className="font-bold tracking-tight text-xl md:text-2xl">
              {APP_NAME}
            </strong>
          </h1>
            </div>
            <h1 className="font-bold text-xl">Verify your email</h1>
          </div>

          <p className="text-center">
          Thanks for helping us keep your account secure! Click the button
          </p>
          <div className="text-center">
          <a
            href={link}
            style={{
              display: "inline-block",
              padding: "12px 20px",
              fontSize: "16px",
              color: "#fff",
              backgroundColor: "#000000",
              textDecoration: "none",
              borderRadius: "4px",
              textAlign: "center",
            }}
          >
            Confirm Email
          </a>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);
