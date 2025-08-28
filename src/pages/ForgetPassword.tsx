import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import logo from "../assets/logo redondo.png";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import AlertBigItem from "../components/AlertBigItem";
import InputDefault from "../components/InputDefault";
import ButtonDefault from "../components/ButtonDefault";
import LoadingDefault from "../components/LoadingDefault";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [subMessage, setSubMessage] = useState("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: yup.object({
      email: yup.string().required("O email é obrigatório."),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await sendPasswordResetEmail(auth, values.email);
        setOpenAlert(true);
        setAlertMessage("Um email foi enviado.");
        setSubMessage("Siga as orientações para alterar sua senha.");
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
        Preencha seu email para alterar sua senha.
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
          <ButtonDefault text={"Enviar"} type={"submit"} />
        </form>
      </div>
      {loading && <LoadingDefault />}
      {openAlert && (
        <AlertBigItem
          text={alertMessage}
          setOpen={setOpenAlert}
          action={() => navigate("/login")}
          subText={subMessage}
        />
      )}
    </div>
  );
};

export default ForgetPassword;
