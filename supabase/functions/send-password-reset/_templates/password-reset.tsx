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
  resetLink: string
  userEmail: string
}

export const PasswordResetEmail = ({
  resetLink,
  userEmail,
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Reset Your Password</Heading>
        <Text style={text}>
          Hello,
        </Text>
        <Text style={text}>
          We received a request to reset the password for your account ({userEmail}). 
          If you made this request, click the button below to reset your password:
        </Text>
        <Link
          href={resetLink}
          target="_blank"
          style={{
            ...button,
            display: 'block',
            marginBottom: '16px',
          }}
        >
          Reset Password
        </Link>
        <Text style={text}>
          This link will expire in 24 hours for security reasons.
        </Text>
        <Text style={text}>
          If you didn't request a password reset, you can safely ignore this email. 
          Your password will not be changed.
        </Text>
        <Text style={footer}>
          If you're having trouble clicking the button, copy and paste the following link into your browser:
        </Text>
        <Text style={footerLink}>
          {resetLink}
        </Text>
      </Container>
    </Body>
  </Html>
)

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
  backgroundColor: '#000',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '12px 24px',
  margin: '24px 0',
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