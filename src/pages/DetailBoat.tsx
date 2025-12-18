import { useEffect, useState } from "react";
// import ButtonDefault from "../components/ButtonDefault";
import InputDefault from "../components/InputDefault";
import { useFormik } from "formik";
import * as yup from "yup";
import LoadingDefault from "../components/LoadingDefault";
import SelectDefault from "../components/SelectDefault";
import {
  addNewReservation,
  getMyReviews,
  getSingleBoat,
} from "../services/Routes";
import { useUserData } from "../components/ContextData";
import {
  type Boat,
  type Review,
  type SelectOption,
} from "../components/TypesUse";
import AlertNotification from "../components/AlertNotification";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { Carousel } from "../components/Carousel";
import DividerComponent from "../components/DividerComponent";
import AlertBigItem from "../components/AlertBigItem";
import CardReviews from "../components/CardReviews";
import SaveCard from "../components/SaveCard";
import ButtonDefault from "../components/ButtonDefault";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";

type ReviewProps = Review & {
  id: string;
};

interface CombinedBoatData {
  boatData: Boat | null; // Pode ser null se getSingleBoat retornar null
  reviews: Review[] | null;
}

const DetailBoat = () => {
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { id } = useParams();
  const { dataUser, userLoged } = useUserData();
  const [imagesFile, setImagesFile] = useState<string[]>([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [boatAllData, setBoatAllData] = useState<Boat>();
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [minDate, setMinDate] = useState(""); // Estado para armazenar a data mínima formatada
  const [valueReserve, setValueReserve] = useState<string>("");
  const [alertBig, setAlertBig] = useState<boolean>(false);
  const [reviewsBoat, setReviewsBoat] = useState<Review[]>();
  const [optionsSelect, setOptionsSelect] = useState<SelectOption[]>([]);
  const [isSubmiting, setIsSubmitting] = useState(false);

  const { isLoading, error } = useQuery<CombinedBoatData | null>(
    ["boat", id],
    async () => {
      if (!id) {
        return null; // Retorna null se não houver ID, para a query não ser habilitada
      }
      const [boatDataResponse, reviewsResponse] = await Promise.all([
        getSingleBoat(id),
        getMyReviews(id),
      ]);
      let reviewsData: ReviewProps[] = [];

      if (reviewsResponse && reviewsResponse.data) {
        reviewsData = reviewsResponse.data;
      }

      return { boatData: boatDataResponse, reviews: reviewsData };
    },
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
      retry: 1,
      onSuccess: (data) => {
        if (data) {
          if (data.boatData) {
            setImagesFile(data.boatData.images || []);
            setBoatAllData(data.boatData);
            if (data.boatData.price) {
              // const calculatedPrice = (
              //   parseFloat(data.boatData.price) * 1.04
              // ).toFixed(2);
              setValueReserve(data.boatData.price.replace(".", ","));
            }
          }
          if (data.reviews) {
            setReviewsBoat(data.reviews);
          }
        }
      },
      onError: (err) => {
        console.error("Erro ao carregar os dados do barco:", err);
        setAlertMessage("Erro ao carregar os dados do barco.");
        setAlertType("error");
        setOpenAlert(true);
      },
    }
  );

  useEffect(() => {
    if (boatAllData) {
      const dataControl = boatAllData;
      const newOptions = dataControl.scripts;
      const reloadedItems = [{ label: "Roteiros", value: "" }];
      newOptions?.forEach((item) => {
        reloadedItems.push({ label: item, value: item });
      });
      setOptionsSelect(reloadedItems);
      // dataControl.scripts = reloadedItems;
      setBoatAllData(dataControl);
    }
  }, [boatAllData]);

  useEffect(() => {
    const today = new Date(); // Pega a data de hoje
    const twoDaysLater = new Date(today); // Cria uma nova data baseada em hoje
    twoDaysLater.setDate(today.getDate() + 2); // Adiciona 2 dias à data atual

    // Formata a data para AAAA-MM-DD
    const year = twoDaysLater.getFullYear();
    const month = (twoDaysLater.getMonth() + 1).toString().padStart(2, "0"); // Mês é 0-indexado, então +1
    const day = twoDaysLater.getDate().toString().padStart(2, "0");

    const formattedMinDate = `${year}-${month}-${day}`;
    setMinDate(formattedMinDate); // Atualiza o estado com a data mínima
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      quantity: "",
      data: new Date().toLocaleDateString(),
      dataTour: "",
      script: "",
      acceptedTerms: false,
      setupIntent: {
        id: "",
        status: "",
        payment_method: "",
      },
      customerId: "",
      clientSecret: "",
    },
    validationSchema: yup.object({
      name: yup.string().required("O nome é obrigatório."),
      email: yup.string().required("O email é obrigatório."),
      phone: yup.string().required("O telefone é obrigatório."),
      quantity: yup
        .string()
        .required("A quantidade de passageiros é obrigatória."),
      dataTour: yup.string().required("Selecione a data do passeio."),
      script: yup.string().required("Selecione um roteiro."),
      acceptedTerms: yup.boolean().required("O tipo de usuário é obrigatório."),
      setupIntent: yup
        .object({
          id: yup.string().required("O ID do SetupIntent é obrigatório."),
          status: yup
            .string()
            .required("O status do SetupIntent é obrigatório."),
          payment_method: yup
            .string()
            .required("O ID do PaymentMethod é obrigatório."),
        })
        .required("Preencha todos os dados do cartão corretamente."),
      customerId: yup
        .string()
        .required("Preencha todos os dados do cartão corretamente."),
      clientSecret: yup
        .string()
        .required("Preencha todos os dados do cartão corretamente."),
    }),
    onSubmit: async (values, { setSubmitting, resetForm, setFieldError }) => {
      setLoading(true);
      try {
        if (!boatAllData) {
          console.error("boatAllData não está disponível.");
          setAlertMessage("Erro: Dados do barco não carregados.");
          setAlertType("error");
          setOpenAlert(true);
          setLoading(false);
          setSubmitting(false);
          return;
        }
        console.log("submiting...");
        // if (!userLoged || (userLoged && !userLoged.isLoged)) {
        //   sessionStorage.setItem(
        //     "solicitacaoPendencia",
        //     JSON.stringify(values)
        //   );
        //   const currentPath = window.location.pathname + window.location.search;
        //   window.location.href = `/login?redirect_uri=${encodeURIComponent(
        //     currentPath
        //   )}`;
        //   return;
        // }

        if (parseInt(values.quantity) > parseInt(boatAllData.capacity)) {
          setFieldError(
            "quantity",
            `A quantidade de pessoas não pode ser maior que a capacidade da embarcação que é de ${boatAllData.capacity}.`
          );
          setLoading(false);
          setSubmitting(false);
          return;
        }

        if (values.dataTour < minDate) {
          setFieldError(
            "dataTour",
            `A data deve ser no mínimo para daqui a 2 dias.`
          );
          setLoading(false);
          setSubmitting(false);
          return;
        }

        const dateAtMidnightLocal = new Date(`${values.dataTour}T00:00:00`);

        if (dataUser && id && boatAllData) {
          await handleSaveCard();
          const data = {
            name: values.name,
            email: values.email,
            phone: values.phone,
            quantity: values.quantity,
            data: values.data,
            dataTour: dateAtMidnightLocal.toLocaleDateString("pt-BR"),
            script: values.script,
            acceptedTerms: values.acceptedTerms,
            clientId: dataUser.userId,
            boatId: id,
            boatName: boatAllData.name ?? "",
            imgBoat: boatAllData.images[0], // Use optional chaining for safety
            price: valueReserve,
            paymentMethod: {
              paymentMethodId: values.setupIntent.payment_method,
              customerId: values.customerId,
              clientSecret: values.clientSecret,
            },
            managerId: boatAllData.managerId ?? "",
            acceptedReserv: false,
            paid: false,
            boarding: boatAllData.boarding ?? "",
            boardingTime: boatAllData.boardingTime ?? "",
            duration: boatAllData.duration ?? "",
            status: "requested", // Add the required status property
          };

          await addNewReservation(data);
          setAlertMessage(
            "Solicitação enviada com sucesso! Logo retornaremos com a confirmação."
          );
          setAlertBig(true);
          resetForm();
        }
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    },
  });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    const savedFormData = sessionStorage.getItem("solicitacaoPendencia");
    if (savedFormData) {
      const userFromData = JSON.parse(savedFormData);
      formik.setValues({
        name: userFromData.name,
        email: userFromData.email,
        phone: userFromData.phone,
        quantity: userFromData.quantity,
        dataTour: userFromData.dataTour,
        data: new Date().toLocaleDateString(),
        script: userFromData.script,
        acceptedTerms: userFromData.acceptedTerms,
        setupIntent: userFromData.setupIntent,
        customerId: userFromData.customerId,
        clientSecret: userFromData.clientSecret,
      });
      sessionStorage.removeItem("solicitacaoPendencia");
    }
  }, []);

  if (error) {
    console.log("Erro get-edit ", error);
  }
  // console.log('formik values', formik.values)
  const AcceptTerms = () => {
    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          id="myCheckbox"
          name="myCheckbox"
          className="form-checkbox h-5 w-5 text-primary radius-[50px] cursor-pointer"
          checked={formik.values.acceptedTerms}
          onChange={() =>
            formik.setFieldValue("acceptedTerms", !formik.values.acceptedTerms)
          }
        />
        <label htmlFor="myCheckbox" className="ml-2 text-gray-700">
          <a
            href="/termos-de-uso"
            target="_blank"
            className="text-primary underline"
          >
            Aceito os termos e condições*
          </a>
        </label>
      </div>
    );
  };

  type SetupIntentResponse = {
    clientSecret: string;
    customerId: string;
  };

  const handleSaveCard = async () => {
    if (!stripe || !elements) return;
    setLoading(true);

    if (!userLoged || (userLoged && !userLoged.isLoged)) {
      sessionStorage.setItem(
        "solicitacaoPendencia",
        JSON.stringify(formik.values)
      );
      const currentPath = window.location.pathname + window.location.search;
      window.location.href = `/login?redirect_uri=${encodeURIComponent(
        currentPath
      )}`;
      return;
    }

    try {
      // 🔹 Cria SetupIntent no backend
      const createSetupIntent = httpsCallable<unknown, SetupIntentResponse>(
        functions,
        "createSetupIntent"
      );
      const { clientSecret, customerId } = (await createSetupIntent()).data;

      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) throw new Error("CardElement não encontrado.");

      // 🔹 Confirma SetupIntent (salva o cartão)
      const { setupIntent, error } = await stripe.confirmCardSetup(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: { email: dataUser ? dataUser.email : "" },
          },
        }
      );

      if (error) {
        setLoading(false);
        throw error;
      }

      formik.setFieldValue("setupIntent", {
        id: setupIntent.id,
        status: setupIntent.status,
        payment_method: setupIntent.payment_method,
      });
      formik.setFieldValue("customerId", customerId);
      formik.setFieldValue("clientSecret", clientSecret);
      console.log("setupIntent", setupIntent);
      console.log("customerId", customerId);
      console.log("clientSecret", clientSecret);
      setIsSubmitting(true);
      // setTimeout(() => {
      //   if (formik.values.setupIntent && formik.values.customerId && formik.values.clientSecret) {
      //     console.log("values ", formik.values);
      //     formik.handleSubmit();
      //   }
      // }, 2000);
    } catch (err) {
      console.error("Erro ao salvar cartão:", err);
      setAlertMessage(
        err instanceof Error
          ? err.message
          : "Houve um erro ao salvar o cartão. Por favor, tente novamente."
      );
      setAlertType("error");
      setOpenAlert(true);
    } finally {
      setLoading(false);
    }
  };
  // console.log("values fora da função", formik.values);

  useEffect(() => {
    if (
      isSubmiting &&
      formik.values.setupIntent.id &&
      formik.values.customerId &&
      formik.values.clientSecret
    ) {
      console.log("values ", formik.values);
      formik.handleSubmit();
      setIsSubmitting(false);
    }
  }, [formik.values, isSubmiting]);

  return (
    <div className="pb-10 w-full">
      {imagesFile.length > 0 && (
        <div className="pb-8 mt-8">
          <Carousel slides={imagesFile} />
        </div>
      )}
      {boatAllData && (
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-6 gap-4 w-full ">
          <div className="flex flex-col gap-4 items-start lg:col-span-4">
            <p className="text-primary text-[2em] font-semibold ">
              {boatAllData.name} - {boatAllData.city}
            </p>
            <div>
              <p className="text-primary text-[1.5em] font-medium ">
                Descrição
              </p>
              <p className="text-primary text[1em]">
                {boatAllData.description}
              </p>
            </div>
            <DividerComponent />
            <div>
              <p className="text-primary text-[1.5em] font-medium ">
                Capacidade
              </p>
              <p className="text-primary text[1em]">
                {boatAllData.capacity} pessoas
              </p>
            </div>
            <DividerComponent />
            <div>
              <p className="text-primary text-[1.5em] font-medium ">Detalhes</p>
              <ul className="list-disc text-primary">
                {boatAllData.details?.map((item, i) => (
                  <li key={i}>
                    <p className="text-primary text[1em]">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
            <DividerComponent />
            <div>
              <p className="text-primary text-[1.5em] font-medium ">
                Estrutura
              </p>
              <ul className="list-disc text-primary">
                {boatAllData.structure?.map((item, i) => (
                  <li key={i}>
                    <p className="text-primary text[1em]">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
            <DividerComponent />
            <div>
              <p className="text-primary text-[1.5em] font-medium ">Embarque</p>
              <p className="text-primary text[1em]">
                {boatAllData.boarding} ás {boatAllData.boardingTime}
              </p>
            </div>
            <DividerComponent />
            <div>
              <p className="text-primary text-[1.5em] font-medium ">Duração</p>
              <p className="text-primary text[1em]">{boatAllData.duration}</p>
            </div>
          </div>
          {(!dataUser || (dataUser && dataUser.role !== "advertiser")) && (
            <div className="border lg:col-span-2 radius-2 border-solid rounded-xl border-primary shadow-xl/50 shadow-primary items-center justify-center flex flex-col p-3">
              <p className="text-primary text-[1.5em] font-medium ">
                Solicite sua reserva
              </p>
              <form
                className="flex flex-col gap-4 w-full mt-4"
                onSubmit={formik.handleSubmit}
              >
                <div>
                  <InputDefault
                    type={"text"}
                    placeholder={"Nome Completo"}
                    name={"name"}
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    required={true}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <p className="text-red-500 text-sm">{formik.errors.name}</p>
                  ) : null}
                </div>
                <div>
                  <InputDefault
                    type={"email"}
                    placeholder={"Email"}
                    name={"email"}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    required={true}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <p className="text-red-500 text-sm">
                      {formik.errors.email}
                    </p>
                  ) : null}
                </div>
                <div>
                  <InputDefault
                    placeholder={"Whatsapp"}
                    required={true}
                    type={"tel"}
                    name={"phone"}
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    pattern={"[0-9]{2}[0-9]{5}[0-9]{4}"}
                    title={"Formato: 12345678901"}
                    maxLength={11}
                  />
                  {formik.touched.phone && formik.errors.phone ? (
                    <p className="text-red-500 text-sm">
                      {formik.errors.phone}
                    </p>
                  ) : null}
                </div>
                <div>
                  <InputDefault
                    placeholder={"Quantidade de pessoas"}
                    required={true}
                    name={"quantity"}
                    value={formik.values.quantity}
                    onChange={formik.handleChange}
                    pattern={"[0-9]*"}
                    title={"Adicione apenas números, ex: 20"}
                  />
                  {formik.touched.quantity && formik.errors.quantity ? (
                    <p className="text-red-500 text-sm">
                      {formik.errors.quantity}
                    </p>
                  ) : null}
                </div>
                <div>
                  <InputDefault
                    type={"date"}
                    placeholder={"Data da reserva"}
                    required={true}
                    name={"dataTour"}
                    value={formik.values.dataTour}
                    onChange={formik.handleChange}
                    min={minDate}
                  />
                  {formik.touched.dataTour && formik.errors.dataTour ? (
                    <p className="text-red-500 text-sm">
                      {formik.errors.dataTour}
                    </p>
                  ) : null}
                </div>
                <div>
                  <SelectDefault
                    placeholder={"Roteiro"}
                    name={"script"}
                    value={formik.values.script}
                    onChange={formik.handleChange}
                    options={optionsSelect}
                    required={true}
                  />
                  {formik.touched.script && formik.errors.script ? (
                    <p className="text-red-500 text-sm">
                      {formik.errors.script}
                    </p>
                  ) : null}
                </div>
                <div>
                  {/* <p className="text-primary text-[.7em] font-medium ">
                    locação+taxas*
                  </p> */}
                  <p className="text-primary text-[1.6em] font-medium ">
                    Total: R$ {valueReserve}
                  </p>
                </div>
                <SaveCard />
                {/* {(formik.touched.setupIntent && formik.errors.setupIntent) ||
                (formik.touched.customerId && formik.errors.customerId) ||
                (formik.touched.clientSecret && formik.errors.clientSecret) ? (
                  <p className="text-red-500 text-sm">
                    {formik.errors.setupIntent ||
                      formik.errors.customerId ||
                      formik.errors.clientSecret}
                  </p>
                ) : null} */}
                {formik.touched.setupIntent &&
                typeof formik.errors.setupIntent === "object" ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.setupIntent.id && (
                      <p>{formik.errors.setupIntent.id}</p>
                    )}
                    {formik.errors.setupIntent.status && (
                      <p>{formik.errors.setupIntent.status}</p>
                    )}
                    {formik.errors.setupIntent.payment_method && (
                      <p>{formik.errors.setupIntent.payment_method}</p>
                    )}
                  </div>
                ) : null}
                <AcceptTerms />
                <ButtonDefault
                  text={"Solicitar"}
                  type={"submit"}
                  action={handleSaveCard}
                  disabled={
                    (dataUser && dataUser.role === "advertiser"
                      ? true
                      : false) || formik.values.acceptedTerms === false
                  }
                />
              </form>
            </div>
          )}
        </div>
      )}
      <div className="flex items-center gap-3 mt-10 w-full overflow-y-auto p-1">
        {reviewsBoat &&
          reviewsBoat
            .slice(0)
            .reverse()
            .map((boat, i) => (
              <CardReviews
                boatId={boat.boatId}
                text={boat.text}
                value={boat.value}
                date={boat.date}
                userName={boat.userName}
                key={i}
              />
            ))}
      </div>
      {/* <div>
        <Instructions/>
      </div> */}
      {loading && <LoadingDefault />}
      {openAlert && (
        <AlertNotification
          open={openAlert}
          setOpen={setOpenAlert}
          message={alertMessage}
          type={alertType}
        />
      )}
      {alertBig && <AlertBigItem setOpen={setAlertBig} text={alertMessage} />}
    </div>
  );
};

export default DetailBoat;

import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
// import Instructions from "../components/Instructions";

const inputStyle = {
  style: {
    base: {
      fontSize: "16px",
      color: "#333",
      width: "100%", // 👈 força o iframe a ocupar 100%
      "::placeholder": { color: "#999" },
    },
  },
};

export function CustomCardFields({
  setBrand,
}: {
  setBrand: (brand: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 mb-4 mt-2">
      <div>
        <label className="text-primary mb-1">Número do Cartão</label>
        <CardNumberElement
          options={inputStyle}
          onChange={(event) => {
            // event.brand é algo como 'visa', 'mastercard', 'amex', etc.
            setBrand(event.brand);
          }}
        />
      </div>

      <div className="flex gap-4">
        <div>
          <label className="text-primary mb-1">Validade</label>
          <CardExpiryElement options={inputStyle} />
        </div>
        <div>
          <label className="text-primary mb-1">CVV</label>
          <CardCvcElement options={inputStyle} />
        </div>
      </div>
    </div>
  );
}
