import { useEffect, useState } from "react";
import ButtonDefault from "../components/ButtonDefault";
import InputDefault, { TextareaDefault } from "../components/InputDefault";
import LoadingDefault from "../components/LoadingDefault";
import {
  assessmentTrip,
  // cancelPaymentReservation,
  getSingleReservation,
  receivePenaltyReservation,
  // handleCapturePayment,
  // receivePaymentReservation,
  type RatingData,
} from "../services/Routes";
import { type Reservation /*type SelectOption*/ } from "../components/TypesUse";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import DividerComponent from "../components/DividerComponent";
import RatingStar from "../components/RatingStar";
import AlertNotification from "../components/AlertNotification";
import { FaWhatsapp } from "react-icons/fa";
import { useUserData } from "../components/ContextData";
import { FaRegEdit } from "react-icons/fa";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const DetailMyReservation = () => {
  const { dataUser } = useUserData();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [reservationAllData, setReservationAllData] = useState<Reservation>();
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [assessmentChanged, setAssessmentChanged] = useState<boolean>(false);
  const [errorAssessment, setErrorAssessment] = useState<boolean>(false);
  const [assessmentValue, setAssessmentValue] = useState<number | null>(null);
  const [assessmentText, setAssessmentText] = useState("");
  const [minDate, setMinDate] = useState("");
  const [valueReceive, setValueReceive] = useState<string>("");
  const [openEditValueReceive, setOpenEditValueReceive] = useState(false);
  // const [optionsSelect, setOptionsSelect] = useState<SelectOption[]>([]);

  const { isLoading, error } = useQuery<Reservation | null>(
    ["reservation", id, assessmentChanged],
    () => getSingleReservation(id || ""),
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
      retry: 1,
      onSuccess: (boatData) => {
        if (boatData) {
          setReservationAllData(boatData);
          if (boatData.assessment) {
            setAssessmentValue(boatData.assessment.value);
            setAssessmentText(boatData.assessment.text);
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

  // useEffect(() => {
  //   if (reservationAllData) {
  //     const dataControl = reservationAllData;
  //     const newOptions = dataControl.scripts;
  //     const reloadedItems = [{ label: "Roteiros", value: "" }];
  //     newOptions?.forEach((item: string) => {
  //       reloadedItems.push({ label: item, value: item });
  //     });
  //     setOptionsSelect(reloadedItems);
  //     setReservationAllData(dataControl);
  //   }
  // }, [reservationAllData]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  // useEffect(() => {
  //   const savedFormData = sessionStorage.getItem("solicitacaoPendencia");
  //   if (savedFormData) {
  //     const userFromData = JSON.parse(savedFormData);
  //     formik.setValues({
  //       name: userFromData.name,
  //       email: userFromData.email,
  //       phone: userFromData.phone,
  //       quantity: userFromData.quantity,
  //       dataTour: userFromData.dataTour,
  //       data: new Date().toLocaleDateString(),
  //       script: userFromData.script,
  //       acceptedTerms: userFromData.acceptedTerms,
  //     });
  //     sessionStorage.removeItem("solicitacaoPendencia");
  //   }
  // }, []);

  if (error) {
    console.log("Erro get-edit ", error);
  }

  const handleVerificDate = () => {
    if (!reservationAllData?.dataTour) return false;
    const today = new Date().toLocaleDateString("pt-BR");
    const tripDay = new Date(reservationAllData.dataTour).toDateString();
    if (reservationAllData) {
      if (today >= tripDay) {
        return true;
      } else return false;
    }
  };

  useEffect(() => {
    const today = new Date(); // Pega a data de hoje
    const twoDaysLater = new Date(today); // Cria uma nova data baseada em hoje
    twoDaysLater.setDate(today.getDate() + 1); // Adiciona 2 dias à data atual

    // Formata a data para AAAA-MM-DD
    const year = twoDaysLater.getFullYear();
    const month = (twoDaysLater.getMonth() + 1).toString().padStart(2, "0"); // Mês é 0-indexado, então +1
    const day = twoDaysLater.getDate().toString().padStart(2, "0");

    const formattedMinDate = `${day}/${month}/${year}`;
    setMinDate(formattedMinDate); // Atualiza o estado com a data mínima
  }, []);

  const handleEditAssessment = async () => {
    setLoading(true);
    setErrorAssessment(false);
    try {
      if (id && reservationAllData) {
        if (assessmentValue === 0) {
          setErrorAssessment(true);
          setLoading(false);
          return;
        } else {
          const dataToSend: RatingData = {
            id: id,
            boatId: reservationAllData.boatId,
            data: {
              value: assessmentValue,
              text: assessmentText,
              userName: reservationAllData.name,
              date: new Date().toLocaleDateString("pt-BR"),
            },
          };
          await assessmentTrip(dataToSend);
          setAssessmentChanged(!assessmentChanged);
        }
      } else setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  // const handleGenerationPayment = async () => {
  //   setLoading(true);
  //   try {
  //     if (id && reservationAllData) {
  //       const amountWithDot = reservationAllData.price.replace(",", ".");

  //       // 2. Converte para um número decimal (float)
  //       const amountFloat = parseFloat(amountWithDot);

  //       // 3. Multiplica por 100 e arredonda para um número inteiro
  //       const amountInCents = Math.round(amountFloat * 100);

  //       const itemToBuy = {
  //         name: `Reserva ${reservationAllData.name} - ${reservationAllData.boatName}`,
  //         amount: amountInCents,
  //       };
  //       // await handlePaymentLink(itemToBuy, id);
  //       await handleCapturePayment(itemToBuy, id);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   setLoading(false);
  // };

  // const handleReceivePayment = async () => {
  //   setLoading(true);
  //   try {
  //     if (reservationAllData && reservationAllData.paymentIntentId && id) {
  //       await receivePaymentReservation(reservationAllData.paymentIntentId, id);

  //       setOpenAlert(true);
  //       setAlertMessage("Pagamento recebido com sucesso!");
  //       setAlertType("success");
  //     }
  //   } catch (e) {
  //     console.log(e);
  //     setOpenAlert(false);
  //     setAlertMessage("Erro ao receber pagamento.");
  //     setAlertType("error");
  //   }
  //   setLoading(false);
  // };

  // const handleCancelPayment = async () => {
  //   setLoading(true);
  //   try {
  //     if (reservationAllData && reservationAllData.paymentIntentId && id) {
  //       await cancelPaymentReservation(reservationAllData.paymentIntentId, id);

  //       setOpenAlert(true);
  //       setAlertMessage("Pagamento cancelado com sucesso!");
  //       setAlertType("success");
  //     }
  //   } catch (e) {
  //     console.log(e);
  //     setOpenAlert(false);
  //     setAlertMessage("Erro ao cancelar pagamento.");
  //     setAlertType("error");
  //   }
  //   setLoading(false);
  // };

  const handlePenaltyPayment = async () => {
    setLoading(true);
    setOpenEditValueReceive(false);
    {
      /*
      customerId: string;
  paymentMethodId: string;
  amount: number;
  description: string;
       */
    }
    try {
      if (
        reservationAllData &&
        reservationAllData.paymentMethod &&
        valueReceive
      ) {
        const amountWithDot = valueReceive.replace(",", ".");

        // 2. Converte para um número decimal (float)
        const amountFloat = parseFloat(amountWithDot);

        // 3. Multiplica por 100 e arredonda para um número inteiro
        const amountInCents = Math.round(amountFloat * 100);

        const itemToPay = {
          customerId: reservationAllData.paymentMethod.customerId,
          paymentMethodId: reservationAllData.paymentMethod.paymentMethodId,
          amount: amountInCents,
          description: `Penalidade de cancelamento - Reserva ${reservationAllData.name} - ${reservationAllData.boatName}`,
        };
        console.log("enviando para rota ", itemToPay);
        // await handlePaymentLink(itemToPay, id);
        const response = await receivePenaltyReservation(
          reservationAllData.paymentMethod.customerId,
          reservationAllData.paymentMethod.paymentMethodId,
          amountInCents,
          `Penalidade de cancelamento - Reserva ${reservationAllData.name} - ${reservationAllData.boatName}`
        );
        console.log("response ", response);
        setAlertMessage("Multa cobrada com sucesso!");
        setAlertType("success");
        setOpenAlert(true);
      }
    } catch (e) {
      console.log(e);
      setAlertMessage("Erro ao cobrar multa.");
      setAlertType("error");
      setOpenAlert(true);
    }
    setLoading(false);
  };

  return (
    <>
      {reservationAllData &&
        handleVerificDate() &&
        ((dataUser &&
          reservationAllData.assessment &&
          dataUser.role !== "client") ||
          (dataUser && dataUser.role === "client")) && (
          <div className="p-4 w-[800px] max-w-9/10 border border-primary mt-10 rounded-2xl">
            <p className="text-primary text-[1em] font-semibold ">
              {!reservationAllData.assessment && dataUser.role === "client"
                ? "Avalie seu experiência"
                : reservationAllData.assessment && dataUser.role === "client"
                ? "Minha avaliação"
                : "Avaliação"}
            </p>
            <RatingStar
              value={assessmentValue}
              setValue={setAssessmentValue}
              disabled={reservationAllData.assessment ? true : false}
            />
            {errorAssessment && (
              <p className="text-red-500">Selecione o valor de sua avalição</p>
            )}
            <TextareaDefault
              name={"descricao"}
              onChange={(e) => setAssessmentText(e.target.value)}
              value={assessmentText}
              placeholder={"Descrição"}
              disabled={reservationAllData.assessment ? true : false}
            />
            {!reservationAllData.assessment && (
              <div className="w-full flex items-center justify-center">
                <ButtonDefault
                  action={() => handleEditAssessment()}
                  text={"Avaliar"}
                />
              </div>
            )}
          </div>
        )}
      <div className="p-4 w-[800px] max-w-9/10 border border-primary mt-5 rounded-2xl">
        {reservationAllData && (
          <div className="flex flex-col gap-4 w-full ">
            <div className="flex items-center gap-3">
              {dataUser?.role === "admin" && (
                <div>
                  <FaRegEdit
                    className="cursor-pointer text-primary text-2xl"
                    onClick={() =>
                      navigate(
                        `/editando-reserva/${id}/${reservationAllData.boatId}`
                      )
                    }
                  />
                </div>
              )}
              <p className="text-primary text-[1em] font-semibold ">
                Reservado por:
              </p>
              <p className="text-primary text[1em]">
                {reservationAllData.name}
              </p>
            </div>
            <DividerComponent />
            <div className="flex items-center gap-3">
              <p className="text-primary text-[1em] font-medium ">
                Data da reserva:
              </p>
              <p className="text-primary text[1em]">
                {reservationAllData.data}
              </p>
            </div>
            <DividerComponent />
            <div className="flex items-center gap-3">
              <p className="text-primary text-[1em] font-medium ">
                Data do passeio:
              </p>
              <p className="text-primary text[1em]">
                {reservationAllData.dataTour}
              </p>
            </div>
            <DividerComponent />
            <div className="flex items-center gap-3">
              <p className="text-primary text-[1em] font-medium ">Barco:</p>
              <p className="text-primary text[1em]">
                {reservationAllData.boatName}
              </p>
            </div>
            <DividerComponent />
            <div className="flex items-center gap-3">
              <p className="text-primary text-[1em] font-medium ">
                Quantidade:
              </p>
              <p className="text-primary text[1em]">
                {reservationAllData.quantity} pessoas
              </p>
            </div>
            <DividerComponent />
            <div className="flex items-center gap-3">
              <p className="text-primary text-[1em] font-medium ">Roteiro:</p>
              <p className="text-primary text[1em]">
                {reservationAllData.script}
              </p>
            </div>
            <DividerComponent />
            <div className="flex items-center gap-3">
              <p className="text-primary text-[1em] font-medium ">Valor:</p>
              <p className="text-primary text[1em]">
                R${reservationAllData.price}
              </p>
            </div>
            {/* <DividerComponent />
            <div className="flex items-center gap-3">
              <p className="text-primary text-[1em] font-medium ">Pago:</p>
              <p className="text-primary text[1em] flex items-center gap-2">
                {reservationAllData.paid ? "Sim" : "Não"}
                <p
                  className="text-blue-500 cursor-pointer"
                  onClick={() => handleGenerationPayment()}
                >
                  Clique aqui para pagar
                </p>
                {!reservationAllData.paid &&
                  reservationAllData.status === "aproved" &&
                  dataUser &&
                  dataUser.role === "client" && (
                    <p
                      className="text-blue-500 cursor-pointer"
                      onClick={() => handleGenerationPayment()}
                    >
                      Clique aqui para pagar
                    </p>
                  )}
                {reservationAllData.paid &&
                  dataUser &&
                  dataUser.role === "admin" &&
                  reservationAllData.status === "aproved" && (
                    <p
                      className="text-blue-500 cursor-pointer"
                      onClick={() => handleReceivePayment()}
                    >
                      Receber valor
                    </p>
                  )}
                {reservationAllData.paid &&
                  dataUser &&
                  dataUser.role === "admin" &&
                  reservationAllData.status === "aproved" && (
                    <p
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleCancelPayment()}
                    >
                      Cancelar Pagamento
                    </p>
                  )}
              </p>
            </div> */}
            <DividerComponent />
            <div className="flex items-center gap-3">
              <p className="text-primary text-[1em] font-medium ">Status:</p>
              <p className="text-primary text[1em]">
                {reservationAllData.status === "requested"
                  ? "Solicitado - Aguardando aprovação do dono da embarcação"
                  : reservationAllData.status === "aproved"
                  ? "Aprovado - Reserva aprovada pelo dono da embarcação"
                  : reservationAllData.status === "rejected"
                  ? "Recusado - Reserva recusada pelo dono da embarcação"
                  : reservationAllData.status === "finished"
                  ? "Finalizado - O passeio ja foi realizado"
                  : reservationAllData.status === "canceled"
                  ? "Cancelado"
                  : ""}
              </p>
            </div>
            <DividerComponent />
            <div className="flex items-center gap-3">
              <p className="text-primary text-[1em] font-medium ">Embarque:</p>
              <p className="text-primary text[1em]">
                {reservationAllData.boarding} ás{" "}
                {reservationAllData.boardingTime}
              </p>
            </div>
            <DividerComponent />
            <div className="flex items-center gap-3">
              <p className="text-primary text-[1em] font-medium ">Duração:</p>
              <p className="text-primary text[1em]">
                {reservationAllData.duration}
              </p>
            </div>
            {/* {reservationAllData.paymentLink && (
              <>
                <DividerComponent />
                <div className="flex items-center gap-3">
                  <p className="text-primary text-[1em] font-medium ">
                    Link de pagamento:
                  </p>
                  <p className="text-primary text[1em]">
                    <a
                      href={reservationAllData.paymentLink}
                      rel="noopener noreferrer"
                    >
                      Clique aqui para pagar
                    </a>
                  </p>
                </div>
              </>
            )} */}
            {dataUser && dataUser.role === "admin" && (
              <>
                <DividerComponent />
                <div className="flex items-center gap-3">
                  <p className="text-primary text-[1em] font-medium ">Whats:</p>
                  <a
                    className="border border-primary p-2 rounded-2xl cursor-pointer "
                    href={`https://wa.me/${reservationAllData.phone}`}
                    target="_blank"
                  >
                    <p className="text-primary flex items-center gap-2">
                      Conversar{" "}
                      <FaWhatsapp className="text-2xl text-green-500" />
                    </p>
                  </a>
                </div>
                {reservationAllData.paymentMethod && (
                  <>
                    <DividerComponent />
                    <div className="flex items-center gap-3">
                      <p className="text-primary text-[1em] font-medium ">
                        Cobrar multa:
                      </p>
                      <ButtonDefault
                        action={() =>
                          setOpenEditValueReceive(!openEditValueReceive)
                        }
                        text={"Cobrar"}
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
        {loading && <LoadingDefault />}
        {openAlert && (
          <AlertNotification
            open={openAlert}
            setOpen={setOpenAlert}
            message={alertMessage}
            type={alertType}
          />
        )}
      </div>
      {reservationAllData && minDate < reservationAllData.dataTour && (
        <a
          className="mt-5 border border-primary p-2 rounded-2xl cursor-pointer "
          href={`https://wa.me/${
            import.meta.env.VITE_WHATSNUMBER
          }?text=Olá gostaria de alterar/cancelar minha reserva ${id}`}
          target="_blank"
        >
          <p className="text-red-500 flex items-center gap-2">
            Alterar data ou cancelar reserva{" "}
            <FaWhatsapp className="text-2xl text-green-500" />
          </p>
        </a>
      )}
      <Dialog
        open={openEditValueReceive}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Insira o valor a receber com multa
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Por favor, insira o valor que deseja receber, incluindo a multa.
          </DialogContentText>
          <InputDefault
            name="valueToReceive"
            value={valueReceive}
            onChange={(e) => setValueReceive(e.target.value)}
            placeholder="Valor a receber"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditValueReceive(false)}>
            Cancelar
          </Button>
          <Button onClick={() => handlePenaltyPayment()}>Cobrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DetailMyReservation;
