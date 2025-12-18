// frontend/SaveCard.tsx
import React, { useState } from "react";
// import { useElements, useStripe } from "@stripe/react-stripe-js";
// import { httpsCallable } from "firebase/functions";
// import { functions } from "../firebase";
// import type { User, Reservation } from "./TypesUse";
import { CiCreditCard1 } from "react-icons/ci";
import { FaCcVisa } from "react-icons/fa";
import { FaCcAmex } from "react-icons/fa";
// import type { FormikProps } from "formik";
import { CustomCardFields } from "../pages/DetailBoat";

// type SetupIntentResponse = {
//   clientSecret: string;
//   customerId: string;
// };

// interface SaveCardProps {
//   user: User;
//   AcceptTerms: () => JSX.Element;
//   acceptedTerms: boolean;
//   setLoading: React.Dispatch<React.SetStateAction<boolean>>;

//   // Tipagem usando apenas o 'setFieldValue'
//   formik: Pick<FormikProps<Reservation>, "setFieldValue" | "handleSubmit">;
// }

export default function SaveCard() {
  // const stripe = useStripe();
  // const elements = useElements();
  const [brand, setBrand] = useState<string>("");
  // const [openAlert, setOpenAlert] = useState(false);
  // const [alertMessage, setAlertMessage] = useState("");
  // const [alertType, setAlertType] = useState<"success" | "error">("success");

  // const handleSaveCard = async () => {
  //   if (!stripe || !elements) return;
  //   setLoading(true);

  //   try {
  //     // 🔹 Cria SetupIntent no backend
  //     const createSetupIntent = httpsCallable<unknown, SetupIntentResponse>(
  //       functions,
  //       "createSetupIntent"
  //     );
  //     const { clientSecret, customerId } = (await createSetupIntent()).data;

  //     const cardElement = elements.getElement(CardNumberElement);
  //     if (!cardElement) throw new Error("CardElement não encontrado.");

  //     // 🔹 Confirma SetupIntent (salva o cartão)
  //     const { setupIntent, error } = await stripe.confirmCardSetup(
  //       clientSecret,
  //       {
  //         payment_method: {
  //           card: cardElement,
  //           billing_details: { email: user.email },
  //         },
  //       }
  //     );

  //     if (error) throw error;
  //     formik.setFieldValue("setupIntent", setupIntent.id);
  //     formik.setFieldValue("customerId", customerId);
  //     formik.setFieldValue("clientSecret", clientSecret);
  //     formik.handleSubmit();
  //   } catch (err) {
  //     console.error("Erro ao salvar cartão:", err);
  //     setAlertMessage(
  //       err instanceof Error
  //         ? err.message
  //         : "Houve um erro ao salvar o cartão. Por favor, tente novamente."
  //     );
  //     setAlertType("error");
  //     setOpenAlert(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <>
      <div>
        <p className="text-primary">
          Adicione um cartão de crédito para prosseguir com a reserva.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <CustomCardFields setBrand={setBrand} />
        </div>
        {brand === "visa" ? (
          <FaCcVisa size={100} color="#333" />
        ) : brand === "mastercard" ? (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
            alt="Mastercard"
            style={{ width: 100, height: 100 }}
          />
        ) : brand === "amex" ? (
          <FaCcAmex size={100} color="#333" />
        ) : brand === "discover" ? (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Discover_Card_logo.svg"
            alt="Discover"
            style={{ width: 100, height: 100 }}
          />
        ) : brand === "diners" ? (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Diners_Club_Logo3.svg"
            alt="Diners Club"
            style={{ width: 100, height: 100 }}
          />
        ) : brand === "jcb" ? (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/1/16/JCB_logo.svg"
            alt="JCB"
            style={{ width: 100, height: 100 }}
          />
        ) : (
          <CiCreditCard1 size={100} color="#333" />
        )}
      </div>
      <div>
        <p className="text-primary text-sm">
          Seus dados estão seguros. Não armazenamos informações do seu cartão.
        </p>
        <p className="text-primary text-sm">*Você não será cobrado agora.</p>
      </div>
      {/* <AcceptTerms /> */}
      {/* <ButtonDefault
        text={"Solicitar"}
        // type={"button"}
        action={handleSaveCard}
        disabled={
          (user && user.role === "advertiser" ? true : false) ||
          acceptedTerms === false
        }
      />
      {openAlert && (
        <AlertNotification
          open={openAlert}
          setOpen={setOpenAlert}
          message={alertMessage}
          type={alertType}
        />
      )} */}
    </>
  );
}

// import {
//   CardNumberElement,
//   CardExpiryElement,
//   CardCvcElement,
// } from "@stripe/react-stripe-js";
// import ButtonDefault from "./ButtonDefault";
// import AlertNotification from "./AlertNotification";

// const inputStyle = {
//   style: {
//     base: {
//       fontSize: "16px",
//       color: "#333",
//       width: "100%", // 👈 força o iframe a ocupar 100%
//       "::placeholder": { color: "#999" },
//     },
//   },
// };

// export function CustomCardFields({
//   setBrand,
// }: {
//   setBrand: (brand: string) => void;
// }) {
//   return (
//     <div className="flex flex-col gap-4 mb-4 mt-2">
//       <div>
//         <label className="text-primary mb-1">Número do Cartão</label>
//         <CardNumberElement
//           options={inputStyle}
//           onChange={(event) => {
//             // event.brand é algo como 'visa', 'mastercard', 'amex', etc.
//             setBrand(event.brand);
//           }}
//         />
//       </div>

//       <div className="flex gap-4">
//         <div>
//           <label className="text-primary mb-1">Validade</label>
//           <CardExpiryElement options={inputStyle} />
//         </div>
//         <div>
//           <label className="text-primary mb-1">CVC</label>
//           <CardCvcElement options={inputStyle} />
//         </div>
//       </div>
//     </div>
//   );
// }
