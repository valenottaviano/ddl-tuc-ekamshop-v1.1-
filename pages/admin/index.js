import React, { Fragment, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import UserContext from "../../UserContext";
import axios from "axios";
import ProductPreview from "../../components/ProductPreview";
import NavBar from "../../components/NavBar";
import jwt from "jsonwebtoken";

export default function admin() {
  const router = useRouter();
  const { userData, setUserData } = useContext(UserContext);
  const [products, setProducts] = useState([]);

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
    const fetchingProducts = async () => {
      const fetchedProducts = await axios.get("/api/products");
      setProducts(fetchedProducts.data.data);
    };
    fetchingProducts();
  }, []);
  return (
    <Fragment>
      <NavBar />
      <section id="admin">
        <Link href="/admin/new">
          <div className="add-product">
            <span>+</span>
          </div>
        </Link>
        <div className="all-products">
          {products.map((p, key) => {
            return (
              <ProductPreview
                name={p.name}
                picture={p.picture}
                productId={p._id}
                key={key}
                price={p.price}
              />
            );
          })}
        </div>
      </section>
      <style jsx>{`
        #admin {
          min-height: 90vh;
          width: 80%;
          margin: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          margin-top: 10vh;
        }
        .add-product {
          padding: 1rem 2rem;
          box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
          border-radius: 15px;
          cursor: pointer;
          font-weight: 500;
          font-size: 2rem;
        }
        .all-products {
          width: 80%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 4rem;
        }
        @media (max-width: 600px) {
          #admin {
            width: 90%;
          }
          .all-products {
            width: 100%;
          }
        }
      `}</style>
    </Fragment>
  );
}
