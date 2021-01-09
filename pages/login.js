import React, { useContext } from "react";
import FormLogin from "../components/FormLogin";
import UserContext from "../UserContext";
import { useRouter } from "next/router";

export default function login() {
  const { userData, setUserData } = useContext(UserContext);
  const router = useRouter();
  if (userData.user === undefined) {
  } else {
    router.push("/admin");
  }
  return (
    <div>
      <FormLogin />
    </div>
  );
}
