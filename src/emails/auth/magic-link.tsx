interface EmailTemplateProps {
    link: string;
}

export const MagicLinkTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    link,
}) => (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
        <h1>Login</h1>
        <p>You have requested to login. Click the button below to proceed:</p>
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
            Login to Your Account
        </a>
        <p>If the button doesn&apos;t work, you can copy and paste the link below into your browser:</p>
        <p><a href={link}>{link}</a></p>
    </div>
);
