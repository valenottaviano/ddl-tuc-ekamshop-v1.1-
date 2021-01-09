import axios from "axios";
import React, { Fragment, useEffect, useState, useContext } from "react";
import NavBarCart from "../components/NavBarCart";
import UserContext from "../UserContext";
import Link from "next/link";
import { useRouter } from "next/router";

export default function checkout() {
  const router = useRouter();
  const {
    userData,
    cart,
    count,
    clientData,
    setClientData,
    setUserData,
    setCart,
    handleCart,
    removeCart,
  } = useContext(UserContext);

  const [updater, setUpdater] = useState(false);
  const [ready, setReady] = useState(false);
  const [envio, setEnvio] = useState("sucursal");

  if (envio === "domicilio") {
    if (
      clientData.nombre !== "" &&
      clientData.apellido !== "" &&
      clientData.email !== "" &&
      clientData.telefono !== 0 &&
      clientData.provincia !== "" &&
      clientData.direccion !== "" &&
      ready === false
    ) {
      setReady(true);
    }
  }

  if (envio === "sucursal") {
    if (
      clientData.nombre !== "" &&
      clientData.apellido !== "" &&
      clientData.email !== "" &&
      clientData.telefono !== 0 &&
      ready === false
    ) {
      setReady(true);
    }
  }

  const handleNewOrder = async () => {
    let orderIdResponse;

    axios
      .post("/api/orders", {
        totalPrice: count.totalPrice,
        cart: cart,
        email: clientData.email,
        clientData: clientData,
        pagoId: null,
      })
      .then((response) => {
        orderIdResponse = response.data.order._id;
        axios
          .post("/api/send-email", {
            to: clientData.email,
            clientData,
            monto: count.totalPrice,
            asunto: "Confirmación de orden de compra!",
          })
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error);
          });

        axios
          .post("/api/send-email", {
            to: "agenciaekam@gmail.com",
            clientData,
            monto: count.totalPrice,
            asunto: "Nueva orden de compra!",
          })
          .then(console.log("Email Sent"))
          .catch((error) => {
            console.log(error);
          });

        router.push(
          `/success?status=null&status_detail=null&payment_id=null&order_id=${orderIdResponse}`
        );
      });
  };

  return (
    <Fragment>
      <NavBarCart cart={cart} />
      <section id="checkout">
        <h2>Checkout</h2>
        <div className="cart-items-container">
          {cart.map((prod, index) => {
            return (
              <div className="cart-item">
                <div className="image-container">
                  <img src={prod.product.picture} />
                </div>
                <div className="text-container">
                  <div>
                    <h3>
                      {prod.product.name} - {prod ? prod.type : ""}{" "}
                    </h3>
                    <p>Cantidad: {prod.quantity}</p>
                    <p>Precio Un.: {prod.product.price}</p>
                  </div>
                </div>
                <div
                  className="delete-btn"
                  onClick={(e) => {
                    removeCart(prod, index, prod.type);
                    setUpdater(!updater);
                  }}
                >
                  -
                </div>
              </div>
            );
          })}
        </div>
        <h2 className="total-price">Total ${count.totalPrice}</h2>
        <form>
          <div>
            <label>Nombre</label>
            <input
              type="text"
              onChange={(e) => {
                setClientData((Rest) => {
                  return {
                    ...Rest,
                    nombre: e.target.value,
                  };
                });
                setUpdater(!updater);
              }}
              value={clientData.nombre}
            />
            <label>Apellido</label>
            <input
              type="text"
              onChange={(e) => {
                setClientData((Rest) => {
                  return {
                    ...Rest,
                    apellido: e.target.value,
                  };
                });
              }}
              value={clientData.apellido}
            />
            <label>Email</label>
            <input
              type="email"
              onChange={(e) => {
                setClientData((Rest) => {
                  return {
                    ...Rest,
                    email: e.target.value,
                  };
                });
              }}
              value={clientData.email}
            />
            <label>Entrega del pedido</label>
            <select
              className="envio-container"
              onChange={(e) => {
                setEnvio(e.target.value);
                setClientData({
                  nombre: clientData.nombre,
                  apellido: clientData.apellido,
                  email: clientData.email,
                  telefono: clientData.telefono,
                  provincia: "",
                  direccion: "",
                });
              }}
              value={envio}
            >
              <option value="domicilio">A domicilio</option>
              <option value="sucursal">Retiro en sucursal</option>
            </select>
          </div>
          <div>
            <label>Número de Teléfono</label>
            <input
              type="number"
              onChange={(e) => {
                setClientData((Rest) => {
                  return {
                    ...Rest,
                    telefono: e.target.value,
                  };
                });
              }}
              value={clientData.telefono}
            />
            <span
              style={{ fontSize: "14px", margin: "2rem", textAlign: "center" }}
            >
              Junto con el código de area y sin el 15.
            </span>

            {envio !== "sucursal" ? (
              <Fragment>
                <label>Provincia</label>
                <input
                  type="text"
                  onChange={(e) => {
                    setClientData((Rest) => {
                      return {
                        ...Rest,
                        provincia: e.target.value,
                      };
                    });
                  }}
                  value={clientData.provincia}
                />
                <label>Dirección</label>
                <input
                  type="text"
                  onChange={(e) => {
                    setClientData((Rest) => {
                      return {
                        ...Rest,
                        direccion: e.target.value,
                      };
                    });
                  }}
                  value={clientData.direccion}
                />
              </Fragment>
            ) : null}
          </div>
        </form>
        {ready ? (
          <div className="buttons-container">
            {cart.length !== 0 ? (
              <Fragment>
                <Link href="/payment">
                  <button>Proceder al Pago</button>
                </Link>
                <button onClick={handleNewOrder}>
                  Realizar Orden de Compra*
                </button>
              </Fragment>
            ) : (
              <h3 className="empty-cart">El carrito está vacío!</h3>
            )}
          </div>
        ) : (
          ""
        )}
        <span>
          *Las órdenes de compra no contemplan el pago del pedido! Éste se
          coordinará una vez realizada la orden.
        </span>
      </section>

      <style jsx>{`
        #checkout {
          min-height: 90vh;
          width: 70%;
          margin: auto;
          margin-top: 10vh;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-direction: column;
        }
        #checkout h2 {
          font-size: 2rem;
          color: #393735;
        }
        .envio-container {
          display: flex;
        }
        .envio-container div {
          padding: 1rem;
          margin: 1rem;
          flex-direction: row;
        }
        button {
          margin-top: 2rem;
          margin-bottom: 3rem;
          padding: 0.8rem 2rem;
          border: none;
          color: white;
          background-color: gray;
          font-weight: 600;
          font-size: 1rem;
          border-radius: 20px;
          cursor: pointer;
        }
        button:nth-child(2) {
          background: none;
          color: gray;
          border: 2px solid gray;
          margin-left: 2rem;
        }
        .total-price {
          text-align: right;
          align-self: flex-end;
        }
        .cart-items-container h2 {
          font-size: 1.3rem;
          font-weight: 500;
          color: black;
          margin-bottom: 2rem;
        }
        .cart-items-container h3 {
          font-size: 1rem;
          font-weight: 500;
          color: black;
        }
        .cart-items-container p {
          font-size: 0.8rem;
          font-weigth: 400;
        }
        .text-container {
          margin-left: 2rem;
        }
        .close-btn {
          border: none;
          border-radius: 50%;
          color: white;
          background-color: #232323;
          height: 20px;
          width: 20px;
          position: absolute;
          top: -10px;
          right: -10px;
          cursor: pointer;
        }
        .cart-item {
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
          padding-right: 3rem;
          position: relative;
          transition: all 800ms ease;
        }
        .cart-item.removed {
          animation: bye 800ms ease-out;
        }
        .cart-item img {
          height: 70px;
          width: 70px;
          object-fit: cover;
          border-radius: 8px;
        }
        .cart-items-container {
          border-top: 2px solid gray;
          padding-top: 2rem;
          display: flex;
          flex-direction: column;
          transition: all 1s ease;
          width: 100%;
        }
        .delete-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 10px;
          right: 0px;
          width: 20px;
          height: 20px;
          border-radius: 15px;
          cursor: pointer;
          border: 2px solid #ec3b3b;
          font-weigth: 600;
          color: #ec3b3b;
        }
        form {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
        }
        form div {
          margin-left: 2rem;
          display: flex;
          align-items: center;
          jutify-content: center;
          flex-direction: column;
          margin-top: 5rem;
        }
        input,
        select {
          background-color: white;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 20px;
          margin-bottom: 2rem;
          box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.2);
        }
        input:focus {
          border: 1px solid gray;
        }
        #mercadoForm .mercadopago-button {
          font-family: "Poppins";
          padding: 0.8rem;
          border: none;
          color: white;
          background-color: gray;
          font-weight: 600;
          font-size: 1rem;
          border-radius: 20px;
          cursor: pointer;
        }

        @keyframes appear {
          0% {
            transform: translateY(100px);
            opacity: 0;
          }
          100% {
            transform: translateY(0px);
            opacity: 1;
          }
        }
        @keyframes bye {
          0% {
            transform: translateY(0px);
            opacity: 1;
          }
          100% {
            transform: translateX(200px);
            opacity: 0;
          }
        }
        @media (max-width: 1200px) {
          h1 {
            font-size: 1rem;
          }
          nav {
            width: 80%;
          }
        }
        @media (max-width: 500px) {
          .cart {
            width: 100%;
            min-height: 80vh;
            top: unset;
            right: unset;
            bottom: 0%;
            left: 0%;
          }
          .close-btn {
            top: 30px;
            right: 30px;
          }
          .cart-items-container {
            width: 100%;
          }
          .cart-items-container::-webkit-scrollbar {
            display: none;
          }
          form div {
            margin-left: 0rem;
          }
          form div:nth-child(2) {
            margin-top: unset;
          }
          .buttons-container button {
            width: 100%;
            margin-left: unset;
            margin-bottom: 1rem;
          }
          .buttons-container button:nth-child(2) {
            margin-top: 1rem;
          }
          span {
            text-align: center;
            font-size: 1rem;
            margin-bottom: 3rem;
          }
          .empty-cart {
            font-size: 1rem;
            margin-bottom: 3rem;
          }
        }
      `}</style>
    </Fragment>
  );
}
