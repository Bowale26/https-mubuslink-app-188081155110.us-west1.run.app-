import { loadStripe } from '@stripe/stripe-js';

// Load the publishable key from environment variables
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || import.meta.env.VITE_STRIPE_PUBLIC_KEY;

/**
 * Initializes Stripe promise with the publishable key.
 */
export const stripePromise = loadStripe(publishableKey || 'your_publishable_key_here');

/**
 * Handles the checkout process using the server-side session creation.
 * @param priceId The Stripe Price ID to subscribe to
 * @param userId The current user's UID
 * @param email The current user's email
 */
export const handleStripeCheckout = async (priceId: string, userId?: string, email?: string) => {
  try {
    if (!userId || !email) {
      console.warn("User authentication required for checkout.");
      // You might want to trigger a login popup here or handle it in the component
      return;
    }

    // Create a checkout session on the server
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        priceId,
        userId,
        email,
        origin: window.location.origin
      }),
    });

    const session = await response.json();

    if (session.error) {
      throw new Error(session.error);
    }

    if (session.url) {
      // Direct redirect to the Stripe-hosted checkout page
      window.location.href = session.url;
    } else {
      throw new Error("Failed to create Stripe checkout session URL.");
    }
  } catch (err: any) {
    console.error("System Error during Stripe Checkout:", err);
    throw err;
  }
};
