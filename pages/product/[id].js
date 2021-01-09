import React, { Fragment, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import NavBarCart from "../../components/NavBarCart";
import UserContext from "../../UserContext";
import axios from "axios";
import LoadingComponent from "../../components/LoadingComponent";

export default function Product() {
  const { cart, count, handleCart } = useContext(UserContext);
  const [product, setProduct] = useState({});
  const [type, setType] = useState(null);
  const router = useRouter();
  const [anim, setAnim] = useState(0);
  const { id } = router.query;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    axios.post("/api/getProduct", { id: id }).then((res) => {
      setProduct(res.data.data);
      setReady(true);
    });
  }, []);

  return (
    <Fragment>
      {ready ? (
        <Fragment>
          <NavBarCart cart={cart} children />
          <section id="product-page">
            <div className="image-container">
              <img src={product ? product.picture : ""} />
            </div>
            <div className="text-container">
              <h2>{product ? product.name : ""}</h2>
              <p>{product ? product.description : ""}</p>
              <span>
                {product.type.length > 0 ? "Selecciona un modelo: " : ""}
              </span>
              <div className="types">
                {product
                  ? product.type.map((t) => {
                      return (
                        <div
                          className={`${t === type ? "selected" : ""} type`}
                          onClick={() => {
                            setType(t);
                          }}
                        >
                          {t}
                        </div>
                      );
                    })
                  : ""}
              </div>
              {(product && type !== null) || product.type.length === 0 ? (
                <button
                  className={`${anim === 0 ? "" : "anim"}`}
                  onClick={() => {
                    handleCart(product, type);
                    setAnim(1);
                  }}
                  onAnimationEnd={() => {
                    setAnim(0);
                  }}
                >
                  Añadir al carrito
                </button>
              ) : null}
            </div>
          </section>
        </Fragment>
      ) : (
        <Fragment>
          <div className="loading-page">
            <h3>Cargando...</h3>
          </div>
        </Fragment>
      )}
      <style jsx>{`
        #product-page {
          margin: auto;
          margin-top: 10vh;
          padding-bottom: 10vh;
          min-height: 90vh;
          width: 70%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .loading-page {
          min-height: 100vh;
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: center;
        }
        img {
          height: 80px;
        }
        .image-container {
          width: 50%;
          height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .text-container {
          margin-left: 3rem;
          width: 50%;
        }
        button {
          padding: 0.5rem 1rem;
          border: none;
          box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
          background: white;
          border-radius: 15px;
          margin-top: 2rem;
          cursor: pointer;
        }
        button.anim {
          animation: pop 1s ease;
        }
        .types {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: flex-start;
        }
        .text-container p {
          margin: 2rem 0rem;
        }
        .type {
          padding: 0.5rem 1rem;
          margin-right: 2rem;
          margin-top: 1rem;
          background: #ac916c;
          color: white;
          border-radius: 10px;
          cursor: pointer;
        }
        .type.selected {
          background: #4e3514;
          color: white;
        }
        @keyframes pop {
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        @media (max-width: 1500px) {
          h2 {
            font-size: 2rem;
          }
        }
        @media (max-width: 600px) {
          #product-page {
            flex-direction: column;
            justify-content: center;
          }
          .image-container img {
            object-fit: cover;
          }
          .image-container {
            width: 100%;
            height: 100%;
          }
          h2 {
            font-size: 1.5rem;
          }
          .text-container {
            margin-left: unset;
            margin-top: 4rem;
            width: 100%;
          }
        }
      `}</style>
    </Fragment>
  );
}
