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

interface TrialEndedEmailProps {
  workspaceName: string;
  ownerName: string;
}

export const WorkspaceTrialEndedEmail = ({
  workspaceName,
  ownerName,
}: TrialEndedEmailProps) => (
  <Html>
    <Head />
    <Preview>Your {APP_NAME} trial has ended</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Trial Period Ended</Heading>
        <Text style={text}>Hi {ownerName},</Text>
        <Text style={text}>
          Your trial period for {workspaceName} has ended. Your workspace is now in limited mode.
        </Text>

        <div style={warningBox}>
          <Text style={warningTitle}>Limited Access Mode</Text>
          <Text style={warningText}>
            Your workspace will remain accessible for viewing, but premium features are now disabled.
          </Text>
        </div>

        <div style={actionBox}>
          <Text style={actionTitle}>Upgrade now to restore full access:</Text>
          <ul style={actionList}>
            <li style={actionItem}>Resume accepting bookings</li>
            <li style={actionItem}>Restore access to all premium features</li>
            <li style={actionItem}>Keep all your workspace data</li>
          </ul>
        </div>

        <Link style={button} href={`${process.env.NEXTAUTH_URL}/settings/billing`}>
          Upgrade Your Workspace
        </Link>

        <Text style={footer}>
          Questions? Contact our support team for assistance with upgrading.
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
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

const warningBox = {
  backgroundColor: "#fff1f0",
  border: "1px solid #ffccc7",
  borderRadius: "6px",
  padding: "20px",
  margin: "32px 0",
};

const warningTitle = {
  color: "#cf1322",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 12px",
};

const warningText = {
  color: "#333",
  fontSize: "14px",
  margin: "0",
};

const actionBox = {
  margin: "32px 0",
  padding: "20px",
  backgroundColor: "#f6f9fc",
  borderRadius: "6px",
};

const actionTitle = {
  color: "#333",
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 16px",
};

const actionList = {
  margin: "0",
  padding: "0 0 0 20px",
};

const actionItem = {
  color: "#666",
  fontSize: "14px",
  margin: "8px 0",
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