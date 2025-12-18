import { useUserData } from "../components/ContextData";
import { useMemo, useState } from "react";
import ButtonDefault from "../components/ButtonDefault";
import InputDefault from "../components/InputDefault";
import { useFormik } from "formik";
import * as yup from "yup";
import LoadingDefault from "../components/LoadingDefault";
import { getAuth, sendEmailVerification, updateEmail } from "firebase/auth";

const Profile = () => {
  const { dataUser } = useUserData();
  // console.log("user ", dataUser);

  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      whats: "",
      // level: "",
      pixKey: "",
      active: true,
    },
    validationSchema: yup.object({
      name: yup.string().required("O nome é obrigatório."),
      email: yup.string().required("O email é obrigatório."),
      phone: yup.string().required("O telefone é obrigatório."),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (auth.currentUser) {
          // await updateEmail(auth.currentUser, values.email).then(async () => {
          //   await sendEmailVerification(values.email);
          // });
          await updateEmail(auth.currentUser, values.email);
          // Corrected argument for sendEmailVerification
          await sendEmailVerification(auth.currentUser);
        } else {
          console.warn(
            "Nenhum usuário logado encontrado para atualizar o email."
          );
        }
      } catch (e) {
        console.log("erro editando ", e);
      }
      setLoading(false);
    },
  });

  useMemo(() => {
    if (dataUser) {
      formik.setValues({
        name: dataUser.name,
        email: dataUser.email,
        phone: dataUser.phone,
        // level: dataUser.level ? dataUser.level : "basic",
        whats: dataUser.whats ? dataUser.whats : "",
        pixKey: dataUser.pixKey ? dataUser.pixKey : "",
        active: dataUser.active ? dataUser.active : true,
      });
    }
  }, [dataUser]);

  return (
    <>
      <h1 className="text-primary mt-10">Meu perfil</h1>
      <h3 className="text-primary mt-4">Aqui você pode gerenciar seus dados</h3>
      <div className="flex flex-col w-full items-center mt-8">
        <form
          className="flex flex-col gap-4 w-full"
          onSubmit={formik.handleSubmit}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                placeholder={"Whatsapp"}
                required={true}
                type={"tel"}
                name={"whats"}
                value={formik.values.whats}
                onChange={formik.handleChange}
                pattern={"[0-9]{2}[0-9]{5}[0-9]{4}"}
                title={"Formato: 12345678901"}
              />
              {formik.touched.whats && formik.errors.whats ? (
                <p className="text-red-500 text-sm">{formik.errors.whats}</p>
              ) : null}
            </div>
            <div>
              <InputDefault
                placeholder={"Chave Pix"}
                required={true}
                name={"pixKey"}
                value={formik.values.pixKey}
                onChange={formik.handleChange}
              />
              {formik.touched.pixKey && formik.errors.pixKey ? (
                <p className="text-red-500 text-sm">{formik.errors.pixKey}</p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col w-full items-center">
            <ButtonDefault text={"Salvar"} type={"submit"} />
          </div>
        </form>
      </div>
      {loading && <LoadingDefault />}
    </>
  );
};

export default Profile;
