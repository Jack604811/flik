import { APP_NAME } from "@/app-settings";

interface EmailTemplateProps {
    removedBy: string;
    workspaceName: string;
}

export const WorkspaceRemovalNotificationTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    removedBy,
    workspaceName,
}) => (
    <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
        <h1>Workspace Removal Notification</h1>
        <p>You have been removed from the workspace <strong>{workspaceName}</strong> on {APP_NAME} by <strong>{removedBy}</strong>.</p>
        <p>If you believe this is a mistake or you need further information, please contact the workspace administrator.</p>
        <p>Thank you for using {APP_NAME}.</p>
    </div>
);
