import { useQuery } from "react-query";
import { getMyReservations } from "../services/Routes";
import { useUserData } from "../components/ContextData";
import LoadingDefault from "../components/LoadingDefault";
import { useEffect, useState } from "react";
import type { Reservation } from "../components/TypesUse";
import * as React from "react";
import CardViewReservations from "../components/CardViewReservations";
import { MdOutlineVerticalAlignBottom } from "react-icons/md";
import { MdOutlineVerticalAlignTop } from "react-icons/md";

type ReservationProps = Reservation & {
  // Você pode adicionar outras props se o componente precisar
  id: string;
  // onClick?: () => void;
};

const MyReservations: React.FC = () => {
  const { dataUser } = useUserData();
  const [descendigOrder, setDescendingOrder] = useState(true);
  const [reservationsData, setReservationsData] = useState<
    ReservationProps[] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading } = useQuery(
    ["data", dataUser],
    async () => {
      if (!dataUser) {
        return null;
      }
      const response = await getMyReservations({
        id: dataUser.userId,
        role: dataUser.role,
      });
      if (response && response.data) {
        const sortedDescending = [...response.data].sort((a, b) => {
          const dateA = parseDate(a.data);
          const dateB = parseDate(b.data);

          // Inverte a ordem da comparação para obter uma ordenação decrescente
          return dateB.getTime() - dateA.getTime();
        });

        setReservationsData(sortedDescending);
      }
    },
    { refetchOnWindowFocus: false }
  );

  const parseDate = (dateString: string) => {
    const [day, month, year] = dateString.split("/").map(Number);
    // Cria um objeto Date usando o formato YYYY-MM-DD para evitar problemas
    return new Date(year, month - 1, day);
  };

  useEffect(() => {
    if (descendigOrder && reservationsData) {
      const sorted = [...reservationsData].sort((a, b) => {
        const dateA = parseDate(a.data);
        const dateB = parseDate(b.data);
        return dateB.getTime() - dateA.getTime();
      });
      setReservationsData(sorted);
    } else if (reservationsData) {
      const sorted = [...reservationsData].sort((a, b) => {
        const dateA = parseDate(a.data);
        const dateB = parseDate(b.data);
        return dateA.getTime() - dateB.getTime();
      });
      setReservationsData(sorted);
    }
  }, [descendigOrder]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  return (
    <div className="w-full flex flex-col items-center w-full mx-auto pb-4 mt-2">
      <p className="text-primary text-[2em] lg:text-[3em]">Minhas reservas</p>
      <p className="text-primary mt-2 text-[.9em] lg:text-[1.2em]">
        Aqui você pode ver suas reservas.
      </p>
      <div className="w-full flex justify-end max-w-90 lg:max-w-7xl px-4 mt-4">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setDescendingOrder(!descendigOrder)}
        >
          {descendigOrder ? (
            <>
              <MdOutlineVerticalAlignTop
                size={20}
                className="text-primary text-[.9em] lg:text-[1.2em]"
              />
              <p className="text-primary text-[.9em] lg:text-[1.2em]">
                Mais antigas
              </p>
            </>
          ) : (
            <>
              <MdOutlineVerticalAlignBottom
                size={20}
                className="text-primary text-[.9em] lg:text-[1.2em]"
              />
              <p className="text-primary text-[.9em] lg:text-[1.2em]">
                Mais recentes
              </p>
            </>
          )}
        </div>
      </div>
      {reservationsData && (
        <div className="flex flex-col gap-6 justify-center items-center mt-4 w-full">
          {reservationsData.map((data, i) => (
            <CardViewReservations
              key={i}
              boatId={data.boatId}
              quantity={data.quantity}
              data={data.data}
              dataTour={data.dataTour}
              imgBoat={data.imgBoat}
              price={data.price}
              paid={data.paid}
              boatName={data.boatName}
              id={data.id}
              status={data.status}
            />
          ))}
        </div>
      )}
      {loading && <LoadingDefault />}
    </div>
  );
};

export default MyReservations;
