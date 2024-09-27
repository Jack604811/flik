interface EmailTemplateProps {
    link: string;
}

export const MagicLinkTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    link,
}) => (
    <div>
        <h1>Login</h1>
        <p>You have been request to login, Click the link below:</p>
        <a href={link}>{link}</a>
    </div>
);
