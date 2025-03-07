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

interface TrialStartedEmailProps {
  workspaceName: string;
  ownerName: string;
  trialEndDate: string;
}

export const WorkspaceTrialStartedEmail = ({
  workspaceName,
  ownerName,
  trialEndDate,
}: TrialStartedEmailProps) => (
  <Html>
    <Head />
    <Preview>Your {APP_NAME} trial has started!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Your Trial Has Started</Heading>
        <Text style={text}>Hi {ownerName},</Text>
        <Text style={text}>
          Your 14-day trial for {workspaceName} is now active. You have full access to all premium features until {trialEndDate}.
        </Text>

        <div style={featureList}>
          <Text style={featureHeader}>During your trial, you can:</Text>
          <ul style={featureUl}>
            <li style={featureItem}>Accept unlimited bookings</li>
            <li style={featureItem}>Access advanced analytics</li>
            <li style={featureItem}>Set up multiple payment methods</li>
            <li style={featureItem}>Create custom booking rules</li>
            <li style={featureItem}>And much more!</li>
          </ul>
        </div>

        <div style={callout}>
          <Text style={calloutText}>
            Your trial will end on {trialEndDate}. To ensure uninterrupted service, upgrade to a paid plan before your trial expires.
          </Text>
        </div>

        <Link style={button} href={`${process.env.NEXTAUTH_URL}/settings/billing`}>
          Upgrade Now
        </Link>

        <Text style={footer}>
          Questions about your trial? Contact our support team for assistance.
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

const featureList = {
  margin: "32px 0",
};

const featureHeader = {
  color: "#333",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0 0 16px",
};

const featureUl = {
  margin: "0",
  padding: "0 0 0 20px",
};

const featureItem = {
  color: "#666",
  fontSize: "16px",
  margin: "8px 0",
};

const callout = {
  backgroundColor: "#f8f9fa",
  border: "1px solid #e9ecef",
  borderRadius: "5px",
  padding: "16px",
  margin: "32px 0",
};

const calloutText = {
  color: "#333",
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