import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface PasswordResetEmailProps {
  confirmationURL: string
  token: string
  tokenHash: string
  siteURL: string
  email: string
  data: any
  redirectTo: string
}

export const PasswordResetEmail = ({
  confirmationURL,
  token,
  tokenHash,
  siteURL,
  email,
  data,
  redirectTo,
}: PasswordResetEmailProps) => {
  // Construct the reset link using the confirmation URL and redirect
  const resetLink = `${siteURL}/reset-password?access_token=${tokenHash}&refresh_token=${token}&redirect_to=${encodeURIComponent(redirectTo)}`;
  
  return (
    <Html>
      <Head />
      <Preview>Reset Your GenXShred.com Password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={text}>
            Hi there,
          </Text>
          <Text style={text}>
            We received a request to reset the password for your GenXShred.com account.
          </Text>
          <Text style={text}>
            To create a new password, click the button below. This link will expire in 24 hours.
          </Text>
          <br />
          <Link
            href={resetLink}
            target="_blank"
            style={button}
          >
            Reset Your Password
          </Link>
          <br />
          <br />
          <Text style={text}>
            If you did not request a password reset, please ignore this email or contact our support team if you have any concerns.
          </Text>
          <Text style={text}>
            Thanks,<br />
            The GenXShred.com Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default PasswordResetEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
}

const button = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '12px 25px',
  textAlign: 'center' as const,
  textDecoration: 'none',
  display: 'inline-block',
  borderRadius: '5px',
  fontWeight: 'bold',
}

const footer = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '24px 0 8px',
}

const footerLink = {
  color: '#666',
  fontSize: '12px',
  lineHeight: '20px',
  wordBreak: 'break-all' as const,
  margin: '0 0 24px',
}