interface EmailTemplateProps {
    link: string;
}

export const MagicLinkTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    link,
}) => (
    <div>
        <h1>Workspace Invitation</h1>
        <p>You have been invited to join a workspace. Click the link below to accept:</p>
        <a href={link}>{link}</a>
    </div>
);
