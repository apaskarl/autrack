import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

type InstructorData = {
  firstName: string;
  lastName: string;
  employeeID: number;
  is_admin: boolean;
};

export const getInstructors = async () => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("is_admin", "==", false));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as InstructorData), // Explicitly cast the data to the expected type
  }));
};
