import axios from "axios";
import React, { Fragment, useState, useEffect, useContext } from "react";
import NavBar from "../../components/NavBar";
import { useRouter } from "next/router";
import UserContext from "../../UserContext";
import jwt from "jsonwebtoken";
import OrderComponent from "../../components/OrderComponent";

export default function orders() {
  const [updater, setUpdater] = useState(false);
  const { userData } = useContext(UserContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const Authorization = async () => {
      let token = localStorage.getItem("auth-token");
      let isValidated;
      let userRes;
      let error = "";

      if (!token) {
        localStorage.setItem("auth-token", "");
        token = "";
      }
      if (token) {
        try {
          isValidated = await jwt.verify(token, "otta");
        } catch (eror) {
          console.log(error);
        }
      }
      if (isValidated) {
        userRes = await axios.post("/api/getUser", {
          id: isValidated.id,
        });
      } else {
        localStorage.setItem("auth-token", "");
        token = "";
        router.push("/login");
      }
    };
    Authorization();
    axios.get("/api/orders").then((res) => {
      setOrders(res.data.data);
    });
  }, []);
  return (
    <Fragment>
      <NavBar />
      <section id="orders">
        <h4>Últimos 50 pedidos...</h4>
        <div className="orders-container">
          {orders.length !== 0
            ? orders.map((o) => {
                console.log(o);
                return (
                  <OrderComponent
                    nombre={o.nombre}
                    apellido={o.apellido}
                    email={o.email}
                    telefono={o.telefono}
                    provincia={o.provincia}
                    direccion={o.direccion}
                    monto={o.monto}
                    cart={o.cart}
                    pagoId={o.pagoId}
                  />
                );
              })
            : null}
        </div>
      </section>
      <style jsx>{`
        #orders {
          width: 70%;
          margin: auto;
          min-height: 90vh;
          margin-top: 10vh;
        }
        .orders-container {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column-reverse;
        }
        @media (max-width: 500px) {
          #orders {
            width: 90%;
          }
        }
      `}</style>
    </Fragment>
  );
}
