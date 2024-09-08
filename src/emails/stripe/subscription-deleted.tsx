import { APP_NAME } from "@/app-settings";

interface EmailTemplateProps {
    // add any prop you want to use on the email template
}

export const SubscriptionDeletedTemplate: React.FC<Readonly<EmailTemplateProps>> = ({

}) => (
    <div>
        <h1>
            Your subscription to {APP_NAME} was canceled
        </h1>
        <p>
            We are sorry to see you go. If you have any feedback, please let us know.
        </p>
    </div>
);
