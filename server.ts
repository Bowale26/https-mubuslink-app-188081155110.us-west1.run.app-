import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import Stripe from "stripe";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Read Firebase config manually to avoid import assertion issues
const configPath = path.join(__dirname, "firebase-applet-config.json");
let firebaseConfig: any = {};
try {
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  } else {
    console.warn("firebase-applet-config.json not found. Firebase Admin might not initialize correctly.");
  }
} catch (err) {
  console.error("Error reading firebase-applet-config.json:", err);
}

// Initialize Firebase Admin
let db: ReturnType<typeof getFirestore> | null = null;
if (firebaseConfig.projectId) {
  try {
    initializeApp({
      projectId: firebaseConfig.projectId,
    });
    db = getFirestore();
    console.log("Firebase Admin initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Firebase Admin:", err);
  }
}

// Lazy-load Stripe to prevent crash on startup if key is missing
let stripe: Stripe | null = null;
function getStripe() {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      console.warn("STRIPE_SECRET_KEY is missing. Stripe features will fail.");
      return null;
    }
    stripe = new Stripe(key);
  }
  return stripe;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for JSON parsing
  app.use(express.json());

  // Stripe Checkout Session Endpoint
  app.post("/api/stripe/create-checkout-session", async (req, res) => {
    try {
      const { priceId, userId, email, trialEnd, origin } = req.body;
      const stripeClient = getStripe();

      if (!stripeClient) {
        return res.status(500).json({ error: "Stripe is not configured on the server." });
      }
      
      if (!priceId || typeof priceId !== 'string' || !priceId.startsWith('price_')) {
        console.error("Invalid Price ID received:", priceId);
        return res.status(400).json({ 
          error: "Invalid Stripe Price ID. Please ensure your environment variables (VITE_MONTHLY_PRICE_ID, VITE_YEARLY_PRICE_ID) are set to valid Stripe Price IDs (starting with 'price_'), not numerical values like '6.99'." 
        });
      }

      const clientOrigin = origin || process.env.APP_URL || 'http://localhost:3000';

      const session = await stripeClient.checkout.sessions.create({
        customer_email: email,
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
        success_url: `${clientOrigin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${clientOrigin}/pricing`,
        subscription_data: {
          trial_end: trialEnd,
          metadata: { userId }
        },
        metadata: { userId }
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe Error:", error);
      res.status(error.statusCode || 500).json({ 
        error: error.message || "Failed to create checkout session" 
      });
    }
  });

  // Stripe Webhook Handler
  app.post("/api/webhooks/stripe", async (req, res) => {
    const event = req.body;

    try {
      // We are looking for the subscription update event
      if (event.type === 'customer.subscription.updated') {
        const subscription = event.data.object;
        
        // Logic: If trial_end is approaching (Stripe sends this roughly 3 days before)
        // or if the status just changed from 'trialing' to 'active'
        if (subscription.status === 'trialing' && subscription.cancel_at_period_end === false) {
          const customerId = subscription.customer;
          
          if (!db) {
            console.error("Firestore Admin not initialized. Cannot process webhook.");
            return res.status(500).send("Internal Server Error");
          }

          // Look up the user in Firestore by their Stripe Customer ID
          const userSnapshot = await db
            .collection('customers')
            .where('stripeId', '==', customerId)
            .limit(1)
            .get();

          if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            const userId = userSnapshot.docs[0].id; // The UID from customers collection

            // Update the main 'users' document to reflect the subscription status change
            // This ensures the frontend reacts instantly to trial expirations or payments
            await db.collection('users').doc(userId).set({
              subscriptionStatus: subscription.status,
              planId: subscription.plan.id,
              stripeSubscriptionId: subscription.id,
              updatedAt: new Date().toISOString()
            }, { merge: true });
            
            // Add a document to your 'mail' collection if trial is ending
            if (subscription.status === 'trialing' && subscription.cancel_at_period_end === false) {
              await db.collection('mail').add({
                to: userData.email,
                message: {
                  subject: 'Your Mubuslink trial is ending soon!',
                  html: `Your 7-day trial is almost up. You will be charged ${subscription.plan.amount / 100} ${subscription.plan.currency} soon to keep your Workspaces active.`,
                },
              });
              console.log(`Trial ending notification synced for ${userData.email}`);
            }
          }
        }
      }

      res.json({ received: true });
    } catch (error) {
      console.error("Webhook Error:", error);
      res.status(500).json({ error: "Webhook handler failed" });
    }
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // SaaS Dashboard API Endpoints (Placeholders for full-stack logic)
  app.get("/api/stats", (req, res) => {
    res.json({
      activeWebsites: 12,
      totalVisitors: "45.2k",
      aiWordsWritten: "128k",
      botConversations: "1.2k"
    });
  });

  app.post("/api/ai/generate-website", (req, res) => {
    const { businessName, industry } = req.body;
    // In a real app, this would call Gemini and store in DB
    res.json({
      success: true,
      message: `Generating website for ${businessName} in ${industry}...`,
      previewUrl: `https://preview.mubuslink.ai/${businessName.toLowerCase().replace(/\s+/g, '-')}`
    });
  });

  app.get("/api/projects", (req, res) => {
    res.json([
      { id: 1, name: "Project Alpha", type: "SaaS Template", lastUpdated: "2h ago", url: "alpha-1.run.app" },
      { id: 2, name: "Beta Landing", type: "Marketing", lastUpdated: "5h ago", url: "beta-landing.run.app" },
      { id: 3, name: "Gamma Store", type: "E-commerce", lastUpdated: "1d ago", url: "gamma-store.run.app" },
      { id: 4, name: "Delta Blog", type: "Content", lastUpdated: "3d ago", url: "delta-blog.run.app" },
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    console.log("Initializing Vite server in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware attached.");
  } else {
    // Serve static files in production
    console.log("Serving static files in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MUBUSLINK AI Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
