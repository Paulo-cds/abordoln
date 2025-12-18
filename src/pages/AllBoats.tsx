import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getAllBoats } from "../services/Routes";
import { useUserData } from "../components/ContextData";
import LoadingDefault from "../components/LoadingDefault";
import CardViewBoat from "../components/CardViewBoat";
import { useEffect, useState } from "react";
import { citiesOfBoats, typesOfBoats, type Boat } from "../components/TypesUse";
import SelectDefault from "../components/SelectDefault";
import { LuFilter } from "react-icons/lu";
import { LuFilterX } from "react-icons/lu";

const AllBoats: React.FC = () => {
  const { dataUser } = useUserData();
  const urlParams = new URLSearchParams(window.location.search);
  const redirectUri = urlParams.get("city");
  const [boatsData, setBoatsData] = useState<Boat[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cityFilter, setCityFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [openFilter, setOpenFilter] = useState<boolean>(redirectUri ? true : false);
  const allSelectCity = [{ label: "Cidade", value: "" }, ...citiesOfBoats];
  const allSelectTypes = [{ label: "Tipo", value: "" }, ...typesOfBoats];
  const { data, isLoading } = useQuery(
    ["data", dataUser],
    () => getAllBoats(),
    { refetchOnWindowFocus: false }
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setBoatsData(data.data);
    }
  }, [data]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (redirectUri) {
      setCityFilter(redirectUri);
    }
  }, [redirectUri]);

  const filterBoat = (boat: Boat) => {
    if (boat && !boat.active) {
      return false;
    }
    if (cityFilter && typeFilter) {
      if (boat.city === cityFilter && boat.type === typeFilter) {
        return true;
      } else {
        return false;
      }
    }
    if (cityFilter) {
      if (boat.city === cityFilter) {
        return true;
      } else {
        return false;
      }
    }
    if (typeFilter) {
      if (boat.type === typeFilter) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  };

  const filterNameType = () => {
    const findItem = typesOfBoats.find((item) => item.value === typeFilter);
    if (findItem) {
      return findItem.label;
    }
  };

  const handleChangeOpenFilter = () => {
    setOpenFilter(!openFilter);
    if (openFilter) {
      setCityFilter("");
      setTypeFilter("");
    }
  };
 
  return (
    <div className="w-full flex flex-col items-center w-full mx-auto pb-4 mt-2">
      <h1 className="text-primary">Embarcações</h1>
      <div className="w-full flex items-center gap-2 lg:gap-5 mt-8 flex-wrap">
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => handleChangeOpenFilter()}
        >
          {!openFilter ? (
            <>
              <LuFilter className="text-primary text-[30px]" />
              <p className="text-primary font-2xl">Filtros</p>
            </>
          ) : (
            <>
              <LuFilterX className="text-primary text-[30px]" />
              <p className="text-primary font-2xl">Limpar</p>
            </>
          )}
        </div>
        {openFilter && (
          <>
            <div>
              <p className="text-primary">Cidade:</p>
              <SelectDefault
                options={allSelectCity}
                name={"Cidade"}
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              />
            </div>
            <div>
              <p className="text-primary">Tipo:</p>
              <SelectDefault
                options={allSelectTypes}
                name={"Tipo"}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              />
            </div>
          </>
        )}
      </div>
      {boatsData && (
        <h2 className="text-primary mt-4">
          {typeFilter && filterNameType() + "s"}
          {cityFilter
            ? !typeFilter
              ? "Embarcações em " + cityFilter
              : " em " + cityFilter
            : ""}
        </h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full mt-8">
        {boatsData &&
          boatsData.map(
            (boat) =>
              filterBoat(boat) && (
                <div
                  key={boat.id}
                  className="flex items-center justify-center w-full"
                >
                  <CardViewBoat
                    name={boat.name}
                    type={boat.type}
                    price={boat.price}
                    images={boat.images}
                    capacity={boat.capacity}
                    active={boat.active}
                    id={boat.id}
                    action={() => navigate(`/detalhes-barco/${boat.id}`)}
                  />
                </div>
              )
          )}
      </div>

      {loading && <LoadingDefault />}
    </div>
  );
};

export default AllBoats;
