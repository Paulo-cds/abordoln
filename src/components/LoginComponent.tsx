import { useState } from "react";
import ButtonDefault from "./ButtonDefault";
import InputDefault from "./InputDefault";
import { useFormik } from "formik";
import * as yup from "yup";
import LoadingDefault from "./LoadingDefault";
import logo from "../assets/logo redondo.png";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AlertNotification from "./AlertNotification";
import { Link } from "react-router-dom";

interface LoginProps {
  action: () => void;
}

const LoginComponent: React.FC<LoginProps> = ({ action }) => {
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const urlParams = new URLSearchParams(window.location.search);
  const redirectUri = urlParams.get("redirect_uri");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().required("O email é obrigatório."),
      password: yup
        .string()
        .min(8, "A senha deve ter no mínimo 8 caracteres.")
        .required("A senha é obrigatória."),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password)
          .then(async () => {
            if (redirectUri) {
              window.location.href = decodeURIComponent(redirectUri); // Redireciona de volta
            } else {
              action();
            }
          })
          .catch((error) => {
            console.log("Erro ao logar: " + error);
            if (error.code === "auth/user-not-found") {
              setAlertMessage("Usuário não cadastrado!");
              setAlertType("error");
              setOpenAlert(true);
            } else {
              setAlertMessage("Email e/ou senha incorretos!");
              setAlertType("error");
              setOpenAlert(true);
            }
            setLoading(false);
          });
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    },
  });
  return (
    <div className="w-full flex flex-col items-center max-w-90 lg:max-w-7xl mx-auto pb-4 mt-2">
      <div className="relative w-40 h-40 lg:w-60 lg:h-60">
        <img src={logo} alt="A Bordo LN" />
      </div>
      <p className="text-primary text-4xl lg:text-7xl text-center ">
        Seja Bem-Vindo de volta!
      </p>
      <p className="text-primary mt-4 text-[12px] lg:text-1xl lg:text-[1.2em] text-center">
        Preencha seu email e senha para acessar sua conta ou crie uma nova conta
        se ainda não tiver uma.
      </p>
      <div className="w-full max-w-[400px] mt-8">
        <form
          className="flex flex-col gap-4 w-full"
          onSubmit={formik.handleSubmit}
        >
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
              <p className="text-red-500 text-sm">{formik.errors.email}</p>
            ) : null}
          </div>
          <div>
            <InputDefault
              type={"password"}
              placeholder={"Senha"}
              required={true}
              name={"password"}
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="text-red-500 text-sm">{formik.errors.password}</p>
            ) : null}
          </div>
          <ButtonDefault text={"Login"} type={"submit"} />
        </form>
        <div className="mt-3 flex flex-col items-center justify-center gap-2">
          <Link
            style={{ color: "#003366" }}
            to={
              !redirectUri
                ? "/cadastro/client"
                : `/cadastro/client?redirect_uri=${encodeURIComponent(
                    redirectUri
                  )}`
            }
          >
            Cadastre-se
          </Link>
          <Link style={{ color: "#003366" }} to={"/esqueci-minha-senha"}>
            Esqueci minha senha
          </Link>
        </div>
      </div>
      {loading && <LoadingDefault />}
      <AlertNotification
        open={openAlert}
        setOpen={setOpenAlert}
        message={alertMessage}
        type={alertType}
      />
    </div>
  );
};

export default LoginComponent;
