interface EmailTemplateProps {
    link: string;
}

export const MagicLinkTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    link,
}) => (
    <div>
        <p>
            Here is your access link:
        </p>
        <p>
            {link}
        </p>
    </div>
);
