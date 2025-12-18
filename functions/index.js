const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const Stripe = require("stripe");
//firebase deploy --only functions
const stripeSecret = defineSecret("STRIPE_SECRET");

//função que cria pagamento no stripe
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

//função que cria pagamento no stripe com captura manual
exports.createStripeCapture = onCall(
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
          capture_method: "manual",
          // capture_delay_days: 30,
        },
        mode: "payment",
        success_url: `http://localhost:5173/confirmacao-pagamento/${orderId}?session_id={CHECKOUT_SESSION_ID}`,
      });

      return { sessionUrl: session.url, sessionData: session };
    } catch (err) {
      console.error("Erro ao criar sessão Stripe:", err);
      throw new HttpsError("internal", "Erro ao criar a sessão de pagamento.");
    }
  }
);

//função que verifica o status do pagamento e retorna o payment_intent(id do pagamento)
exports.checkPaymentStatus = onCall(
  { secrets: [stripeSecret] },
  async (request) => {
    const data = request.data;

    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Usuário não autenticado.");
    }

    const stripe = new Stripe(stripeSecret.value(), {
      apiVersion: "2023-10-16",
    });

    const { sessionId } = data;

    // Se o sessionId não for fornecido, a função não pode continuar
    if (!sessionId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "O ID da sessão não foi fornecido."
      );
    }

    try {
      // 3. Use o sessionId para obter os detalhes da sessão na Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      // 4. Retorne o payment_intent (ID do pagamento) para o frontend
      // Este ID é o mais importante para gerenciar a transação
      return { paymentIntentId: session.payment_intent };
    } catch (err) {
      // 5. Registre o erro no console para depuração
      console.error("Erro ao buscar a sessão do Stripe:", err);

      // 6. Lance um erro para o frontend
      throw new functions.https.HttpsError(
        "internal",
        "Erro ao verificar o status do pagamento."
      );
    }
  }
);

//função que captura o pagamento manualmente
exports.captureStripePayment = onCall(
  { secrets: [stripeSecret] },
  async (request) => {
    const data = request.data;

    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Usuário não autenticado.");
    }

    const stripe = new Stripe(stripeSecret.value(), {
      apiVersion: "2023-10-16",
    });

    const { paymentIntentId } = data;

    try {
      const paymentIntent = await stripe.paymentIntents.capture(
        paymentIntentId
      );

      return { paymentIntent: paymentIntent };
    } catch (err) {
      console.error("Erro ao criar sessão Stripe:", err);
      throw new HttpsError("internal", "Erro ao criar a sessão de pagamento.");
    }
  }
);

//função que cancela o pagamento manualmente
exports.cancelStripePayment = onCall(
  { secrets: [stripeSecret] },
  async (request) => {
    const data = request.data;

    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Usuário não autenticado.");
    }

    const stripe = new Stripe(stripeSecret.value(), {
      apiVersion: "2023-10-16",
    });

    const { paymentIntentId } = data;

    try {
      const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);

      return { paymentIntent: paymentIntent };
    } catch (err) {
      console.error("Erro ao criar sessão Stripe:", err);
      throw new HttpsError("internal", "Erro ao criar a sessão de pagamento.");
    }
  }
);

/*******Métodos de pagamentos futuros**********/

//função que cria um SetupIntent para pagamentos futuros
//Cria um Customer (se não existir) e um SetupIntent para o usuário salvar o cartão.
exports.createSetupIntent = onCall(
  { secrets: [stripeSecret] },
  async (request) => {
    const { uid, email } = request.auth?.token || {};
    if (!uid || !email) {
      throw new HttpsError("unauthenticated", "Usuário não autenticado.");
    }

    const stripe = new Stripe(stripeSecret.value(), {
      apiVersion: "2023-10-16",
    });

    try {
      // 🔹 Cria ou recupera Customer
      const customers = await stripe.customers.list({ email, limit: 1 });
      let customer = customers.data.length ? customers.data[0] : null;

      if (!customer) {
        customer = await stripe.customers.create({
          email,
          metadata: { firebaseUID: uid },
        });
      }

      // 🔹 Cria SetupIntent vinculado ao Customer
      const setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
        payment_method_types: ["card"],
        usage: "off_session", // permite cobrança futura
      });

      return {
        clientSecret: setupIntent.client_secret,
        customerId: customer.id,
      };
    } catch (err) {
      console.error("Erro ao criar SetupIntent:", err);
      throw new HttpsError("internal", "Não foi possível criar o SetupIntent.");
    }
  }
);

//Função que cobra o cartão salvo, mesmo após dias, usando off_session.
exports.chargeSavedCard = onCall(
  { secrets: [stripeSecret] },
  async (request) => {
    const { customerId, paymentMethodId, amount, description } = request.data;
    if (!customerId || !paymentMethodId || !amount) {
      throw new HttpsError("invalid-argument", "Dados insuficientes.");
    }

    const stripe = new Stripe(stripeSecret.value(), {
      apiVersion: "2023-10-16",
    });

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        customer: customerId,
        payment_method: paymentMethodId,
        amount: amount, // em centavos
        currency: "brl",
        off_session: true,
        confirm: true,
        description,
      });

      return {
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
      };
    } catch (err) {
      console.error("Erro ao cobrar cartão salvo:", err);

      if (err.code === "authentication_required") {
        return {
          requiresAction: true,
          paymentIntentClientSecret: err.raw.payment_intent.client_secret,
        };
      }

      // Se precisar de autenticação
      if (err.code === "authentication_required") {
        return {
          requiresAction: true,
          paymentIntentClientSecret: err.raw.payment_intent.client_secret,
        };
      }

      // 👇 Adicione este trecho para logar o erro real do Stripe
      // return {
      //   error: true,
      //   message: err.message,
      //   type: err.type,
      //   code: err.code,
      //   raw: err.raw,
      // };

      // throw new HttpsError("internal", "Erro ao criar a cobrança.");
      throw new HttpsError(
        "internal",
        err?.message || "Erro ao criar a cobrança.",
        { stripeError: err }
      );
    }
  }
);
