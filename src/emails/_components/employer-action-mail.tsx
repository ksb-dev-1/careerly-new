import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Preview,
} from "@react-email/components";
import { ApplicationStatus } from "@/generated/prisma/client";

interface EmployerActionMailProps {
  userName: string;
  companyName: string;
  role: string;
  action: ApplicationStatus;
}

export default function EmployerActionMail({
  userName,
  companyName,
  role,
  action,
}: EmployerActionMailProps) {
  const isApproved = action === "APPROVED";
  const isOffered = action === "OFFERED";
  const isRejected = action === "REJECTED";

  const actionText = isApproved
    ? "shortlisted"
    : isOffered
      ? "offered"
      : "rejected";

  const previewText = isOffered
    ? `You've received an offer from ${companyName}`
    : `Your application has been ${actionText}`;

  return (
    <Html lang="en">
      <Head />
      <Preview>{previewText}</Preview>

      <Body style={main}>
        <Container style={container}>
          <Section style={card}>
            <Text style={brand}>Careerly</Text>

            <Heading style={heading}>
              Application{" "}
              {actionText.charAt(0).toUpperCase() + actionText.slice(1)}
            </Heading>

            <Text style={text}>
              Hi <span style={highlight}>{userName}</span>,
            </Text>

            <Text style={text}>
              Your application for the position of <strong>{role}</strong> at{" "}
              <strong>{companyName}</strong> has been{" "}
              <strong>{actionText}</strong>.
            </Text>

            {isApproved && (
              <Text style={text}>
                ✅ Great news! The employer has shortlisted your profile and may
                contact you soon with next steps.
              </Text>
            )}

            {isOffered && (
              <Text style={text}>
                🎉 Congratulations! You’ve received an offer from{" "}
                <strong>{companyName}</strong>. Please check your dashboard for
                further details.
              </Text>
            )}

            {isRejected && (
              <Text style={text}>
                ❌ Unfortunately, the employer has decided to move forward with
                other candidates. Don’t lose hope—new opportunities are added to
                Careerly every day.
              </Text>
            )}

            <Text style={muted}>
              ⏳ You’ll receive future updates regarding this application via
              email.
            </Text>

            <Hr style={hr} />

            <Text style={footerText}>
              You can track your application status anytime from your Careerly
              dashboard.
            </Text>

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
