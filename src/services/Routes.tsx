import { db } from "../firebase";
import {
  deleteDoc,
  doc,
  query,
  where,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  getDownloadURL,
  deleteObject,
  uploadBytes,
} from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import type { Boat, Repo, Reservation, User } from "../components/TypesUse";

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

/******Função que faz o upload de imagens******/
export const uploadImages = async (file: File) => {
  const storage = getStorage();
  const storageRef = ref(storage, `images/${file.name}-${Date.now()}`);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    const dataReturn = {
      status: "success",
      url: url,
    };
    return dataReturn;
  } catch (error) {
    console.error("Erro ao fazer upload da imagem:", error);
    const dataReturn = {
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
    return { status: 400, message: e.message };
  }
};

/******Função que faz o get de todas as embarcações de um anunciante especifico******/
export const getMyBoats = async (id: string) => {
  try {
    const q = query(collection(db, "boats"), where("managerId", "==", id));
    const querySnapshot = await getDocs(q);
    const boats = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { data: boats, status: 200 };
  } catch (error) {
    console.error("Erro ao obter embarcações:", error);
    return { status: 400, error: error.message };
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
    return { status: 400, error: error.message };
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
    return { status: 400, error: error.message };
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
    return { status: 400, message: e.message };
  }
};

/******Função que faz o get de todas as reservas de um cliente especifico******/

export type ReservationData = {
  id:string,
  role:string
}
export const getMyReservations = async ({id, role}:ReservationData) => {
  try {
    const q = query(
      collection(db, "reservations"),
      where(role === "client" ? "clientId" : "managerId" , "==", id)
    );
    const querySnapshot = await getDocs(q);
    const boats = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { data: boats, status: 200 };
  } catch (error) {
    console.error("Erro ao obter reservas:", error);
    return { status: 400, error: error.message };
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

/******Função que edita uma reserva******/
export const editsingleReservation = async (data: Reservation, id: string) => {
  try {
    const boatRef = doc(db, "reservations", id);

    await updateDoc(boatRef, data);
    return { status: 200 };
  } catch (error) {
    console.error("Erro ao editar reserva:", error);
    return { status: 400, error: error.message };
  }
};

/******Função que confirma o pagamento reserva******/
export const confirmPaymentReservation = async (id: string) => {
  try {
    const boatRef = doc(db, "reservations", id);

    await updateDoc(boatRef, { paid: true });
    return { status: 200 };
  } catch (error) {
    console.error("Erro ao finalizar pagamento:", error);
    return { status: 400, error: error.message };
  }
};

/******Função que altera avaliação do passeio******/
export type RatingData = {
  data: {
    value: number;
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
    date: data.date
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
    return { status: 400, error: error.message };
  }
};

/******Função que faz o get de todas as avaliações de um barco especifico******/
export const getMyReviews = async (id: string) => {
  try {
    const q = query(collection(db, "reviews"), where("boatId", "==", id));
    const querySnapshot = await getDocs(q);
    const boats = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { data: boats, status: 200 };
  } catch (error) {
    console.error("Erro ao obter reservas:", error);
    return { status: 400, error: error.message };
  }
};
