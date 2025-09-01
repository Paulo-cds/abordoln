import { useEffect, useRef, useState } from "react";
import ButtonDefault from "../components/ButtonDefault";
import InputDefault from "../components/InputDefault";
import { useFormik } from "formik";
import * as yup from "yup";
import LoadingDefault from "../components/LoadingDefault";
import { CiCirclePlus } from "react-icons/ci";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import SelectDefault from "../components/SelectDefault";
import { CiImageOn } from "react-icons/ci";
import { addNewBoat, uploadImages } from "../services/Routes";
import { useUserData } from "../components/ContextData";
import { citiesOfBoats, typesOfBoats, type Boat } from "../components/TypesUse";
import { FaCheck } from "react-icons/fa";
import AlertNotification from "../components/AlertNotification";

const NewBoat = () => {
  const [loading, setLoading] = useState(false);
  const { dataUser } = useUserData();
  const [details, setDetails] = useState<string[]>([]);
  const [scripts, setScripts] = useState<string[]>([]);
  const [structure, setStructure] = useState<string[]>([]);
  const [imagesFile, setImagesFile] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const itemsSelect = [
    { label: "Tipo de embarcação", value: "" },
    ...typesOfBoats,
  ];
  const allSelectCity = [{ label: "Cidade", value: "" }, ...citiesOfBoats];

  const formik = useFormik<Boat>({
    initialValues: {
      name: "",
      description: "",
      capacity: "",
      details: [],
      boarding: "",
      scripts: [],
      structure: [],
      images: [],
      price: "",
      duration: "",
      boardingTime: "",
      type: "",
      city: "",
      sailor: true, // Definindo o marinheiro como obrigatório
    },
    validationSchema: yup.object({
      name: yup.string().required("O nome é obrigatório."),
      description: yup.string().required("A descrição é obrigatória."),
      capacity: yup.string().required("A capacidade é obrigatória."),
      details: yup.array().required("Adicione ao menos um detalhe."),
      scripts: yup.array().required("Adicione ao menos um roteiro."),
      structure: yup.array().required("Adicione ao menos item de estrutura."),
      boarding: yup.string().required("O local de embarque é obrigatório."),
      price: yup.string().required("O preço é obrigatório."),
      duration: yup.string().required("O tempo é obrigatório."),
      type: yup.string().required("O tipo é obrigatório."),
      city: yup.string().required("A cidade é obrigatória."),
      boardingTime: yup
        .string()
        .required("O horário de embarque é obrigatório."),
      images: yup
        .array()
        .of(yup.string().required("URL da imagem não pode ser vazia"))
        .min(1, "Adicione ao menos uma imagem.")
        .max(8, "Você pode adicionar no máximo 8 imagens.")
        .required("Adicione ao menos uma imagem."),
    }),
    onSubmit: async (values, { setSubmitting, resetForm, setFieldError }) => {
      setLoading(true);
      setSubmitting(true);
      try {
        if (details.length === 0) {
          setFieldError("details", "Adicione ao menos um detalhe.");
          setLoading(false);
          setSubmitting(false);
          return;
        }
        if (scripts.length === 0) {
          setFieldError("scripts", "Adicione ao menos um roteiro.");
          setLoading(false);
          setSubmitting(false);
          return;
        }
        if (structure.length === 0) {
          setFieldError("structure", "Adicione ao menos um item de estrutura.");
          setLoading(false);
          setSubmitting(false);
          return;
        }

        let finalImageUrls: string[] = [];
        if (imagesFile.length > 0) {
          const uploadPromises = imagesFile.map(async (image) => {
            try {
              const response = await uploadImages(image);
              // if (response.status === "success") {
              //   return response.url;
              // } else {
              //   console.error(`Erro ao fazer upload da imagem ${image.name}`);
              //   return null;
              // }
              if ("url" in response) {
                // TypeScript now knows that 'response' is the success type, so 'url' exists
                return response.url;
              } else {
                console.error(`Erro ao fazer upload da imagem ${image.name}`);
                return null;
              }
            } catch (error) {
              console.error(
                `Erro inesperado ao fazer upload da imagem ${image.name}:`,
                error
              );
              return null;
            }
          });

          // Aguarda todas as promessas de upload
          // const uploadedUrls = (await Promise.all(uploadPromises)).filter(
          //   (url: string) => url !== null
          // ) as string[];
          const uploadedUrls = (await Promise.all(uploadPromises)).filter(Boolean) as string[];

          if (uploadedUrls.length === 0 && imagesFile.length > 0) {
            setFieldError(
              "images",
              "Nenhuma imagem pôde ser carregada. Verifique os arquivos."
            );
            setLoading(false);
            setSubmitting(false);
            return; // Impede o envio se o upload falhou para todas as imagens
          }
          finalImageUrls = uploadedUrls;
        }

        const data = {
          name: values.name,
          description: values.description,
          capacity: values.capacity,
          details: values.details,
          boarding: values.boarding,
          scripts: values.scripts,
          structure: values.structure,
          images: finalImageUrls,
          price: values.price,
          duration: values.duration,
          boardingTime: values.boardingTime,
          type: values.type,
          city: values.city,
          sailor: true,
          managerId: dataUser?.userId || "",
        };
        await addNewBoat(data);
        setAlertMessage("Embarcação cadastrada com sucesso!");
        setAlertType("success");
        setOpenAlert(true);
        setSubmitting(false);
        resetForm();
        setDetails([]);
        setScripts([]);
        setStructure([]);
        setImagesFile([]);
      } catch (e) {
        console.log(e);
        setAlertMessage("Erro ao cadastrar embarcação. Tente novamente.");
        setAlertType("error");
        setOpenAlert(true);
        setSubmitting(false);
        setFieldError(
          "general",
          "Erro ao cadastrar embarcação. Tente novamente."
        );
        console.error("Erro ao cadastrar embarcação:", e);
      }
      setLoading(false);
    },
  });

  useEffect(() => {
    if (details) {
      formik.setFieldValue("details", details, false); // false = não validar imediatamente
    }
  }, [details, formik.setFieldValue]);

  useEffect(() => {
    if (scripts) {
      formik.setFieldValue("scripts", scripts, false); // false = não validar imediatamente
    }
  }, [scripts, formik.setFieldValue]);

  useEffect(() => {
    if (structure.length > 0) {
      formik.setFieldValue("structure", structure, false);
    } else {
      formik.setFieldValue("structure", [], false); // Garante que o campo seja sempre um array, mesmo se estiver vazio
    }
  }, [structure, formik.setFieldValue]);

  useEffect(() => {
    formik.setFieldValue("images", imagesFile, false);
  }, [imagesFile, formik.setFieldValue]);

  return (
    <>
      <h2 className="text-primary mt-4">
        Preencha seus dados para realizar o cadastro de sua embarcação.
      </h2>
      <div className="w-full mt-8">
        <form
          className="flex flex-col gap-4 w-full justify-center items-center"
          onSubmit={formik.handleSubmit}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <InputDefault
                type={"text"}
                placeholder={"Nome da embarcação"}
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
                placeholder={"Descrição da embarcação"}
                required={true}
                type={"text"}
                name={"description"}
                value={formik.values.description}
                onChange={formik.handleChange}
              />
              {formik.touched.description && formik.errors.description ? (
                <p className="text-red-500 text-sm">
                  {formik.errors.description}
                </p>
              ) : null}
            </div>
            <div>
              <SelectDefault
                placeholder={"Selecione o tipo de embarcação"}
                name={"type"}
                value={formik.values.type}
                onChange={formik.handleChange}
                options={itemsSelect}
                required={true}
              />
              {formik.touched.type && formik.errors.type ? (
                <p className="text-red-500 text-sm">{formik.errors.type}</p>
              ) : null}
            </div>
            <div>
              <SelectDefault
                placeholder={"Selecione a cidade de embarcação"}
                name={"city"}
                value={formik.values.city}
                onChange={formik.handleChange}
                options={allSelectCity}
                required={true}
              />
              {formik.touched.city && formik.errors.city ? (
                <p className="text-red-500 text-sm">{formik.errors.city}</p>
              ) : null}
            </div>
            <div>
              <InputDefault
                type={"text"}
                placeholder={"Capacidade de passageiros"}
                required={true}
                name={"capacity"}
                value={formik.values.capacity}
                onChange={formik.handleChange}
                pattern={"[0-9]*"}
                title={"Adicione apenas números, ex: 20"}
              />
              {formik.touched.capacity && formik.errors.capacity ? (
                <p className="text-red-500 text-sm">{formik.errors.capacity}</p>
              ) : null}
            </div>

            <div>
              <InputDefault
                type={"text"}
                placeholder={"Local de embarque"}
                required={true}
                name={"boarding"}
                value={formik.values.boarding}
                onChange={formik.handleChange}
              />
              {formik.touched.boarding && formik.errors.boarding ? (
                <p className="text-red-500 text-sm">{formik.errors.boarding}</p>
              ) : null}
            </div>
            <div>
              <InputDefault
                type={"text"}
                placeholder={"Horário de embarque"}
                required={true}
                name={"boardingTime"}
                value={formik.values.boardingTime}
                onChange={formik.handleChange}
                pattern={"[0-9]*h[0-9]{2}"}
                title={"Formato ex: 06h30 (6 horas e 30 minutos)"}
              />
              {formik.touched.boardingTime && formik.errors.boardingTime ? (
                <p className="text-red-500 text-sm">
                  {formik.errors.boardingTime}
                </p>
              ) : null}
            </div>
            <div>
              <InputDefault
                type={"text"}
                placeholder={"Tempo de passeio"}
                required={true}
                name={"duration"}
                value={formik.values.duration}
                onChange={formik.handleChange}
                pattern={"[0-9]*h[0-9]{2}"}
                title={"Formato ex: 06h30 (6 horas e 30 minutos)"}
              />
              {formik.touched.duration && formik.errors.duration ? (
                <p className="text-red-500 text-sm">{formik.errors.duration}</p>
              ) : null}
            </div>
            <div>
              <InputDefault
                type={"text"}
                placeholder={"Preço"}
                required={true}
                name={"price"}
                value={formik.values.price}
                onChange={formik.handleChange}
                pattern={"[0-9]*,[0-9]{2}"}
                title={"Formato ex: 3000,00"}
              />
              {formik.touched.price && formik.errors.price ? (
                <p className="text-red-500 text-sm">{formik.errors.price}</p>
              ) : null}
            </div>
            <div>
              <p className="text-primary text-1xl ">
                Adicione detalhes da embarcação, como: motor, tipo de navegação,
                etc.
              </p>
              {details.length > 0 &&
                details.map((detail, index) => (
                  <div
                    className="flex items-center gap-2 grid grid-cols-12"
                    key={index}
                  >
                    <div className="col-span-11">
                      <InputDefault
                        key={index}
                        type={"text"}
                        placeholder={"Detalhe da embarcação"}
                        required={true}
                        name={"details"}
                        value={detail}
                        onChange={(e) => {
                          const newDetails = [...details];
                          newDetails[index] = e.target.value;
                          setDetails(newDetails);
                        }}
                      />
                    </div>
                    <div className="col-span-1">
                      <IoIosRemoveCircleOutline
                        className="cursor-pointer text-red-500"
                        onClick={() => {
                          const newDetails = [...details];
                          newDetails.splice(index, 1);
                          setDetails(newDetails);
                        }}
                      />
                    </div>
                  </div>
                ))}
              <p
                className="text-primary cursor-pointer flex items-center gap-1 mt-2"
                onClick={() => {
                  const newDetails = [...details];
                  newDetails.push("");
                  setDetails(newDetails);
                }}
              >
                <CiCirclePlus /> Novo detalhe
              </p>
              {formik.touched.details && formik.errors.details ? (
                <p className="text-red-500 text-sm">{formik.errors.details}</p>
              ) : null}
            </div>
            <div>
              <p className="text-primary text-1xl ">
                Adicione os roteiros que serão realizados com a embarcação.
              </p>
              {scripts.length > 0 &&
                scripts.map((detail, index) => (
                  <div
                    className="flex items-center gap-2 grid grid-cols-12"
                    key={index}
                  >
                    <div className="col-span-11">
                      <InputDefault
                        key={index}
                        type={"text"}
                        placeholder={"Roteiro"}
                        required={true}
                        name={"scripts"}
                        value={detail}
                        onChange={(e) => {
                          const newScripts = [...scripts];
                          newScripts[index] = e.target.value;
                          setScripts(newScripts);
                        }}
                      />
                    </div>
                    <div className="col-span-1">
                      <IoIosRemoveCircleOutline
                        className="cursor-pointer text-red-500"
                        onClick={() => {
                          const newScripts = [...scripts];
                          newScripts.splice(index, 1);
                          setScripts(newScripts);
                        }}
                      />
                    </div>
                  </div>
                ))}
              <p
                className="text-primary cursor-pointer flex items-center gap-1 mt-2"
                onClick={() => {
                  const newScripts = [...scripts];
                  newScripts.push("");
                  setScripts(newScripts);
                }}
              >
                <CiCirclePlus /> Novo roteiro
              </p>
              {formik.touched.scripts && formik.errors.scripts ? (
                <p className="text-red-500 text-sm">{formik.errors.scripts}</p>
              ) : null}
            </div>
            <div>
              <p className="text-primary text-1xl ">
                Adicione as estruturas da embarcação, como: banheiro, cozinha,
                etc.
              </p>
              {formik.values.structure &&
                formik.values.structure.length > 0 &&
                formik.values.structure.map((detail, index) => (
                  <div
                    className="flex items-center gap-2 grid grid-cols-12"
                    key={index}
                  >
                    <div className="col-span-11">
                      <InputDefault
                        key={index}
                        type={"text"}
                        placeholder={"Estrutura da embarcação."}
                        required={true}
                        name={"structure"}
                        value={detail}
                        onChange={(e) => {
                          const newStructure = [...structure];
                          newStructure[index] = e.target.value;
                          setStructure(newStructure);
                        }}
                      />
                    </div>
                    <div className="col-span-1">
                      <IoIosRemoveCircleOutline
                        className="cursor-pointer text-red-500"
                        onClick={() => {
                          const newStructure = [...structure];
                          newStructure.splice(index, 1);
                          setStructure(newStructure);
                        }}
                      />
                    </div>
                  </div>
                ))}
              <p
                className="text-primary cursor-pointer flex items-center gap-1 mt-2"
                onClick={() => {
                  const newStructure = [...structure];
                  newStructure.push("");
                  setStructure(newStructure);
                }}
              >
                <CiCirclePlus /> Nova estrutura
              </p>
              {formik.touched.structure && formik.errors.structure ? (
                <p className="text-red-500 text-sm">
                  {formik.errors.structure}
                </p>
              ) : null}
            </div>
            <div>
              <p className="text-primary text-1xl ">
                Em todas as embarcações, o marinheiro é obrigatório e deve estar
                incluso no valor da locação.
              </p>
              <p className="text-primary text-1xl flex gap-2 items-center">
                <FaCheck className="text-green-500 text-2xl" /> Marinheiro
                incluso.
              </p>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-primary text-1xl ">
              Adicione imagens da embarcação, como: fotos do interior, exterior,
              etc. Máximo de 8 imagens.
            </p>
            {formik.touched.images && formik.errors.images ? (
              <p className="text-red-500 text-sm">{formik.errors.images}</p>
            ) : null}
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {imagesFile.map((image, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-100 rounded relative w-32 h-32"
                  style={{
                    backgroundImage: `url(${URL.createObjectURL(image)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="w-full h-full bg-gray-500/30 rounded absolute flex items-center justify-center">
                    <IoIosRemoveCircleOutline
                      className="cursor-pointer text-red-500 text-2xl"
                      onClick={() => {
                        const newImages = [...imagesFile];
                        newImages.splice(index, 1);
                        setImagesFile(newImages);
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-center rounded relative w-32 h-32">
                <input
                  type={"file"}
                  placeholder={"Imagems da embarcação - máximo 8"}
                  // required={true}
                  name={"images"}
                  value={""}
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      const files = Array.from(e.target.files);
                      if (files.length + imagesFile.length > 8) {
                        alert("Você pode adicionar no máximo 8 imagens.");
                        return;
                      }
                      const newImages = [...imagesFile];
                      newImages.push(e.target.files[0]);
                      setImagesFile(newImages);
                    }
                  }}
                  disabled={imagesFile.length >= 8}
                  className="hidden"
                />
                <CiImageOn
                  className="absolute top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer w-full h-full"
                  onClick={() => fileInputRef.current?.click()}
                />
              </div>
            </div>
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

export default NewBoat;
