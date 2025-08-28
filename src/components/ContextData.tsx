import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection } from "firebase/firestore";
import { create } from "zustand";
import { db } from "../firebase";
import type { User } from "./TypesUse";

const auth = getAuth();



type Loged = {
  isLoged: boolean;
};

type IsLoadingComponent = {
  isLoading: boolean;
};

type UserData = {
  dataUser: User | null;
  userLoged: Loged | null;
  isLoadingData: IsLoadingComponent | null;
  addUser: (user: User) => void;
  checkLogin: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useUserData = create<UserData>((set, get) => ({
  dataUser: null,
  userLoged: null,
  isLoadingData: { isLoading: true },
  addUser: (allData) => {
    set({
      dataUser: allData,
      userLoged: {
        isLoged: true,
      },
      isLoadingData: null,
    });
  },
  checkLogin: async () => {
    const { addUser } = get();

    onAuthStateChanged(auth, async (user) => {
      //se tem user logado
      if (user) {
        const userValues = {
          uid: user.uid,
          email: user.email,
        };
        localStorage.setItem("@detailUser", JSON.stringify(userValues));

        // const userRef = db.collection("users").doc(user.uid);
        const usersCollectionRef = collection(db, "users");
        // Referência a um documento específico dentro da coleção "users"
        const userDocRef = doc(usersCollectionRef, user.uid);
        try {
          const doc = await getDoc(userDocRef); //userRef.get();
          if (doc.exists()) {
            const data = doc.data();
            const userData: User = data as User;
            addUser(userData);
          } else {
            console.log("No such document for user:", user.uid);
            set({ dataUser: null, userLoged: null, isLoadingData: null });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          set({ dataUser: null, userLoged: null, isLoadingData: null });
        }
      } else {
        set({ dataUser: null, userLoged: null, isLoadingData: null });
        localStorage.removeItem("@detailUser");
      }
    });
  },
  logout: async () => {
    await signOut(auth);
  },
}));
