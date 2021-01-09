import axios from "axios";
import React, { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import NavBar from "../../components/NavBar";

export default function NewProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    categories: [],
    bestSeller: false,
    type: [],
  });
  const [categories, setCategories] = useState([]);
  const [selecCategories, setSelecCategories] = useState([]);
  const [updater, setUpdater] = useState(false);
  const router = useRouter();

  const { id } = router.query;

  if (product === null) {
    router.push("/admin");
  }

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.post("/api/getProduct", { id: id });
      setProduct(res.data.data);
      setSelecCategories(res.data.data.categories);
    };
    fetchProduct();

    axios.get("/api/getCategories").then((res) => {
      setCategories(res.data.data[0].list);
    });
  }, []);

  const onFormSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.put("/api/products", { id: id, product: product });
    router.push("/admin");
  };
  console.log(product);
  return (
    <Fragment>
      <NavBar />
      <section id="new">
        <h3>Editar producto</h3>
        <h4
          onClick={async () => {
            await axios.delete("/api/products", { data: { id: id } });
            router.push("/admin");
          }}
        >
          Eliminar producto
        </h4>
        <form onSubmit={onFormSubmit}>
          <label>Nombre</label>
          <input
            name="product_name"
            className="text-field"
            onChange={(e) => {
              setProduct((Rest) => {
                return { ...Rest, name: e.target.value };
              });
            }}
            value={product.name}
          />
          <label>Descripción</label>
          <input
            name="product_description"
            className="text-field"
            onChange={(e) => {
              setProduct((rest) => {
                return {
                  ...rest,
                  description: e.target.value,
                };
              });
            }}
            value={product.description}
          />

          <label>Todas las Categorías</label>
          <div className="categorias">
            {categories.map((cat, index) => {
              return (
                <div
                  className="tipo"
                  onClick={(e) => {
                    let prevSelec = selecCategories;
                    prevSelec.push(cat);
                    setSelecCategories(prevSelec);
                    setUpdater(!updater);
                  }}
                >
                  {cat}
                </div>
              );
            })}
          </div>
          <label>Categorias seleccionadas</label>
          <div className="categorias">
            {selecCategories.map((cat, index) => {
              return (
                <div className="tipo">
                  {cat}
                  <div
                    onClick={() => {
                      let prevSelec = selecCategories;
                      prevSelec.splice(index, 1);
                      setSelecCategories(prevSelec);
                      setUpdater(!updater);
                    }}
                  >
                    -
                  </div>
                </div>
              );
            })}
          </div>
          <label>Precio</label>
          <input
            type="number"
            name="product_price"
            className="text-field"
            onChange={(e) => {
              setProduct((rest) => {
                return {
                  ...rest,
                  price: e.target.value,
                };
              });
            }}
            value={product.price}
          />
          <label>Foto</label>
          <input
            name="product_picture"
            className="text-field"
            onChange={(e) => {
              setProduct((rest) => {
                return {
                  ...rest,
                  picture: e.target.value,
                };
              });
            }}
            value={product.picture}
          />
          <label>Nuevo Tipo</label>
          <div className="new-type">
            <input name="product_picture" className="text-field" />
            <div
              className="add-type"
              onClick={(e) => {
                if (e.target.parentElement.children[0].value === "") {
                  return;
                } else {
                  let typePrev = product.type;
                  typePrev.push(e.target.parentElement.children[0].value);
                  setProduct((rest) => {
                    e.target.parentElement.children[0].value = "";
                    return {
                      ...rest,
                      type: typePrev,
                    };
                  });
                  // setUpdater(!updater);
                }
              }}
            >
              +
            </div>
          </div>
          <label>Tipo de producto</label>
          <div className="tipos">
            {product.type.map((t, index) => {
              return (
                <div className="tipo">
                  {t}{" "}
                  <div
                    onClick={(e) => {
                      let typePrev = product.type;
                      typePrev.splice(index, 1);
                      setProduct((rest) => {
                        e.target.parentElement.children[0].value = "";
                        return {
                          ...rest,
                          type: typePrev,
                        };
                      });
                      // setUpdater(!updater);
                    }}
                  >
                    -
                  </div>
                </div>
              );
            })}
          </div>
          <div
            className={`checkbox ${product.bestSeller ? "selected" : ""}`}
            onClick={(e) => {
              setProduct((rest) => {
                return {
                  ...rest,
                  bestSeller: !product.bestSeller,
                };
              });
            }}
            value={product.bestSeller}
          >
            <p>Más vendidos?</p>
          </div>
          <button>Guardar Cambios</button>
        </form>
      </section>
      <style jsx>{`
        #new {
          min-height: 90vh;
          width: 80%;
          margin: auto;
          margin-top: 10vh;
          margin-bottom: 10vh;
          display: flex;
          align-items: column;
          justify-content: flex-start;
          flex-direction: column;
          padding-top: 3rem;
        }
        .new-type {
          display: flex;
        }
        .categorias {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
        }
        .add-type {
          width: 30px;
          height: 30px;
          background: white;
          box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
          align-items: center;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 15px;
          margin-left: 20px;
          cursor: pointer;
        }
        .new-type input {
          width: 350px;
        }
        form {
          display: flex;
          padding: 2rem;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        input,
        select {
          padding: 0.5rem 1rem;
          background: white;
          border: none;
          width: 400px;
          margin-bottom: 2rem;
          box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
          border-radius: 20px;
        }
        .checkbox {
          padding: 1rem;
          box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
          border-radius: 20px;
          margin-top: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .tipos {
          display: flex;
          flex-wrap: wrap;
        }
        .tipo {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          border: 2px solid #dbdbdb;
          color: black;
          margin: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tipo div {
          width: 20px;
          height: 20px;
          border-radius: 15px;
          margin-left: 20px;
          cursor: pointer;
          background: #ec3b3b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weigth: 600;
          color: white;
        }
        .checkbox.selected {
          background: gray;
          color: white;
        }
        .checkbox.selected p {
          background: gray;
          color: white;
        }
        h3 {
          text-align: center;
        }
        h4 {
          text-align: center;
          font-size: 1rem;
          cursor: pointer;
          color: red;
          margin-top: 3rem;
          text-decoration: underline;
        }
        button {
          padding: 1rem;
          color: #66e13b;
          border: 2px solid #66e13b;
          border-radius: 30px;
          background-color: white;
          margin-top: 2rem;
          cursor: pointer;
        }
        @media (max-width: 600px) {
          input,
          select {
            width: 100%;
          }
          .new-type input {
            width: 100%;
          }
          form {
            padding: unset;
          }
        }
      `}</style>
    </Fragment>
  );
}
