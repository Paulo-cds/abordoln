import { useEffect, useState } from "react";
import ButtonDefault from "../components/ButtonDefault";
import InputDefault from "../components/InputDefault";
import { useFormik } from "formik";
import * as yup from "yup";
import SelectDefault from "../components/SelectDefault";
import { useQuery } from "react-query";
import {
  statusOfReservation,
  type Boat,
  type Reservation,
} from "../components/TypesUse";
import { useParams } from "react-router-dom";
import {
  editsingleReservation,
  getSingleBoat,
  getSingleReservation,
} from "../services/Routes";
import LoadingDefault from "../components/LoadingDefault";
import AlertNotification from "../components/AlertNotification";
import { FaRegCopy } from "react-icons/fa6";

interface CombinedBoatData {
  boatData: Boat | null;
  reservationData: Reservation[];
}

const EditReservation = () => {
  const [loading, setLoading] = useState(false);
  const { id, boatId } = useParams();
  const [reservationAllData, setReservationAllData] = useState<Reservation>();
  const [boatAllData, setBoatAllData] = useState<Boat>();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [controlEditData, setControlEditData] = useState("");
  const [copied, setCopied] = useState(false);

  const { isLoading, error } = useQuery<CombinedBoatData | null>(
    ["reservation", id],
    async () => {
      if (!id) {
        return null; // Retorna null se não houver ID, para a query não ser habilitada
      }
      const [boatData, reservationData] = await Promise.all([
        getSingleBoat(boatId),
        getSingleReservation(id),
      ]);
      const reservationDataArray = reservationData ? [reservationData] : [];
      return { boatData, reservationData: reservationDataArray };
    },
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
      retry: 1,
      onSuccess: (data) => {
        if (data?.reservationData && data.reservationData.length > 0) {
          const firstReservation = data.reservationData[0];
          setReservationAllData(firstReservation);
          const partes = firstReservation.dataTour.split("/");
          const dataNoFormatoCorreto = `${partes[2]}-${partes[1]}-${partes[0]}`;
          const partesReserva = firstReservation.data.split("/");
          const dataNoFormatoCorretoReserva = `${partesReserva[2]}-${partesReserva[1]}-${partesReserva[0]}`;
          setControlEditData(dataNoFormatoCorreto || "");
          formik.setValues({
            name: firstReservation.name || "",
            email: firstReservation.email || "",
            phone: firstReservation.phone || "",
            quantity: firstReservation.quantity || "",
            data: dataNoFormatoCorretoReserva || "",
            dataTour: dataNoFormatoCorreto || "",
            script: firstReservation.script || "",
            price: firstReservation.price || "",
            acceptedTerms: firstReservation.acceptedTerms || true,
            status: firstReservation.status || "",
            paid: firstReservation.paid,
            paymentLink: firstReservation.paymentLink
              ? firstReservation.paymentLink
              : "",
            finishLink: firstReservation.finishLink
              ? firstReservation.finishLink
              : "",
            productName: firstReservation.productName || "",
            // description: reservationData.description || "",
            // capacity: reservationData.capacity || "",
            // boarding: reservationData.boarding || "",
            // boardingTime: reservationData.boardingTime || "",
            // duration: reservationData.duration || "",
            // price: reservationData.price || "",
            // type: reservationData.type || "",
            // city: reservationData.city || "",
            // sailor: reservationData.sailor !== undefined ? reservationData.sailor : true,
            // details: reservationData.details || [],
            // scripts: reservationData.scripts || [],
            // structure: reservationData.structure || [],
            // images: reservationData.images || [], // As URLs das imagens existentes
          });
        }
        if (data?.boatData) {
          const dataControl = data.boatData;
          const newOptions = dataControl.scripts;
          const reloadedItems = [{ label: "Roteiros", value: "" }];
          newOptions?.forEach((item) => {
            reloadedItems.push({ label: item, value: item });
          });
          dataControl.scripts = reloadedItems;
          setBoatAllData(dataControl);
        }
      },
      onError: (err) => {
        console.error("Erro ao carregar os dados do barco:", err);
        setAlertMessage("Erro ao carregar reserva.");
        setAlertType("error");
        setOpenAlert(true);
      },
    }
  );
  
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      quantity: "",
      data: "",
      dataTour: "",
      script: "",
      price: "",
      paid: false,
      acceptedTerms: false,
      status: "",
      paymentLink: "",
      finishLink: "",
      productName: "",
    },
    validationSchema: yup.object({
      name: yup.string().required("O nome é obrigatório."),
      email: yup.string().required("O email é obrigatório."),
      phone: yup.string().required("O telefone é obrigatório."),
      quantity: yup
        .string()
        .required("A quantidade de passageiros é obrigatória."),
      dataTour: yup.string().required("Selecione a data do passeio."),
      script: yup.string().required("Selecione um roteiro."),
      acceptedTerms: yup.boolean().required("O tipo de usuário é obrigatório."),
    }),
    onSubmit: async (values, { setSubmitting, resetForm, setFieldError }) => {
      setLoading(true);
      try {
        if (
          boatAllData &&
          parseInt(values.quantity) > parseInt(boatAllData.capacity)
        ) {
          setFieldError(
            "quantity",
            `A quantidade de pessoas não pode ser maior que a capacidade da embarcação que é de ${boatAllData.capacity}.`
          );
          setLoading(false);
          setSubmitting(false);
          return;
        }

        const partes = values.dataTour.split("-");
        const dataNoFormatoCorreto = `${partes[2]}/${partes[1]}/${partes[0]}`;

        const data = {
          name: values.name,
          email: values.email,
          phone: values.phone,
          quantity: values.quantity,
          data: new Date(values.data).toLocaleDateString(),
          dataTour: dataNoFormatoCorreto,
          script: values.script,
          price: values.price,
          paid: values.paid,
          acceptedTerms: values.acceptedTerms,
          status: values.status,
          paymentLink: values.paymentLink,
          finishLink: values.finishLink,
        };
        await editsingleReservation(data, id);
        setAlertMessage("Reserva editada com sucesso!");
        setAlertType("success");
        setOpenAlert(true);
      } catch (e) {
        console.log(e);
        setAlertMessage("Erro ao editar reserva.");
        setAlertType("error");
        setOpenAlert(true);
      }
      setLoading(false);
    },
  });

  useEffect(() => {
    if (!formik.values.finishLink && formik.values.status === "aproved") {
      formik.setFieldValue(
        "finishLink",
        `localhost:5173/confirmacao-pagamento/${id}`
      );
      formik.setFieldValue(
        "productName",
        `${reservationAllData?.name}-embarcação:${reservationAllData?.boatName}-data:${reservationAllData?.dataTour}`
      );
    } else if (
      formik.values.finishLink &&
      (formik.values.status === "requested" ||
        formik.values.status === "canceled")
    ) {
      formik.setFieldValue("finishLink", "")
      formik.setFieldValue("productName", "")
    }
  }, [formik.values.status]);

  const copyToClipboard = async () => {
    try {
      if (!formik.values.finishLink) {
        setAlertMessage("Nenhum link para copiar.");
        setAlertType("error");
        setOpenAlert(true);
        return;
      }
      await navigator.clipboard.writeText(formik.values.finishLink);
      setAlertMessage("Link copiado com sucesso!");
      setAlertType("success");
      setOpenAlert(true);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.log("Falha ao copiar o texto", err);
    }
  };

  return (
    <>
      <p className="text-primary text-[1.5em] font-medium ">Editando reserva</p>
      <form className="w-full mt-4" onSubmit={formik.handleSubmit}>
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
              placeholder={"Whatsapp"}
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
              placeholder={"Quantidade de pessoas"}
              required={true}
              name={"quantity"}
              value={formik.values.quantity}
              onChange={formik.handleChange}
              pattern={"[0-9]*"}
              title={"Adicione apenas números, ex: 20"}
            />
            {formik.touched.quantity && formik.errors.quantity ? (
              <p className="text-red-500 text-sm">{formik.errors.quantity}</p>
            ) : null}
          </div>
          <div>
            <InputDefault
              type={"date"}
              placeholder={"Data da reserva"}
              required={true}
              name={"data"}
              value={formik.values.data}
              onChange={formik.handleChange}
              disabled
              // min={minDate}
            />
            {formik.touched.data && formik.errors.data ? (
              <p className="text-red-500 text-sm">{formik.errors.data}</p>
            ) : null}
          </div>
          <div>
            <InputDefault
              type={"date"}
              placeholder={"Data do passeio"}
              required={true}
              name={"dataTour"}
              value={formik.values.dataTour}
              onChange={formik.handleChange}
              // min={minDate}
            />
            {formik.touched.dataTour && formik.errors.dataTour ? (
              <p className="text-red-500 text-sm">{formik.errors.dataTour}</p>
            ) : null}
          </div>
          <div>
            {boatAllData && boatAllData.scripts && (
              <SelectDefault
                placeholder={"Roteiro"}
                name={"script"}
                value={formik.values.script}
                onChange={formik.handleChange}
                options={boatAllData.scripts}
                required={true}
              />
            )}
            {formik.touched.script && formik.errors.script ? (
              <p className="text-red-500 text-sm">{formik.errors.script}</p>
            ) : null}
          </div>
          <div>
            {boatAllData && boatAllData.scripts && (
              <SelectDefault
                placeholder={"Status"}
                name={"status"}
                value={formik.values.status}
                onChange={formik.handleChange}
                options={statusOfReservation}
                required={true}
              />
            )}
            {formik.touched.status && formik.errors.status ? (
              <p className="text-red-500 text-sm">{formik.errors.status}</p>
            ) : null}
          </div>
          <div>
            <InputDefault
              placeholder={"Link de pagamento"}
              name={"paymentLink"}
              value={formik.values.paymentLink}
              onChange={formik.handleChange}
            />
            {formik.touched.paymentLink && formik.errors.paymentLink ? (
              <p className="text-red-500 text-sm">
                {formik.errors.paymentLink}
              </p>
            ) : null}
          </div>
          <div>
            <div className="flex w-full items-center">
              <div className="w-full">
                <InputDefault
                  placeholder={"Nome para produto"}
                  name={"productName"}
                  value={formik.values.productName}
                  disabled
                />
              </div>
              <FaRegCopy
                className={`cursor-pointer ${
                  copied ? "text-green-500" : "text-primary"
                } text-2xl `}
                onClick={copyToClipboard}
              />
            </div>
            {formik.touched.productName && formik.errors.productName ? (
              <p className="text-red-500 text-sm">{formik.errors.productName}</p>
            ) : null}
          </div>
          <div>
            <div className="flex w-full items-center">
              <div className="w-full">
                <InputDefault
                  placeholder={"Link de finalização"}
                  name={"finishLink"}
                  value={formik.values.finishLink}
                  disabled
                />
              </div>
              <FaRegCopy
                className={`cursor-pointer ${
                  copied ? "text-green-500" : "text-primary"
                } text-2xl `}
                onClick={copyToClipboard}
              />
            </div>
            {formik.touched.finishLink && formik.errors.finishLink ? (
              <p className="text-red-500 text-sm">{formik.errors.finishLink}</p>
            ) : null}
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="myCheckbox"
              name="myCheckbox"
              className="form-checkbox h-5 w-5 text-primary radius-[50px]"
              checked={formik.values.paid}
              onChange={() => formik.setFieldValue("paid", !formik.values.paid)}
            />
            <label htmlFor="myCheckbox" className="ml-2 text-gray-700">
              Pago - {formik.values.paid ? "Sim" : "Não"}
            </label>
          </div>
          {/* <div className="flex flex-col gap- 4  justify-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="myCheckbox"
                name="myCheckbox"
                className="form-checkbox h-5 w-5 text-primary radius-[50px]"
                checked={formik.values.paid}
                onChange={() =>
                  formik.setFieldValue("paid", !formik.values.paid)
                }
              />
              <label htmlFor="myCheckbox" className="ml-2 text-gray-700">
                Pago - {formik.values.paid ? "Sim" : "Não"}
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="myCheckbox"
                name="myCheckbox"
                className="form-checkbox h-5 w-5 text-primary radius-[50px]"
                checked={formik.values.acceptedTerms}
                onChange={() =>
                  formik.setFieldValue(
                    "acceptedTerms",
                    !formik.values.acceptedTerms
                  )
                }
              />
              <label htmlFor="myCheckbox" className="ml-2 text-gray-700">
                Aceito os termos e condições*
              </label>
            </div>
          </div> */}
          <div>
            <p className="text-primary text-[.7em] font-medium ">
              locação+taxas*
            </p>
            <p className="text-primary text-[1.6em] font-medium ">
              Total: R$ {formik.values.price}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center mt-8">
          <ButtonDefault text={"Editar"} type={"submit"} />
        </div>
      </form>
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

export default EditReservation;
