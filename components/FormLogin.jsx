import { useState, useContext, useEffect, Fragment } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import UserContext from './../UserContext'

export default function FormLogin(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const {userData, setUserData} = useContext(UserContext)
  
  
  const onFormSubmit = async (e) => {
    e.preventDefault();
    const userToLogin = { username, password };
    const loginRes = await axios.post(
      "/api/login",
      userToLogin
    );
    if(loginRes.data.token){
      localStorage.setItem("auth-token", loginRes.data.token);
      router.push("/");
    }else{
      localStorage.setItem("auth-token", '');
      router.push("/login");
    }
    setUserData(loginRes.data)
    router.push("/admin");
  };

  return (
    <Fragment>
      <div className="form-login-container">
      <form action={props.action} method={props.method} onSubmit={onFormSubmit}>
        <h2>Inicio de Sesión</h2>
        <p>Nombre de usuario</p>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <p>Contraseña</p>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button type="submit">Login</button>
      </form>
    </div>
    <style jsx>
      {`
        .form-login-container{
          min-height:100vh;
          display: flex;
          align-items:center;
          justify-content:center;
        }
        form{
          display: flex;
          align-items:center;
          justify-content:center;
          flex-direction:column;
        }
        input{
          background-color: white;
          box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.2);
          padding:0.5rem 1rem;
          border:none;
          border-radius:20px;
          margin-bottom:2rem;
        }
        button{
          padding:1rem;
          font-family: 'Poppins';
          background-color: gray;
          color: white;
          border:none;
        }
        h2{
          margin-bottom: 3rem;
          text-align:center;
          font-size:1.5rem
        }
      `}
    </style>
    </Fragment>
  );
}
