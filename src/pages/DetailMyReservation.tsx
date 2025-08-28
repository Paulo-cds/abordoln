import { useEffect, useState } from "react";
import ButtonDefault from "../components/ButtonDefault";
import { TextareaDefault } from "../components/InputDefault";
import LoadingDefault from "../components/LoadingDefault";
import {
  assessmentTrip,
  getSingleReservation,
  type RatingData,
} from "../services/Routes";
import { type Reservation } from "../components/TypesUse";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import DividerComponent from "../components/DividerComponent";
import RatingStar from "../components/RatingStar";
import AlertNotification from "../components/AlertNotification";
import { FaWhatsapp } from "react-icons/fa";
import { useUserData } from "../components/ContextData";
import { FaRegEdit } from "react-icons/fa";

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
  const [assessmentValue, setAssessmentValue] = useState(0);
  const [assessmentText, setAssessmentText] = useState("");
  const [minDate, setMinDate] = useState("");
  console.log("reservationAllData ", reservationAllData);
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

  useEffect(() => {
    if (reservationAllData) {
      const dataControl = reservationAllData;
      const newOptions = dataControl.scripts;
      const reloadedItems = [{ label: "Roteiros", value: "" }];
      newOptions?.forEach((item) => {
        reloadedItems.push({ label: item, value: item });
      });
      dataControl.scripts = reloadedItems;
      setReservationAllData(dataControl);
    }
  }, [reservationAllData]);

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
      });
      sessionStorage.removeItem("solicitacaoPendencia");
    }
  }, []);

  if (error) {
    console.log("Erro get-edit ", error);
  }

  const handleVerificDate = () => {
    const today = new Date().toLocaleDateString("pt-BR");
    // const tripDay = new Date(reservationAllData.dataTour).toDateString();
    if (today >= reservationAllData.dataTour) {
      return true;
    } else return false;
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
  
  return (
    <>
      {reservationAllData &&
        handleVerificDate() &&
        ((dataUser &&
          reservationAllData.assessment &&
          dataUser.role !== "client") ||
          dataUser.role === "client") && (
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
            <DividerComponent />
            <div className="flex items-center gap-3">
              <p className="text-primary text-[1em] font-medium ">Pago:</p>
              <p className="text-primary text[1em]">
                {reservationAllData.paid ? "Sim" : "Não"}
              </p>
            </div>
            <DividerComponent />
            <div className="flex items-center gap-3">
              <p className="text-primary text-[1em] font-medium ">Status:</p>
              <p className="text-primary text[1em]">
                {reservationAllData.status === "requested"
                  ? "Solicitado - Aguardando aprovação do dono da embarcação"
                  : reservationAllData.status === "aproved"
                  ? "Aprovado - Reserva aprovada pelo dono da embarcação"
                  : reservationAllData.status === "finished"
                  ? "Fanalizado - O passeio ja foi realizado"
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
            {
              reservationAllData.paymentLink &&
              <>
                <DividerComponent />
            <div className="flex items-center gap-3">
              <p className="text-primary text-[1em] font-medium ">
                Link de pagamento:
              </p>
              <p className="text-primary text[1em]">
                <a href={reservationAllData.paymentLink} rel="noopener noreferrer">
                  Clique aqui para pagar
                </a>
                {/* {reservationAllData.dataTour} */}
              </p>
            </div>
              </>
            }
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
    </>
  );
};

export default DetailMyReservation;
