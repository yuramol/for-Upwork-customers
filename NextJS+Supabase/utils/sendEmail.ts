import nodemailer from 'nodemailer';

export const sendEmail = async (
  recipients: string,
  subject: string,
  text: string,
  filePath?: string
) => {
  const smtpConfig = {
    host: process.env.SMTP_HOST!,
    port: parseInt(process.env.SMTP_PORT ?? '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER_NAME,
      pass: process.env.SMTP_PASSWORD
    }
  };

  const transporter = nodemailer.createTransport(smtpConfig);

  try {
    await transporter.sendMail({
      from: '"Allied Medical" <_____@____>',
      to: recipients.split(',').filter((recipient) => !!recipient.trim()),
      subject,
      text,
      ...(filePath
        ? {
            attachments: [
              {
                filename: filePath.split('/').pop(),
                path: filePath
              }
            ]
          }
        : null)
    });
    return true;
  } catch (err: unknown) {
    return false;
  }
};
