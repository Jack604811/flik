import { APP_NAME } from "@/app_settings";

interface EmailTemplateProps {
    // add any prop you want to use on the email template
}

export const NewSubscriptionTemplate: React.FC<Readonly<EmailTemplateProps>> = ({

}) => (
    <div>
        <h1>
            Thank you for suscribing to {APP_NAME}!
        </h1>
        <p>
            You are now part of the {APP_NAME} family. We are excited to have you on board!
        </p>
    </div>
);
