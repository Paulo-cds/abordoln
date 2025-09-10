const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const Stripe = require("stripe");

const stripeSecret = defineSecret("STRIPE_SECRET");

exports.createStripeSession = onCall(
  { secrets: [stripeSecret] },
  async (request) => {
    const data = request.data;

    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Usuário não autenticado.");
    }

    const stripe = new Stripe(stripeSecret.value(), {
      apiVersion: "2023-10-16",
    });

    const { item, orderId } = data;

    try {
      console.log("Criando Stripe session com:", {
        item,
        orderId,
        stripeKey: !!stripeSecret.value(),
      });
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "brl",
              product_data: { name: item.name },
              unit_amount: item.amount, // em centavos
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          transfer_group: orderId,
        },
        mode: "payment",
        success_url: `http://localhost:5173/confirmacao-pagamento/${orderId}`,
      });

      return { sessionUrl: session.url };
    } catch (err) {
      console.error("Erro ao criar sessão Stripe:", err);
      throw new HttpsError("internal", "Erro ao criar a sessão de pagamento.");
    }
  }
);
