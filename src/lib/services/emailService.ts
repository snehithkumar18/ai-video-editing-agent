import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  try {
    await resend.emails.send({
      from: 'noreply@vidagent.app',
      to: email,
      subject: 'Welcome to VidAgent!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to VidAgent, ${name}!</h2>
          <p>We're thrilled to have you on board. With VidAgent, you can clone your voice, create an AI avatar, and generate fully edited videos in minutes.</p>
          <p>Get started by uploading your first voice and avatar profiles in the dashboard.</p>
          <br/>
          <p>The VidAgent Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send welcome email', error);
  }
}

export async function sendVideoReadyEmail(email: string, name: string, projectTitle: string, videoUrl: string): Promise<void> {
  try {
    await resend.emails.send({
      from: 'noreply@vidagent.app',
      to: email,
      subject: `Your video "${projectTitle}" is ready!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Great news, ${name}!</h2>
          <p>Your video <strong>${projectTitle}</strong> has finished generating and is ready to view and export.</p>
          <a href="${videoUrl}" style="display: inline-block; padding: 12px 24px; background-color: #7C3AED; color: white; text-decoration: none; border-radius: 6px; margin-top: 16px;">View Video</a>
          <br/><br/>
          <p>The VidAgent Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send video ready email', error);
  }
}

export async function sendLowCreditsEmail(email: string, name: string, creditsRemaining: number): Promise<void> {
  try {
    await resend.emails.send({
      from: 'noreply@vidagent.app',
      to: email,
      subject: 'Your render credits are running low',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${name},</h2>
          <p>You only have <strong>${creditsRemaining}</strong> render credits remaining on your account.</p>
          <p>Upgrade your plan to get more credits and keep creating amazing videos.</p>
          <br/>
          <p>The VidAgent Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send low credits email', error);
  }
}

export async function sendSubscriptionConfirmedEmail(email: string, name: string, plan: string): Promise<void> {
  try {
    await resend.emails.send({
      from: 'noreply@vidagent.app',
      to: email,
      subject: 'Subscription Confirmed',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Thank you, ${name}!</h2>
          <p>Your subscription to the <strong>${plan}</strong> plan has been confirmed.</p>
          <p>Your new render credits and limits have been applied to your account. Happy creating!</p>
          <br/>
          <p>The VidAgent Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send subscription email', error);
  }
}
