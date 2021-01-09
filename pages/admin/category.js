import axios from "axios";
import React, { Fragment, useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import { useRouter } from "next/router";

export default function category() {
  const [type, setType] = useState([]);
  const [categories, setCategories] = useState({
    id: null,
    list: [],
  });

  const [newCategories, setNewCategories] = useState([]);
  const [updater, setUpdater] = useState(false);

  const router = useRouter();

  useEffect(() => {
    axios.get("/api/getCategories").then((res) => {
      if (res.data.data[0]._id === undefined) {
        axios.post("/api/getCategories").then((res) => {
          console.log(res);
        });
      } else {
        setCategories({
          id: res.data.data[0]._id,
          list: res.data.data[0].list,
        });
      }
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const res = await axios.put("/api/getCategories", {
      id: categories.id,
      list: categories.list,
    });
    router.push("/admin");
  };

  return (
    <Fragment>
      <NavBar />
      <section id="set-categories">
        <form onSubmit={handleSave}>
          <label>Nueva Categoría</label>
          <div className="new-category-container">
            <input name="new-category" />
            <div
              className="new-category"
              onClick={(e) => {
                if (e.target.parentElement.children[0].value === "") {
                  return;
                } else {
                  let catPrev = categories.list;
                  catPrev.push(e.target.parentElement.children[0].value);
                  e.target.parentElement.children[0].value = "";
                  setCategories({
                    id: categories.id,
                    list: catPrev,
                  });
                  setUpdater(!updater);
                }
              }}
            >
              +
            </div>
          </div>
          <label>Categorías creadas</label>
          <br />
          {categories.list.map((cat, index) => {
            return (
              <div className="remove-container">
                <p>{cat}</p>
                <div
                  className="remove-category"
                  onClick={() => {
                    let catPrev = categories.list;
                    catPrev.splice(index, 1);
                    setCategories({
                      id: categories.id,
                      list: catPrev,
                    });
                    setUpdater(!updater);
                  }}
                >
                  -
                </div>
              </div>
            );
          })}
          <button>Guardar categorias</button>
        </form>
      </section>
      <style jsx>{`
        #set-categories {
          margin-top: 10vh;
          min-height: 90vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        input,
        select {
          padding: 0.5rem 1rem;
          background: white;
          border: none;
          width: 400px;
          box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
          border-radius: 20px;
        }
        .new-category {
          width: 20px;
          height: 20px;
          border-radius: 15px;
          margin-left: 20px;
          cursor: pointer;
          background: #3fbf3f;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weigth: 600;
          color: white;
        }
        .remove-category {
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
        .new-category-container {
          display: flex;
          align-items: center;
          margin: 2rem;
        }
        .remove-container {
          display: flex;
          margin: auto;
          align-items: center;
          justify-content: center;
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
        }
      `}</style>
    </Fragment>
  );
}
