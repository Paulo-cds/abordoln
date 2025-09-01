import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingDefault from "../components/LoadingDefault";
import logo from "../assets/logo redondo.png";
import { useQuery } from "react-query";
import { confirmPaymentReservation } from "../services/Routes";

const ConfirmPayment = () => {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [reservationCompleted, setReservationCompleted] = useState("");

  const { isLoading } = useQuery(
    ["boat", id],
    () => confirmPaymentReservation(id || ""),
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
      retry: 1,
      onSuccess: () => {
        setReservationCompleted("success");
      },
      onError: (err) => {
        console.error("Erro ao carregar os dados do barco:", err);
        setReservationCompleted("error");
      },
    }
  );

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  return (
    <div className="w-full flex flex-col items-center max-w-90 lg:max-w-7xl mx-auto pb-4 mt-2">
      <div className="relative w-40 h-40 lg:w-60 lg:h-60">
        <img src={logo} alt="A Bordo LN" />
      </div>
      {reservationCompleted === "success" && (
        <>
          <p className="text-primary text-4xl lg:text-7xl text-center ">
            Reserva finalizada!
          </p>
          <p className="text-primary mt-4 text-[12px] lg:text-1xl lg:text-[1.2em] text-center">
            Sua reserva foi confirmada com sucesso. No dia e horário agendados,
            por favor compareça ao local de embarque informado na reserva.
          </p>
        </>
      )}
      {reservationCompleted === "error" && (
        <>
          <p className="text-primary text-4xl lg:text-7xl text-center ">
            Erro ao finalizar a reserva.
          </p>
          <p className="text-primary mt-4 text-[12px] lg:text-1xl lg:text-[1.2em] text-center">
            Ocorreu um erro ao confirmar sua reserva. Por favor, atualize a página e se persistir o problema, entre em contato com o suporte.
          </p>
        </>
      )}
      {loading && <LoadingDefault />}
    </div>
  );
};

export default ConfirmPayment;
