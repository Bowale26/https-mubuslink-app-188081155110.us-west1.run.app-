import { db, handleFirestoreError, OperationType } from "../firebase";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";

/**
 * Triggers a welcome email or trial notification
 * @param uid The Firebase Auth UID of the customer
 */
export async function sendWelcomeEmail(uid: string) {
  const path = 'mail';
  try {
    await addDoc(collection(db, path), {
      // The extension will look up the email in /customers/{uid}/email
      toUids: [uid], 
      message: {
        subject: 'Welcome to Mubuslink!',
        text: 'Your 7-day trial of our Workspaces and AI tools has started.',
        html: '<h1>Welcome to Mubuslink</h1><p>Your <b>7-day trial</b> has started!</p>',
      },
    });
    console.log("Email queued for delivery.");
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Triggers a personalized "Trial Ending" notification
 * @param uid The Firebase Auth UID of the customer
 */
export async function triggerTrialEndingEmail(uid: string) {
  const customerPath = `customers/${uid}`;
  const mailPath = 'mail';
  
  try {
    // 1. Fetch the user's name from your 'customers' collection
    let userDoc;
    try {
      userDoc = await getDoc(doc(db, 'customers', uid));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, customerPath);
      return;
    }
    
    const userData = userDoc.data();
    const firstName = userData?.displayName?.split(' ')[0] || "there";

    // 2. Add to the 'mail' collection configured in your Extension
    await addDoc(collection(db, mailPath), {
      toUids: [uid], 
      message: {
        subject: 'Action Required: Your Mubuslink trial ends in 48 hours',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; color: #333;">
            <h2>Hi ${firstName},</h2>
            <p>We hope you’ve been enjoying the <b>Mubuslink Workspaces</b> and our AI tools!</p>
            <p>This is a friendly reminder that your 7-day free trial is set to expire in <b>2 days</b>.</p>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <p><b>What happens next?</b></p>
            <ul>
              <li>Your selected plan will activate automatically.</li>
              <li>You will maintain uninterrupted access to your client projects.</li>
              <li>Your transcription credits will reset for the new month.</li>
            </ul>
            <p>If you’d like to make any changes to your subscription, you can do so anytime in your dashboard.</p>
            <a href="${window.location.origin}/dashboard" 
               style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
               Go to My Workspace
            </a>
            <p style="margin-top: 30px; font-size: 0.8em; color: #777;">
              Thank you for choosing Mubuslink.<br/>
              The Mubuslink Team
            </p>
          </div>
        `,
      },
    });
    console.log("Trial ending email queued.");
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, mailPath);
  }
}
