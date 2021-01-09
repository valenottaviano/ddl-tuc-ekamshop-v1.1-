import "../styles/globals.css";
import Head from "next/head";
import { Fragment, useState, useEffect } from "react";
import UserContext from "../UserContext";
import jwt from "jsonwebtoken";
import axios from "axios";
import { useRouter } from "next/router";
import FooterComponent from "../components/FooterComponent";

function MyApp({ Component, pageProps }) {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  const [cart, setCart] = useState([]);
  const [count, setCount] = useState({
    quantity: 0,
    totalPrice: 0,
    type: "",
  });
  const [updater, setUpdater] = useState(false);
  const [clientData, setClientData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    provincia: "",
    direccion: "",
  });
  const router = useRouter();

  const handleCart = (product, type) => {
    let cartArr = cart;
    let quantity = 1;
    let currProd = product;
    cartArr.forEach((prod, index) => {
      if (prod.product._id === product._id && prod.type === type) {
        quantity = prod.quantity + 1;
        currProd = prod.product;
        cartArr.splice(index, 1);
      }
    });
    cartArr.push({
      quantity: quantity,
      product: currProd,
      type: type,
    });
    setCart(cartArr);
    let quantities = cartArr.map((prod) => {
      return prod.quantity;
    });
    let sum = quantities.reduce((a, b) => {
      return a + b;
    });
    let priceSelec = cartArr.map((prod) => {
      return prod.product.price * prod.quantity;
    });
    let priceSum = priceSelec.reduce((a, b) => {
      return a + b;
    });
    setCount({
      quantity: sum,
      totalPrice: priceSum,
    });
  };
  const removeCart = (prod, index, type) => {
    let prevCart = cart;
    let quantity = prevCart[index].quantity;
    let product = prevCart[index].product;
    let newTotal = count.totalPrice;
    let totalQuantity = count.quantity;

    const insertItem = (i, element) => {
      prevCart.splice(index, 0, element);
    };

    if (quantity > 1) {
      quantity = quantity - 1;
      newTotal = newTotal - product.price;
      prevCart.splice(index, 1);
      insertItem(index, {
        quantity: quantity,
        product: product,
        type: type,
      });
    } else {
      newTotal = newTotal - product.price;
      prevCart.splice(index, 1);
    }

    setCart(prevCart);

    setCount({
      quantity: totalQuantity - 1,
      totalPrice: newTotal,
    });
    // setUpdater(!updater);
  };

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
        return;
      }

      setUserData({
        token: token,
        user: userRes.data.data.user,
      });
    };
    Authorization();
  }, []);
  return (
    <UserContext.Provider
      value={{
        userData,
        cart,
        count,
        clientData,
        setUserData,
        setCart,
        handleCart,
        removeCart,
        setClientData,
      }}
    >
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
          integrity="sha512-+4zCK9k+qNFUR5X+cKL9EIR+ZOhtIloNl9GIKS57V1MyNsYpYcUrUeQc9vNfzsWfV28IaLL3i96P9sdNyeRssA=="
          crossorigin="anonymous"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="icon" type="image/png" href="favicon.png" />
        <title>DDL Tuc | Productos Artesanales</title>
      </Head>
      <script src="https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js"></script>
      <Component {...pageProps} />
      <FooterComponent />
    </UserContext.Provider>
  );
}

export default MyApp;
