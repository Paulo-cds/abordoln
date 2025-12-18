import { /*app,*/ db } from "../firebase";
import {
  deleteDoc,
  doc,
  query,
  where,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  runTransaction,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  getDownloadURL,
  deleteObject,
  uploadBytes,
} from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import type { Boat, Reservation, Review, User } from "../components/TypesUse";
import { getFunctions, httpsCallable } from "firebase/functions";
// import { functions } from "../firebase";
import {
  getAuth,
  onAuthStateChanged /*onAuthStateChanged*/,
} from "firebase/auth";

// const auth = getAuth(app);

/******Função que adiciona/edita usuário******/
export const manageAccount = async (data: User) => {
  const response = await setDoc(doc(db, "users", data.userId), data)
    .then(() => {
      return { status: 200 };
    })
    .catch((err) => {
      return { status: 400, error: err };
    });

  return response;
};

/******Função que edita status do usuário******/
export const manageUserStatus = async (data: User) => {
  // if (data.role === "client") {
  //   const response = await setDoc(doc(db, "users", data.userId), data)
  //     .then(() => {
  //       return { status: 200 };
  //     })
  //     .catch((err) => {
  //       return { status: 400, error: err };
  //     });

  //   return response;
  // }
  // else if (data.role === "advertiser") {
  //   const q = query(
  //     collection(db, "boats"),
  //     where("managerId", "==", data.userId)
  //   );
  //   const querySnapshot = await getDocs(q);
  //   const boats: Boat[] = querySnapshot.docs.map((doc) => ({
  //     id: doc.id,
  //     active: data.active,
  //     ...doc.data(),
  //   })) as Boat[];
  //   boats.forEach(async (boat) => {
  //     const boatRef = doc(db, "boats", boat.id || "");
  //     await updateDoc(boatRef, boat);
  //   });
  //   const response = await setDoc(doc(db, "users", data.userId), data)
  //     .then(() => {
  //       return { status: 200 };
  //     })
  //     .catch((err) => {
  //       return { status: 400, error: err };
  //     });

  //   return response;
  // }
  try {
    if (data.role === "client") {
      // Transação simples: só atualiza o usuário
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, "users", data.userId);
        transaction.set(userRef, data);
      });
      return { status: 200 };
    }

    if (data.role === "advertiser") {
      // Pega todos os barcos gerenciados pelo usuário
      const q = query(
        collection(db, "boats"),
        where("managerId", "==", data.userId)
      );
      const querySnapshot = await getDocs(q);

      const boats = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      // Transação única: atualiza todos os barcos e o usuário
      await runTransaction(db, async (transaction) => {
        // Atualiza cada barco
        boats.forEach((boat) => {
          const boatRef = doc(db, "boats", boat.id);
          transaction.update(boatRef, { active: data.active });
        });

        // Atualiza usuário
        const userRef = doc(db, "users", data.userId);
        transaction.set(userRef, data);
      });

      return { status: 200 };
    }

    return { status: 400, error: "Função chamada com role inválida" };
  } catch (err) {
    console.error("Erro em manageUserStatus:", err);
    return {
      status: 400,
      error: err instanceof Error ? err.message : "Erro desconhecido",
    };
  }
};

/******Função que faz o upload de imagens******/

export interface UploadSuccess {
  status: "success";
  url: string;
}

export interface UploadError {
  status: "error";
  error: unknown;
}

export type UploadResponse = UploadSuccess | UploadError;

// A função de guarda de tipo
export function isSuccess(response: UploadResponse): response is UploadSuccess {
  return response.status === "success";
}

export const uploadImages = async (file: File): Promise<UploadResponse> => {
  const storage = getStorage();
  const storageRef = ref(storage, `images/${file.name}-${Date.now()}`);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    const dataReturn: UploadSuccess = {
      status: "success",
      url: url,
    };
    return dataReturn;
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    const dataReturn: UploadError = {
      status: "error",
      error: error,
    };
    return dataReturn;
  }
};

/******Função que adiciona barco******/
export const addNewBoat = async (data: Boat) => {
  try {
    await addDoc(collection(db, "boats"), data);
    return { status: 200 };
  } catch (e) {
    console.log("error ", e);
    if (e instanceof Error) {
      return { status: 400, message: e.message };
    }
  }
};

/******Função que faz o get de todas as embarcações de um anunciante especifico******/
export const getMyBoats = async (id: string) => {
  try {
    const q = query(collection(db, "boats"), where("managerId", "==", id));
    const querySnapshot = await getDocs(q);
    const boats: Boat[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Boat[];
    return { data: boats, status: 200 };
  } catch (error) {
    console.error("Erro ao obter embarcações:", error);
    if (error instanceof Error) {
      return { status: 400, error: error.message };
    }
  }
};

/******Função que faz o get de um barco específico******/
export const getSingleBoat = async (id: string) => {
  try {
    const docRef = doc(db, "boats", id);
    const docSnap = await getDoc(docRef);
    return docSnap.data() as Boat;
  } catch (error) {
    console.error("Erro ao obter barco:", error);
    return null;
  }
};

/******Função que faz o get de todos barcos******/
export const getAllBoats = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "boats"));
    const allBoats = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Boat),
    }));
    return { data: allBoats, status: 200 };
  } catch (error) {
    console.error("Erro ao obter barco:", error);
    return null;
  }
};

/******Função que edita o barco******/
export const editMyBoat = async (data: Boat, id: string) => {
  try {
    const boatRef = doc(db, "boats", id);

    await updateDoc(boatRef, data);
    return { status: 200 };
  } catch (error) {
    console.error("Erro ao alterar barco:", error);
    if (error instanceof Error) {
      return { status: 400, error: error.message };
    }
  }
};

/******Função que faz o delete de um barco******/
export const deleteSingleBoat = async (id: string, images: Array<string>) => {
  try {
    const storage = getStorage();
    let desertRef;
    await Promise.all(
      images.map((imageUrl) => {
        let imagePath = imageUrl;

        // Se a URL for uma URL de download do Firebase Storage, extraia o path
        if (imageUrl.includes("firebasestorage.googleapis.com")) {
          try {
            const url = new URL(imageUrl);
            const pathSegments = url.pathname.split("/o/");
            if (pathSegments.length > 1) {
              // Decodifica a URL para lidar com espaços e outros caracteres especiais
              imagePath = decodeURIComponent(pathSegments[1].split("?")[0]);
            } else {
              console.warn(
                `URL de imagem inválida ou inesperada: ${imageUrl}. Usando como path direto.`
              );
              // Se a URL não for como esperado, tenta usar a URL como path (menos provável de funcionar)
              imagePath = imageUrl;
            }
          } catch (e) {
            console.error(`Erro ao parsear URL ${imageUrl}:`, e);
            // Em caso de erro no parse, assume que a URL é o próprio path (pode falhar)
            imagePath = imageUrl;
          }
        }

        desertRef = ref(storage, imagePath);
        deleteObject(desertRef)
          .then(() => {
            // File deleted successfully
          })
          .catch((error) => {
            console.log("erro delete img ", error);
            // Uh-oh, an error occurred!
          });
      })
    ).then(async () => await deleteDoc(doc(db, "boats", id)));
    return { status: 200 };
  } catch (error) {
    console.error("Erro ao obter cliente:", error);
    if (error instanceof Error) {
      return { status: 400, error: error.message };
    }
  }
};

/*******  Reservas  *******/

/******Função que adiciona uma reserva******/
export const addNewReservation = async (data: Reservation) => {
  try {
    await addDoc(collection(db, "reservations"), data);
    return { status: 200 };
  } catch (e) {
    console.log("error ", e);
    if (e instanceof Error) {
      return { status: 400, message: e.message };
    }
  }
};

/******Função que faz o get de todas as reservas de um cliente especifico******/

export type ReservationData = {
  id: string;
  role: string;
};

type ReservationProps = Reservation & {
  // Você pode adicionar outras props se o componente precisar
  id: string;
  // onClick?: () => void;
};

export const getMyReservations = async ({ id, role }: ReservationData) => {
  try {
    const q = query(
      collection(db, "reservations"),
      where(role === "client" ? "clientId" : "managerId", "==", id)
    );
    const querySnapshot = await getDocs(q);
    const boats: ReservationProps[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ReservationProps[];
    return { data: boats, status: 200 };
  } catch (error) {
    console.error("Erro ao obter reservas:", error);
    if (error instanceof Error) {
      return { status: 400, error: error.message };
    }
  }
};

/******Função que faz o get de uma reserva específica******/
export const getSingleReservation = async (id: string) => {
  try {
    const docRef = doc(db, "reservations", id);
    const docSnap = await getDoc(docRef);
    return docSnap.data() as Reservation;
  } catch (error) {
    console.error("Erro ao obter reserva:", error);
    return null;
  }
};

/******Função que faz o get de todas as reservas existentes******/
export const getAllReservations = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "reservations"));
    const allReservations = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Reservation),
    }));
    return { data: allReservations, status: 200 };
  } catch (error) {
    console.error("Erro ao obter reservas:", error);
    return null;
  }
};

/******Função que edita uma reserva******/
export const editsingleReservation = async (data: Reservation, id: string) => {
  try {
    const boatRef = doc(db, "reservations", id);

    await updateDoc(boatRef, data);
    return { status: 200 };
  } catch (error) {
    console.error("Erro ao editar reserva:", error);
    if (error instanceof Error) {
      return { status: 400, error: error.message };
    }
  }
};

/******Função que edita os dados da reserva para pagamento futuro******/
export const editReservationPaymentData = async (
  data: Reservation["paymentMethod"],
  id: string
) => {
  try {
    const boatRef = doc(db, "reservations", id);
    //updateDoc(boatRef, { paid: true })
    await updateDoc(boatRef, { paymentMethod: data });
    return { status: 200 };
  } catch (error) {
    console.error("Erro ao editar reserva:", error);
    if (error instanceof Error) {
      return { status: 400, error: error.message };
    }
  }
};

/******Função que confirma o pagamento reserva******/

// Nova interface que representa o objeto completo enviado para a Cloud Function
export interface PaymentId {
  sessionId: string;
}

export interface StripeSessionId {
  paymentIntentId: string;
}

export const confirmPaymentReservation = async (
  id: string,
  session_id: string
) => {
  try {
    const checkPaymentStatus = httpsCallable<PaymentId, StripeSessionId>(
      functions,
      "checkPaymentStatus"
    );

    const result = await checkPaymentStatus({ sessionId: session_id });
    if (result.data) {
      console.log("result ", result.data);
      const boatRef = doc(db, "reservations", id);
      await updateDoc(boatRef, {
        paid: true,
        paymentIntentId: result.data.paymentIntentId,
      });
      return { status: 200 };
    } else {
      throw new Error("Pagamento não confirmado");
    }
  } catch (error) {
    console.error("Erro ao confirmar pagamento:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Erro desconhecido ao confirmar pagamento.");
    }
  }
};

export interface PaymentSessionId {
  paymentIntentId: string;
}

export const receivePaymentReservation = async (
  paymentIntentId: string,
  id: string
) => {
  try {
    const captureStripePayment = httpsCallable<PaymentSessionId>(
      functions,
      "captureStripePayment"
    );

    await captureStripePayment({ paymentIntentId: paymentIntentId });
    const boatRef = doc(db, "reservations", id);
    await updateDoc(boatRef, {
      status: "finished",
    });
    return { status: 200 };
  } catch (error) {
    console.error("Erro ao confirmar pagamento:", error);
    if (error instanceof Error) {
      return { status: 400, error: error.message };
    }
  }
};

export const cancelPaymentReservation = async (
  paymentIntentId: string,
  id: string
) => {
  try {
    const cancelStripePayment = httpsCallable<PaymentSessionId>(
      functions,
      "cancelStripePayment"
    );

    await cancelStripePayment({
      paymentIntentId: paymentIntentId,
    });
    const boatRef = doc(db, "reservations", id);
    await updateDoc(boatRef, {
      paid: false,
      status: "canceled",
    });
    return { status: 200 };
  } catch (error) {
    console.error("Erro ao cancelar pagamento:", error);
    if (error instanceof Error) {
      return { status: 400, error: error.message };
    }
  }
};

//     const boatRef = doc(db, "reservations", id);

//     await updateDoc(boatRef, { paid: true });
//     return { status: 200 };
//   } catch (error) {
//     console.error("Erro ao finalizar pagamento:", error);
//     if (error instanceof Error) {
//       return { status: 400, error: error.message };
//     }
//   }
// };

/******Função que altera avaliação do passeio******/
export type RatingData = {
  data: {
    value: number | null;
    text: string;
    userName: string;
    date: string;
  };
  id: string;
  boatId: string;
};

type AssessmentResult =
  | {
      status: 200;
    }
  | {
      status: 400;
      error: string; // Erro deve ser string
    };

export const assessmentTrip = async ({
  data,
  id,
  boatId,
}: RatingData): Promise<AssessmentResult> => {
  const reviewData = {
    boatId: boatId,
    value: data.value,
    text: data.text,
    userName: data.userName,
    date: data.date,
  };
  try {
    const boatRef = doc(db, "reservations", id);
    await updateDoc(boatRef, {
      assessment: {
        value: data.value,
        text: data.text,
        userName: data.userName,
      },
    });
    await addDoc(collection(db, "reviews"), reviewData);
    return { status: 200 };
  } catch (error) {
    console.error("Erro ao alterar avaliação:", error);
    if (error instanceof Error) {
      return { status: 400, error: error.message };
    }
    return { status: 400, error: "An unknown error occurred." };
  }
};

/******Função que faz o get de todas as avaliações de um barco especifico******/
export const getMyReviews = async (id: string) => {
  try {
    const q = query(collection(db, "reviews"), where("boatId", "==", id));
    const querySnapshot = await getDocs(q);
    const boats = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Review),
    }));
    return { data: boats, status: 200 };
  } catch (error) {
    console.error("Erro ao obter reservas:", error);
    if (error instanceof Error) {
      return { status: 400, error: error.message };
    }
  }
};

/********Usuários********/

/******Função que faz o get de todos usuários******/
export const getUsers = async () => {
  try {
    const q = query(collection(db, "users"), where("role", "!=", "admin"));
    const querySnapshot = await getDocs(q);
    const allUsers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as User),
    }));
    return { data: allUsers, status: 200 };
  } catch (error) {
    console.error("Erro ao obter usuários:", error);
    return null;
  }
};

/*****Pagamentos ******/

export type Item = {
  name: string;
  amount: number; // Mude de string para number, pois o Stripe usa números para valores
};

// Nova interface que representa o objeto completo enviado para a Cloud Function
export interface PaymentData {
  item: Item;
  orderId: string;
  token?: string; // Torne o token opcional
}

export interface StripeSessionResult {
  sessionUrl: string;
}

const auth = getAuth();
const functions = getFunctions();

//Função que gera pagamento imediato com cartão de crédito via Stripe
export const handlePaymentLink = async (itemToBuy: Item, orderId: string) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const createStripeSession = httpsCallable<
          PaymentData,
          StripeSessionResult
        >(functions, "createStripeSession");

        // Chame a função, passando o objeto do item
        const result = await createStripeSession({
          item: itemToBuy,
          orderId: orderId,
          // token: idToken,
        });

        const sessionUrl = result.data.sessionUrl;

        // Redirecione o usuário para o Stripe Checkout
        window.location.href = sessionUrl;
      } catch (error) {
        console.error("Erro ao iniciar o checkout:", error);
        alert("Ocorreu um erro. Por favor, tente novamente.");
      }
    } else {
      console.log("Nenhum usuário autenticado. Redirecionando para login...");
      alert("Por favor, faça login para continuar com o pagamento.");
    }
  });
};

//Função que gera pagamento de captura c om cartão de crédito via Stripe
export const handleCapturePayment = async (
  itemToBuy: Item,
  orderId: string
) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const createStripeSession = httpsCallable<
          PaymentData,
          StripeSessionResult
        >(functions, "createStripeSession");

        // Chame a função, passando o objeto do item
        const result = await createStripeSession({
          item: itemToBuy,
          orderId: orderId,
        });
        const sessionUrl = result.data.sessionUrl;

        // Redirecione o usuário para o Stripe Checkout
        window.location.href = sessionUrl;
      } catch (error) {
        console.error("Erro ao iniciar o checkout:", error);
        alert("Ocorreu um erro. Por favor, tente novamente.");
      }
    } else {
      console.log("Nenhum usuário autenticado. Redirecionando para login...");
      alert("Por favor, faça login para continuar com o pagamento.");
    }
  });
};

//Função que cobra valor de reserva no cartão salvo do cliente, com valor especifico de multa etc.

export interface PaymentPenaltyId {
  customerId: string;
  paymentMethodId: string;
  amount: number;
  description: string;
}

export const receivePenaltyReservation = async (
  customerId: string,
  paymentMethodId: string,
  amount: number,
  description: string
) => {
  try {
    //customerId, paymentMethodId, amount, description
    const chargeSavedCard = httpsCallable<PaymentPenaltyId>(
      functions,
      "chargeSavedCard"
    );
    const data = {
      customerId,
      paymentMethodId,
      amount,
      description,
    };
    console.log("data ", data);
    const response = await chargeSavedCard(data);
    // const boatRef = doc(db, "reservations", id);
    // await updateDoc(boatRef, {
    //   status: "finished",
    // });
    return response.data;
  } catch (error: unknown) {
    console.error("Erro ao confirmar pagamento:", error);

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    // Caso seja algo diferente de Error (ex: string ou objeto do Firebase)
    throw new Error("Erro ao confirmar pagamento");
  }
};
