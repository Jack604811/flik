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

interface TrialEndingEmailProps {
  workspaceName: string;
  ownerName: string;
  daysLeft: number;
  trialEndDate: string;
}

export const WorkspaceTrialEndingEmail = ({
  workspaceName,
  ownerName,
  daysLeft,
  trialEndDate,
}: TrialEndingEmailProps) => (
  <Html>
    <Head />
    <Preview>Your {APP_NAME} trial is ending soon!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Trial Ending Soon</Heading>
        <Text style={text}>Hi {ownerName},</Text>
        <Text style={text}>
          Your trial for {workspaceName} will end in {daysLeft} days on {trialEndDate}.
        </Text>

        <div style={callout}>
          <Text style={calloutTitle}>Don&apos;t lose access to your workspace!</Text>
          <Text style={calloutText}>
            Upgrade now to keep all your data and continue using premium features:
          </Text>
          <ul style={featureList}>
            <li style={featureItem}>Unlimited bookings</li>
            <li style={featureItem}>Advanced analytics</li>
            <li style={featureItem}>Priority support</li>
          </ul>
        </div>

        <Link style={button} href={`${process.env.NEXTAUTH_URL}/settings/billing`}>
          Upgrade Now
        </Link>

        <Text style={footer}>
          Need help choosing a plan? Our support team is here to help!
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

const callout = {
  margin: "32px 0",
  padding: "24px",
  backgroundColor: "#fff8e6",
  borderRadius: "6px",
  border: "1px solid #ffeeba",
};

const calloutTitle = {
  color: "#333",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0 0 12px",
};

const calloutText = {
  color: "#666",
  fontSize: "14px",
  margin: "0 0 16px",
};

const featureList = {
  margin: "0",
  padding: "0 0 0 20px",
};

const featureItem = {
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