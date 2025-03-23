import { Html, Head, Body, Container, Section, Img, Text, Link, Hr } from '@react-email/components';

import {
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
} from './ResetPasswordEmail';

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://sparkednext.app/email-logo.png"
          width="48"
          height="48"
          alt="Sparked"
          style={logo}
        />
        <Text style={heading}>Welcome to Sparked, {name}!</Text>
        <Text style={paragraph}>
          We&apos;re excited to have you on board. Sparked is your personal learning companion that helps you discover, organize, and track your learning journey.
        </Text>
        <Section style={buttonContainer}>
          <Link style={button} href={process.env.BASE_URL}>
            Start Learning
          </Link>
        </Section>
        <Text style={paragraph}>
          If you have any questions or for some reasons you require admin access, feel free to reply to this email. We&apos;re always here to help!
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
