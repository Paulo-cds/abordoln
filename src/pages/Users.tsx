import { useNavigate } from "react-router-dom";
import ButtonDefault from "../components/ButtonDefault";
import { useQuery } from "react-query";
import { getUsers, manageUserStatus } from "../services/Routes";
import { useUserData } from "../components/ContextData";
import LoadingDefault from "../components/LoadingDefault";
// import CardViewBoat from "../components/CardViewBoat";
import { useEffect, useState } from "react";
import type { User } from "../components/TypesUse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import SelectDefault from "../components/SelectDefault";
import InputDefault from "../components/InputDefault";
import { FaPowerOff } from "react-icons/fa6";
import AlertDeleteItem from "../components/AlertDeleteItem";

const Users: React.FC = () => {
  const { dataUser } = useUserData();
  const [usersData, setUsersData] = useState<User[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterType, setFilterType] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [nameFilter, setNameFilter] = useState<string>("");
  const [userEditStatus, setUserEditStatus] = useState<User | null>(null);
  const [openAlertStatus, setOpenAlertStatus] = useState<boolean>(false);

  const { isLoading } = useQuery(
    ["data", dataUser],
    () =>
      getUsers().then((data) => {
        if (data) {
          setUsersData(data.data);
        }
      }),
    { refetchOnWindowFocus: false }
  );
  const navigate = useNavigate();

  const typesOptions = [
    { value: "all", label: "Todos" },
    { value: "client", label: "Clientes" },
    { value: "advertiser", label: "Anunciantes" },
  ];

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeFilter = (type: string) => {
    setLoading(true);
    setFilterType(type);
    setUsersData(null);
    if (type === "all") {
      // Fetch all users
      getUsers().then((data) => {
        if (data) {
          setUsersData(data.data);
        }
      });
    } else {
      // Fetch users by type
      getUsers().then((data) => {
        if (data) {
          const filtered = data.data.filter((user: User) => user.role === type);
          setUsersData(filtered);
        }
      });
    }
    setLoading(false);
    setPage(0);
  };

  const handleChangeNameFilter = (name: string) => {
    setLoading(true);
    setNameFilter(name);
    setUsersData(null);
    getUsers().then((data) => {
      if (data) {
        const filtered = data.data.filter((user: User) =>
          user.name.toLowerCase().includes(name.toLowerCase())
        );
        setUsersData(filtered);
      }
    });
    setLoading(false);
    setPage(0);
  };

  const handleChangeStatusFilter = (status: string) => {
    setLoading(true);
    setUsersData(null);
    setStatusFilter(status);
    if (status === "all") {
      // Fetch all users
      getUsers().then((data) => {
        if (data) {
          setUsersData(data.data);
        }
      });
    } else if (status === "active") {
      // Fetch active users
      getUsers().then((data) => {
        if (data) {
          const filtered = data.data.filter(
            (user: User) => user.active === true
          );
          setUsersData(filtered);
        }
      });
    } else if (status === "inactive") {
      // Fetch inactive users
      getUsers().then((data) => {
        if (data) {
          const filtered = data.data.filter(
            (user: User) => user.active === false || user.active === undefined
          );
          setUsersData(filtered);
        }
      });
    }
    setLoading(false);
    setPage(0);
  };

  const handleChangeStatusUser = async () => {
    setLoading(true);
    if (userEditStatus) {
      const updatedUser = {
        ...userEditStatus,
        active: userEditStatus.active ? !userEditStatus.active : true,
      };
      await manageUserStatus(updatedUser);
      getUsers().then((data) => {
        if (data) {
          setUsersData(data.data);
        }
      });
    }
    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col items-center w-full mx-auto pb-4 mt-2">
      <h1 className="text-primary">Usuários</h1>
      <h3 className="text-primary mt-4">
        Aqui você pode gerenciar todos os usuários cadastrados.
      </h3>
      <div className="w-50 max-w-90 mt-8 ">
        <ButtonDefault
          text={"Adicionar Usuário"}
          action={() => navigate("/novo-usuario")}
        />
      </div>
      <div className=" w-full mt-8">
        <div className="flex gap-4 items-center mb-4">
          <div className="flex items-center max-w-90">
            <label className="text-primary mr-4">Filtrar por tipo:</label>
            <SelectDefault
              value={filterType}
              onChange={(e) => handleChangeFilter(e.target.value)}
              options={typesOptions}
              name="type"
            />
          </div>
          <div className="flex items-center max-w-90">
            <label className="text-primary mr-4">Filtrar por status:</label>
            <SelectDefault
              value={statusFilter}
              onChange={(e) => handleChangeStatusFilter(e.target.value)}
              options={[
                { value: "all", label: "Todos" },
                { value: "active", label: "Ativos" },
                { value: "inactive", label: "Inativos" },
              ]}
              name="status"
            />
          </div>
          <div className="flex items-center max-w-90">
            <label className="text-primary mr-4">Filtrar por nome:</label>
            <InputDefault
              type="text"
              name="name"
              value={nameFilter}
              onChange={(e) => handleChangeNameFilter(e.target.value)}
            />
          </div>
        </div>
        {usersData && (
          <Paper>
            <TableContainer>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Nome</TableCell>
                    <TableCell align="left">Email</TableCell>
                    <TableCell align="left">Telefone</TableCell>
                    <TableCell align="left">Tipo</TableCell>
                    <TableCell align="left">Ativo</TableCell>
                    <TableCell align="left"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usersData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="left">{row.email}</TableCell>
                        <TableCell align="left">{row.phone}</TableCell>
                        <TableCell align="left">
                          {row.role === "client" ? "Cliente" : "Anunciante"}
                        </TableCell>
                        <TableCell align="left">
                          {row.active ? "Sim" : "Não"}
                        </TableCell>
                        <TableCell align="left">
                          <FaPowerOff
                            className={`${
                              row.active ? "text-red-500 " : "text-green-500"
                            } cursor-pointer`}
                            onClick={() => {
                              setUserEditStatus(row);
                              setOpenAlertStatus(true);
                            }}
                            size={20}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={usersData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}
      </div>
      {loading && <LoadingDefault />}
      {openAlertStatus && (
        <AlertDeleteItem
          text="Tem certeza que deseja alterar o status desse usuário?"
          buttonText="Alterar"
          action={() => handleChangeStatusUser()}
          setOpen={setOpenAlertStatus}
        />
      )}
    </div>
  );
};

export default Users;
