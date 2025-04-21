// utils/getNonAdminUsers.ts
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

export const getInstructors = async () => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("is_admin", "==", false));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
