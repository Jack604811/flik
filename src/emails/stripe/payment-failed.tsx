import { APP_NAME } from "@/app_settings";

interface EmailTemplateProps {
    // add any prop you want to use on the email template
}

export const PaymentFailedTemplate: React.FC<Readonly<EmailTemplateProps>> = ({

}) => (
    <div>
        <h1>
            We couldn&apos;t process your payment to {APP_NAME}
        </h1>
        <p>
            Please update your payment method to avoid any service interruption.
        </p>
    </div>
);
