import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import NewAccount from "./pages/NewAccount.tsx";
import DefaultLayout from "./components/DefaultLayout.tsx";
import Login from "./pages/Login.tsx";
import { useEffect } from "react";
import { useUserData } from "./components/ContextData.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import MyBoats from "./pages/MyBoats.tsx";
import NewBoat from "./pages/NewBoat.tsx";
import EditBoat from "./pages/EditBoat.tsx";
import AllBoats from "./pages/AllBoats.tsx";
import DetailBoat from "./pages/DetailBoat.tsx";
import MyReservations from "./pages/MyReservations.tsx";
import DetailMyReservation from "./pages/DetailMyReservation.tsx";
import LoadingDefault from "./components/LoadingDefault.tsx";
import ForgetPassword from "./pages/ForgetPassword.tsx";
import Profile from "./pages/Profile.tsx";
import Boats from "./pages/Boats.tsx";
import Reservations from "./pages/Reservations.tsx";
import EditReservation from "./pages/EditReservation.tsx";
import ConfirmPayment from "./pages/ConfirmPayment.tsx";
import Users from "./pages/Users.tsx";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import TermsOfUse from "./pages/TermsOfUse.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "cadastro/:typeUser",
        element: <NewAccount />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "esqueci-minha-senha",
        element: <ForgetPassword />,
      },
      {
        path: "embarcacoes",
        element: <AllBoats />,
      },
      {
        path: "detalhes-barco/:id",
        element: <DetailBoat />,
      },
      {
        path: "termos-de-uso",
        element: <TermsOfUse />,
      },
      {
        path: "meus-barcos",
        element: <ProtectedRoute allowedRoles={["advertiser"]} />,
        children: [
          {
            index: true,
            element: <MyBoats />,
          },
        ],
      },
      {
        path: "novo-barco",
        element: <ProtectedRoute allowedRoles={["advertiser"]} />,
        children: [
          {
            index: true,
            element: <NewBoat />,
          },
        ],
      },
      {
        path: "perfil",
        element: <ProtectedRoute allowedRoles={["advertiser"]} />,
        children: [
          {
            index: true,
            element: <Profile />,
          },
        ],
      },
      {
        path: "editando-barco/:id",
        element: <ProtectedRoute allowedRoles={["advertiser", "admin"]} />,
        children: [
          {
            index: true,
            element: <EditBoat />,
          },
        ],
      },
      {
        path: "minhas-reservas",
        element: <ProtectedRoute allowedRoles={["client", "advertiser"]} />,
        children: [
          {
            index: true,
            element: <MyReservations />,
          },
        ],
      },
      {
        path: "minha-reserva/:id",
        element: (
          <ProtectedRoute allowedRoles={["client", "advertiser", "admin"]} />
        ),
        children: [
          {
            index: true,
            element: <DetailMyReservation />,
          },
        ],
      },
      {
        path: "confirmacao-pagamento/:id",
        element: <ProtectedRoute allowedRoles={["client"]} />,
        children: [
          {
            index: true,
            element: <ConfirmPayment />,
          },
        ],
      },
      {
        path: "usuarios",
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          {
            index: true,
            element: <Users />,
          },
        ],
      },
      {
        path: "barcos",
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          {
            index: true,
            element: <Boats />,
          },
        ],
      },
      {
        path: "reservas",
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          {
            index: true,
            element: <Reservations />,
          },
        ],
      },
      {
        path: "editando-reserva/:id/:boatId",
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          {
            index: true,
            element: <EditReservation />,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  const checkLogin = useUserData((state) => state.checkLogin);
  const isLoadingData = useUserData((state) => state.isLoadingData);
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  if (isLoadingData) {
    return <LoadingDefault />;
  }

  return (
    <Elements stripe={stripePromise}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Elements>
  );
};

export default App;
