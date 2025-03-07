import { APP_NAME } from "@/app-settings";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  workspaceName: string;
  ownerName: string;
}

export const WorkspaceWelcomeEmail = ({
  workspaceName,
  ownerName,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to your new workspace on {APP_NAME}!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to {workspaceName}!</Heading>
        <Text style={text}>Hi {ownerName},</Text>
        <Text style={text}>
          Your workspace has been successfully created. Here are some next steps to get started:
        </Text>
        
        <div style={actionList}>
          <div style={actionItem}>
            <Text style={actionTitle}>1. Customize Your Workspace</Text>
            <Text style={actionDescription}>
              Add your logo, update workspace settings, and make it your own.
            </Text>
          </div>

          <div style={actionItem}>
            <Text style={actionTitle}>2. Invite Your Team</Text>
            <Text style={actionDescription}>
              Collaborate with your team members by inviting them to join your workspace.
            </Text>
          </div>

          <div style={actionItem}>
            <Text style={actionTitle}>3. Create Your First Spot</Text>
            <Text style={actionDescription}>
              Set up your first bookable spot and start accepting reservations.
            </Text>
          </div>
        </div>

        <Link style={button} href={`${process.env.NEXTAUTH_URL}/dashboard`}>
          Go to Dashboard
        </Link>

        <Text style={footer}>
          Need help? Reply to this email and we&apos;ll be happy to assist you.
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "16px",
  margin: "24px 0",
};

const actionList = {
  margin: "32px 0",
};

const actionItem = {
  margin: "28px 0",
};

const actionTitle = {
  color: "#333",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 8px",
};

const actionDescription = {
  color: "#666",
  fontSize: "14px",
  margin: "0",
  lineHeight: "21px",
};

const button = {
  backgroundColor: "#000",
  borderRadius: "5px",
  color: "#fff",
  display: "block",
  fontSize: "16px",
  fontWeight: "bold",
  textAlign: "center" as const,
  textDecoration: "none",
  width: "100%",
  padding: "12px",
  margin: "32px 0",
};

const footer = {
  color: "#666",
  fontSize: "12px",
  margin: "24px 0",
  textAlign: "center" as const,
};