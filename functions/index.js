// comando para atualizar funções - firebase deploy --only functions
const functions = require('firebase-functions');
const stripe = require('stripe')(functions.config().stripe.secretkey) //

const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {logger} = require("firebase-functions/v2");


// const stripe = new Stripe(functions.config().stripe.secretkey, {
//   apiVersion: '2025-08-15' // É uma boa prática definir a versão da API
// });


// exports.createStripeSession = functions.https.onCall(async (data, context) => {
//   // 2. Verifique se o usuário está autenticado. 
//   //   Isso é fundamental para a segurança.
  
//   // if (!context.auth) {
//   //   throw new functions.https.HttpsError('unauthenticated', 'A função deve ser chamada por um usuário autenticado.', context);
//   // }

//   // 3. Receba os dados do frontend
//   const { item, orderId } = data; // Você enviará esses dados do React

//   try {
//     const session = await stripe.checkout.sessions.create({
//       line_items: [
//         {
//           price_data: {
//             currency: 'brl', // Adapte para a sua moeda
//             product_data: {
//               name: item.name,
//             },
//             unit_amount: item.amount, // O valor já em centavos
//           },
//           quantity: 1, // A quantidade é 1
//         },
//       ],
//       payment_intent_data: {
//         transfer_group: orderId, // Usa o orderId enviado do frontend
//       },
//       mode: 'payment',
//       success_url: `http://localhost:5173/confirmacao-pagamento/${orderId}`, // Redireciona para a página de confirmação
//     });

//     // 5. Retorne a URL da sessão do Stripe para o frontend
//     return { sessionUrl: session.url };
//   } catch (error) {
//     console.error("Erro ao criar a sessão do Stripe:", error);
//     throw new functions.https.HttpsError('internal', 'Erro ao criar a sessão de pagamento.');
//   }
// });

exports.createStripeSession = onCall(async (data, request) => {
  // 2. Verifique se o usuário está autenticado. 
  //   Isso é fundamental para a segurança.
  
  if (!(typeof text === "string") || text.length === 0) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new HttpsError("invalid-argument", "The function must be called " +
            "with one arguments \"text\" containing the message text to add.");
  }
  // Checking that the user is authenticated.
  if (!request.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new HttpsError("failed-precondition", "The function must be " +
            "called while authenticated.");
  }

  // 3. Receba os dados do frontend
  const { item, orderId } = data; // Você enviará esses dados do React

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'brl', // Adapte para a sua moeda
            product_data: {
              name: item.name,
            },
            unit_amount: item.amount, // O valor já em centavos
          },
          quantity: 1, // A quantidade é 1
        },
      ],
      payment_intent_data: {
        transfer_group: orderId, // Usa o orderId enviado do frontend
      },
      mode: 'payment',
      success_url: `http://localhost:5173/confirmacao-pagamento/${orderId}`, // Redireciona para a página de confirmação
    });

    // 5. Retorne a URL da sessão do Stripe para o frontend
    return { sessionUrl: session.url };
  } catch (error) {
    console.error("Erro ao criar a sessão do Stripe:", error);
    throw new HttpsError("unknown", error.message, error);
  }
});