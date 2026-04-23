import nodemailer from 'nodemailer';

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

const ADMIN_EMAILS = ['rhemaexpertsolutions@gmail.com', 'onyevid@gmail.com'];

interface EmailOptions {
  to: string[];
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn('Email notifications disabled: SMTP_USER or SMTP_PASS not configured');
    return { success: false, error: 'Email configuration missing' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Rhema Expert Solutions" <${SMTP_USER}>`,
      to: to.join(', '),
      subject,
      html,
      text: text || subject,
    });

    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' };
  }
}

export async function sendCompetitionRegistrationEmail(registration: {
  full_name: string;
  gender: string;
  age: number | string;
  date_of_birth?: string;
  school_name: string;
  school_address?: string;
  school_phone?: string;
  class_level: string;
  category: string;
  parent_name: string;
  parent_phone: string;
  parent_email?: string;
  competition_name?: string;
}) {
  const html = `
    <h2 style="color: #1e3a8a;">New Competition Registration</h2>
    <p>A new registration has been submitted for the <strong>${registration.competition_name || 'SMART CODERS NATIONAL COMPETITION'}</strong>.</p>
    <hr style="border: 1px solid #e5e7eb; margin: 16px 0;" />
    <table style="border-collapse: collapse; width: 100%; font-size: 14px;">
      <tr><td style="padding: 8px; font-weight: bold; color: #374151;">Student Name:</td><td style="padding: 8px;">${registration.full_name}</td></tr>
      <tr><td style="padding: 8px; font-weight: bold; color: #374151;">Gender:</td><td style="padding: 8px;">${registration.gender}</td></tr>
      <tr><td style="padding: 8px; font-weight: bold; color: #374151;">Age:</td><td style="padding: 8px;">${registration.age}${registration.date_of_birth ? ` (DOB: ${registration.date_of_birth})` : ''}</td></tr>
      <tr><td style="padding: 8px; font-weight: bold; color: #374151;">Category:</td><td style="padding: 8px;">${registration.category}</td></tr>
      <tr><td style="padding: 8px; font-weight: bold; color: #374151;">Class Level:</td><td style="padding: 8px;">${registration.class_level}</td></tr>
      <tr><td style="padding: 8px; font-weight: bold; color: #374151;">School:</td><td style="padding: 8px;">${registration.school_name}${registration.school_address ? ` (${registration.school_address})` : ''}</td></tr>
      ${registration.school_phone ? `<tr><td style="padding: 8px; font-weight: bold; color: #374151;">School Phone:</td><td style="padding: 8px;">${registration.school_phone}</td></tr>` : ''}
      <tr><td style="padding: 8px; font-weight: bold; color: #374151;">Parent/Guardian:</td><td style="padding: 8px;">${registration.parent_name}</td></tr>
      <tr><td style="padding: 8px; font-weight: bold; color: #374151;">Parent Phone:</td><td style="padding: 8px;">${registration.parent_phone}</td></tr>
      ${registration.parent_email ? `<tr><td style="padding: 8px; font-weight: bold; color: #374151;">Parent Email:</td><td style="padding: 8px;">${registration.parent_email}</td></tr>` : ''}
    </table>
    <hr style="border: 1px solid #e5e7eb; margin: 16px 0;" />
    <p style="font-size: 12px; color: #6b7280;">This is an automated notification from Rhema Expert Solutions.</p>
  `;

  return sendEmail({
    to: ADMIN_EMAILS,
    subject: `New Competition Registration: ${registration.full_name}`,
    html,
  });
}

export async function sendCodingClassRegistrationEmail(registration: {
  full_name: string;
  email?: string;
  phone: string;
  age?: number | string;
  gender?: string;
  courses: string[];
  payment_plan: string;
  experience_level?: string;
  preferred_start_date?: string;
  notes?: string;
}) {
  const courseList = registration.courses.map(c => `<li>${c}</li>`).join('');
  
  const paymentPlanLabels: Record<string, string> = {
    per_hour: 'Per Hour',
    weekly: 'Weekly',
    monthly: 'Monthly',
  };

  const html = `
    <h2 style="color: #1e3a8a;">New Coding Class Registration</h2>
    <p>A new student has registered for online coding classes.</p>
    <hr style="border: 1px solid #e5e7eb; margin: 16px 0;" />
    <table style="border-collapse: collapse; width: 100%; font-size: 14px;">
      <tr><td style="padding: 8px; font-weight: bold; color: #374151;">Student Name:</td><td style="padding: 8px;">${registration.full_name}</td></tr>
      ${registration.email ? `<tr><td style="padding: 8px; font-weight: bold; color: #374151;">Email:</td><td style="padding: 8px;">${registration.email}</td></tr>` : ''}
      <tr><td style="padding: 8px; font-weight: bold; color: #374151;">Phone:</td><td style="padding: 8px;">${registration.phone}</td></tr>
      ${registration.gender ? `<tr><td style="padding: 8px; font-weight: bold; color: #374151;">Gender:</td><td style="padding: 8px;">${registration.gender}</td></tr>` : ''}
      ${registration.age ? `<tr><td style="padding: 8px; font-weight: bold; color: #374151;">Age:</td><td style="padding: 8px;">${registration.age}</td></tr>` : ''}
      <tr><td style="padding: 8px; font-weight: bold; color: #374151;">Experience Level:</td><td style="padding: 8px; text-transform: capitalize;">${registration.experience_level || 'beginner'}</td></tr>
      <tr><td style="padding: 8px; font-weight: bold; color: #374151;">Selected Courses:</td><td style="padding: 8px;"><ul style="margin: 0; padding-left: 20px;">${courseList}</ul></td></tr>
      <tr><td style="padding: 8px; font-weight: bold; color: #374151;">Payment Plan:</td><td style="padding: 8px;">${paymentPlanLabels[registration.payment_plan] || registration.payment_plan}</td></tr>
      ${registration.preferred_start_date ? `<tr><td style="padding: 8px; font-weight: bold; color: #374151;">Preferred Start Date:</td><td style="padding: 8px;">${registration.preferred_start_date}</td></tr>` : ''}
      ${registration.notes ? `<tr><td style="padding: 8px; font-weight: bold; color: #374151;">Notes:</td><td style="padding: 8px;">${registration.notes}</td></tr>` : ''}
    </table>
    <hr style="border: 1px solid #e5e7eb; margin: 16px 0;" />
    <p style="font-size: 12px; color: #6b7280;">This is an automated notification from Rhema Expert Solutions.</p>
  `;

  return sendEmail({
    to: ADMIN_EMAILS,
    subject: `New Coding Class Registration: ${registration.full_name}`,
    html,
  });
}
