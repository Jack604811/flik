import { APP_NAME } from "@/app_settings";

interface EmailTemplateProps {
    // add any prop you want to use on the email template
}

export const ProductPurchaseTemplate: React.FC<Readonly<EmailTemplateProps>> = ({

}) => (
    <div>
        <h1>
            Thank you for buying on  {APP_NAME}
        </h1>
        <p>
            You should now have access to the product.
        </p>
    </div>
);
