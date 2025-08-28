import { useState } from "react";
import ButtonDefault from "../components/ButtonDefault";
import InputDefault from "../components/InputDefault";
import { useFormik } from "formik";
import * as yup from "yup";
import LoadingDefault from "../components/LoadingDefault";
import logo from "../assets/logo redondo.png";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { manageAccount } from "../services/Routes";
import { useNavigate, useParams } from "react-router-dom";
import AlertNotification from "../components/AlertNotification";

const NewAccount = () => {
  const [loading, setLoading] = useState(false);
  const typeUser = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  const urlParams = new URLSearchParams(window.location.search);
  const redirectUri = urlParams.get("redirect_uri");
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      repeatPassword: "",
      role: typeUser.typeUser,
    },
    validationSchema: yup.object({
      name: yup.string().required("O nome é obrigatório."),
      email: yup.string().required("O email é obrigatório."),
      phone: yup.string().required("O telefone é obrigatório."),
      role: yup.string().required("O tipo de usuário é obrigatório."),
      password: yup
        .string()
        .min(8, "A senha deve ter no mínimo 8 caracteres.")
        .required("A senha é obrigatória."),
      repeatPassword: yup
        .string()
        .oneOf([yup.ref("password")], "As senhas não coincidem.")
        .required("Confirme sua senha."),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        const userCredential = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        const userId = userCredential.user.uid;
        const data = {
          name: values.name,
          email: values.email,
          phone: values.phone,
          role: values.role,
          userId: userId,
          active: true,
        };
        if (typeUser.typeUser === "advertiser") {
          data.level = "basic";
        }

        await manageAccount(data);

        if (auth.currentUser) {
          await sendEmailVerification(auth.currentUser);
        } else {
          console.warn(
            "Nenhum usuário logado encontrado para enviar verificação de e-mail. Isso pode indicar um problema."
          );
        }
        if (redirectUri) {
          window.location.href = decodeURIComponent(redirectUri);
        } else {
          navigate("/");
        }
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/email-already-in-use") {
          setAlertMessage("Email já cadastrado!");
          setAlertType("error");
          setOpenAlert(true);
        }
        console.log("error code ", errorCode);
        console.log("error message ", errorMessage);
      }
      setLoading(false);
    },
  });

  return (
    <>
      <div className="relative w-40 h-40 lg:w-60 lg:h-60">
        <img src={logo} alt="Github" />
      </div>
      <h1 className="text-primary">Seja Bem-Vindo!</h1>
      <h3 className="text-primary mt-4">
        Preencha seus dados para realizar seu cadastro
      </h3>
      <div className="w-full max-w-[400px] mt-8">
        <form
          className="flex flex-col gap-4 w-full"
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
              <p className="text-red-500 text-sm">{formik.errors.email}</p>
            ) : null}
          </div>
          <div>
            <InputDefault
              placeholder={"Telefone"}
              required={true}
              type={"tel"}
              name={"phone"}
              value={formik.values.phone}
              onChange={formik.handleChange}
              pattern={"[0-9]{2}[0-9]{5}[0-9]{4}"}
              title={"Formato: 12345678901"}
            />
            {formik.touched.phone && formik.errors.phone ? (
              <p className="text-red-500 text-sm">{formik.errors.phone}</p>
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
          <div>
            <InputDefault
              type={"password"}
              placeholder={"Repita sua Senha"}
              required={true}
              name={"repeatPassword"}
              value={formik.values.repeatPassword}
              onChange={formik.handleChange}
            />
            {formik.touched.repeatPassword && formik.errors.repeatPassword ? (
              <p className="text-red-500 text-sm">
                {formik.errors.repeatPassword}
              </p>
            ) : null}
          </div>
          <ButtonDefault text={"Cadastrar"} type={"submit"} />
        </form>
      </div>
      {loading && <LoadingDefault />}
      <AlertNotification
        open={openAlert}
        setOpen={setOpenAlert}
        message={alertMessage}
        type={alertType}
      />
    </>
  );
};

export default NewAccount;
