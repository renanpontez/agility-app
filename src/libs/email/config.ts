// Shared email configuration. The sender mailbox doubles as Reply-To so
// readers can reply naturally — it's a real inbox, not a noreply.
export const EMAIL_CONFIG = {
  fromName: 'Agility Creative',
  fromAddress: 'hi@agilitycreative.com',
  replyTo: 'hi@agilitycreative.com',
  brandColor: '#BC01FD',
  // Used inside email bodies as the "View on the web" link and to sign URLs.
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://www.agilitycreative.com',
} as const;

export const formatSender = () =>
  `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromAddress}>`;
