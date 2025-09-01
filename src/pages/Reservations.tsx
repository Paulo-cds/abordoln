import { useQuery } from "react-query";
import { getAllReservations } from "../services/Routes";
import { useUserData } from "../components/ContextData";
import LoadingDefault from "../components/LoadingDefault";
import { useEffect, useState } from "react";
import type { Reservation } from "../components/TypesUse";
import * as React from "react";
import CardViewReservations from "../components/CardViewReservations";

type ReservationProps = Reservation & {
  // Você pode adicionar outras props se o componente precisar
  id: string;
  // onClick?: () => void;
};

const Reservations: React.FC = () => {
  const { dataUser } = useUserData();
  const [reservationsData, setReservationsData] = useState<
    ReservationProps[] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoading } = useQuery(
    ["data", dataUser],
    async () =>{
      if (!dataUser) {
        return null;
      }
      const response = await getAllReservations()
      if(response){
        setReservationsData(response.data)
      }
    },
    { refetchOnWindowFocus: false }
  );

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  return (
    <div className="w-full flex flex-col items-center w-full mx-auto pb-4 mt-2">
      <p className="text-primary text-[2em] lg:text-[3em]">Reservas</p>
      <p className="text-primary mt-2 text-[.9em] lg:text-[1.2em]">
        Aqui você pode ver todas as reservas.
      </p>
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
            />
          ))}
        </div>
      )}
      {loading && <LoadingDefault />}
    </div>
  );
};

export default Reservations;
