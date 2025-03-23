import { Html, Head, Body, Container, Section, Img, Text, Link, Hr } from '@react-email/components';

interface ResetPasswordEmailProps {
  resetLink: string;
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const logo = {
  margin: '0 auto',
};

const heading = {
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '400',
  color: '#484848',
  padding: '17px 0 0',
};

const paragraph = {
  margin: '0 0 15px',
  fontSize: '15px',
  lineHeight: '1.4',
  color: '#3c4149',
};

const buttonContainer = {
  padding: '27px 0 27px',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '6px',
  fontWeight: '600',
  color: '#fff',
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
};

const hr = {
  borderColor: '#dfe1e4',
  margin: '42px 0 26px',
};

const footer = {
  fontSize: '12px',
  lineHeight: '1.4',
  color: '#697386',
  textAlign: 'center' as const,
};

const footerLink = {
  color: '#2563eb',
  textDecoration: 'none',
  margin: '0 4px',
};

export const ResetPasswordEmail = ({ resetLink }: ResetPasswordEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://sparkednext.app/email-logo.png"
          width="160"
          height="30"
          alt="Sparked"
          style={logo}
        />
        <Text style={heading}>Reset Your Password</Text>
        <Text style={paragraph}>
          You recently requested to reset your password for your Sparked account. Click the button below to reset it.
        </Text>
        <Section style={buttonContainer}>
          <Link style={button} href={resetLink}>
            Reset Password
          </Link>
        </Section>
        <Text style={paragraph}>
          If you didn&apos;t request this, please ignore this email. This link will expire in 1 hour.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          Sparked - Your Learning Companion •{' '}
          <Link style={footerLink} href="https://sparkednext.app">
            Website
          </Link>
          {' • '}
          <Link style={footerLink} href="https://github.com/SparkEdUAB/sparked-next">
            GitHub
          </Link>
        </Text>
      </Container>
    </Body>
  </Html>
);

export {
  main,
  container,
  logo,
  heading,
  paragraph,
  buttonContainer,
  button,
  hr,
  footer,
  footerLink
};