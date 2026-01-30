import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
  Preview,
} from "@react-email/components";

type VerifyEmailProps = {
  url: string;
  firstName?: string;
};

export default function VerifyEmail({
  url,
  firstName = "there",
}: VerifyEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Verify your Careerly account</Preview>

      <Body style={main}>
        <Container style={container}>
          <Section style={card}>
            {/* Brand Header */}
            <Text style={brand}>Careerly</Text>

            <Heading style={heading}>Verify your email</Heading>

            <Text style={text}>
              Hi <span style={highlight}>{firstName}</span>,
            </Text>

            <Text style={text}>
              Welcome to <strong>Careerly</strong> 👋 Please confirm your email
              address to activate your account and start exploring
              opportunities.
            </Text>

            <Section style={buttonContainer}>
              <Button href={url} style={button}>
                Verify Email Address
              </Button>
            </Section>

            <Text style={muted}>
              ⏳ This verification link will expire in <strong>24 hours</strong>
              .
            </Text>

            <Text style={muted}>
              If you didn’t create a Careerly account, you can safely ignore
              this email.
            </Text>

            <Hr style={hr} />

            <Text style={footerText}>
              Having trouble with the button? Copy and paste this link into your
              browser:
            </Text>

            <Text style={link}>{url}</Text>

            <Text style={copyright}>
              © {new Date().getFullYear()} Careerly. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/* ------------------ Styles ------------------ */

const main = {
  backgroundColor: "#f9fafb",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const container = {
  padding: "48px 0",
};

const card = {
  maxWidth: "480px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  padding: "36px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
};

const brand = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#0a66c2",
  textAlign: "center" as const,
  marginBottom: "12px",
};

const heading = {
  fontSize: "22px",
  fontWeight: "600",
  color: "#111827",
  marginBottom: "16px",
  textAlign: "center" as const,
};

const text = {
  fontSize: "16px",
  color: "#374151",
  lineHeight: "24px",
  marginBottom: "12px",
};

const highlight = {
  fontWeight: "600",
  color: "#0a66c2",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "28px 0",
};

const button = {
  backgroundColor: "#0a66c2",
  color: "#ffffff",
  padding: "14px 28px",
  borderRadius: "25px",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  boxShadow: "0 2px 4px rgba(79,70,229,0.35)",
};

const muted = {
  fontSize: "14px",
  color: "#6b7280",
  marginBottom: "8px",
};

const hr = {
  border: "none",
  borderTop: "1px solid #e5e7eb",
  margin: "28px 0",
};

const footerText = {
  fontSize: "14px",
  color: "#6b7280",
  marginBottom: "6px",
};

const link = {
  fontSize: "14px",
  color: "#0a66c2",
  wordBreak: "break-all" as const,
};

const copyright = {
  marginTop: "20px",
  fontSize: "12px",
  color: "#9ca3af",
  textAlign: "center" as const,
};
