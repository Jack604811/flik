import { APP_NAME } from "@/app-settings";

interface EmailTemplateProps {
    invitedBy: string;
    workspaceName: string;
    link: string;
}

export const WorkspaceInviteMagicLinkTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    link,
    invitedBy,
    workspaceName
}) => (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
        <h1>Workspace Invitation</h1>
        <p>You have been invited to {workspaceName} on {APP_NAME}. To accept the invite, please click the button or follow the instruction below:</p>
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
            Accept Invitation
        </a>
        <p>If the button doesn&apos;t work, you can copy and paste the link below into your browser:</p>
        <p><a href={link}>{link}</a></p>
    </div>
);
