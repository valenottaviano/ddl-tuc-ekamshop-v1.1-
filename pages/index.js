import React, { Fragment, useEffect, useState, useContext } from "react";
import SearchBar from "../components/SearchBar";
import NavBarCart from "../components/NavBarCart";
import UserContext from "../UserContext";
import axios from "axios";
import ProductPreview from "../components/ProductPreview";
import { useRouter } from "next/router";
import MainSection from "../components/MainSection";
import ProductsList from "../components/ProductsList";
import WhatsAppComponent from "../components/WhatsAppComponent";
import LoadingComponent from "../components/LoadingComponent";

export default function index() {
  const [products, setProducts] = useState([]);
  const { userData, setUserData, cart, setCart } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [selecCat, setSelecCat] = useState(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchingProducts = async () => {
      const fetchedProducts = await axios.get("/api/products");
      setProducts(fetchedProducts.data.data);
      setReady(true);
    };
    fetchingProducts();
  }, []);

  return (
    <Fragment>
      <NavBarCart
        cart={cart}
        setSearchTerm={setSearchTerm}
        setSelecCat={setSelecCat}
      />
      {/* <WhatsAppComponent /> */}

      {ready ? (
        <Fragment>
          <div className="search">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selecCat={selecCat}
              setSelecCat={setSelecCat}
            />
          </div>
          {searchTerm !== "" || selecCat !== null ? (
            <ProductsList
              products={products}
              searchTerm={searchTerm}
              categorie={selecCat}
            />
          ) : (
            <MainSection products={products} setSelecCat={setSelecCat} />
          )}
        </Fragment>
      ) : (
        <LoadingComponent />
      )}
      <style jsx>{`
        .search {
          min-height: 25vh;
          width: 70%;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 10vh;
        }
        @media (max-width: 600px) {
          .search {
            width: 90%;
          }
        }
      `}</style>
    </Fragment>
  );
}
