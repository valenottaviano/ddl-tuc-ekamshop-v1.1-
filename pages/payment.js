import React, { Fragment, useEffect, useState, useContext } from "react";
import UserContext from "../UserContext";
import axios from "axios";
import { useRouter } from "next/router";
import LoadingComponent from "../components/LoadingComponent";

export default function payment() {
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

  let doSubmit = false;

  const [currentToken, setCurrentToken] = useState();
  const [currentInstallments, setCurrentInstallments] = useState();
  const [updater, setUpdater] = useState(false);
  const [ready, setReady] = useState(true);

  const [identification, setIdentification] = useState({
    docType: "DNI",
    docNumber: "",
  });

  const [payer, setPayer] = useState({
    email: clientData.email,
    identification: identification,
  });

  const [formData, setFormData] = useState({
    transactionAmount: count.totalPrice,
    token: currentToken,
    description: "",
    installments: "",
    paymentMethodId: "",
    issuer: "",
    payer: payer,
  });

  // useEffect(() => {
  //   console.log(identification);
  // }, [identification]);

  useEffect(() => {
    window.Mercadopago.setPublishableKey(process.env.MERCADOPAGO_PUBLIC_KEY);

    window.Mercadopago.getIdentificationTypes();

    document
      .getElementById("cardNumber")
      .addEventListener("change", guessPaymentMethod);

    function guessPaymentMethod(event) {
      let cardnumber = document.getElementById("cardNumber").value;
      if (cardnumber.length >= 6) {
        let bin = cardnumber.substring(0, 6);
        window.Mercadopago.getPaymentMethod(
          {
            bin: bin,
          },
          setPaymentMethod
        );
      }
    }

    function setPaymentMethod(status, response) {
      if (status == 200) {
        let paymentMethod = response[0];
        setFormData((Rest) => {
          return {
            ...Rest,
            paymentMethodId: paymentMethod.id,
          };
        });
        document.getElementById("paymentMethodId").value = paymentMethod.id;
        getIssuers(paymentMethod.id);
      } else {
        alert(
          `Verifica el número de tarjeta! Recuerda ingresarlo sin espacios entre los dígitos.`
        );
      }
    }

    function getIssuers(paymentMethodId) {
      window.Mercadopago.getIssuers(paymentMethodId, setIssuers);
    }

    function setIssuers(status, response) {
      if (status == 200) {
        let issuerSelect = document.getElementById("issuer");
        response.forEach((issuer) => {
          let opt = document.createElement("option");
          opt.text = issuer.name;
          opt.value = issuer.id;
          issuerSelect.appendChild(opt);
        });

        getInstallments(
          document.getElementById("paymentMethodId").value,
          document.getElementById("transactionAmount").value,
          issuerSelect.value
        );
      } else {
        alert(`issuers method info error: ${response}`);
      }
    }

    function getInstallments(paymentMethodId, transactionAmount, issuerId) {
      window.Mercadopago.getInstallments(
        {
          payment_method_id: paymentMethodId,
          amount: parseFloat(transactionAmount),
          issuer_id: parseInt(issuerId),
        },
        setInstallments
      );
    }

    function setInstallments(status, response) {
      if (status == 200) {
        document.getElementById("installments").options.length = 0;
        response[0].payer_costs.forEach((payerCost) => {
          let opt = document.createElement("option");
          opt.text = payerCost.recommended_message;
          opt.value = payerCost.installments;
          document.getElementById("installments").appendChild(opt);
        });
      } else {
        alert(`installments method info error: ${response}`);
      }
    }

    document
      .getElementById("paymentForm")
      .addEventListener("submit", getCardToken);
    function getCardToken(event) {
      event.preventDefault();
      if (!doSubmit) {
        let $form = document.getElementById("paymentForm");
        window.Mercadopago.createToken($form, setCardTokenAndPay);
        return false;
      }
    }

    function setCardTokenAndPay(status, response) {
      if (status == 200 || status == 201) {
        let form = document.getElementById("paymentForm");
        let card = document.createElement("input");
        card.setAttribute("name", "token");
        card.setAttribute("type", "hidden");
        card.setAttribute("id", "currentToken");
        card.setAttribute("value", response.id);
        form.appendChild(card);
        setFormData((Rest) => {
          return {
            ...Rest,
            token: response.id,
          };
        });
        doSubmit = true;
        if (doSubmit) {
          submitForm();
        }
        // form.submit();
      } else {
        alert("Verifica completar todos los campos!");
      }
    }
  }, []);
  const submitForm = async () => {
    let tok = document.querySelector("#currentToken").value;
    let payId = document.getElementById("paymentMethodId").value;
    let ident = document.getElementById("docNumber").value;
    let install = document.getElementById("installments").value;
    let iss = document.getElementById("issuer").value;
    setReady(false);

    const res = await axios.post("/api/process_payment", {
      email: payer.email,
      transactionAmount: formData.transactionAmount,
      docType: identification.docType,
      docNumber: ident,
      issuer: iss,
      installments: install,
      paymentMethodId: payId,
      description: formData.description,
      token: tok,
    });

    console.log(res);

    if (res.data.status === "approved" || res.data.status === "in_process") {
      let orderIdResponse;

      axios
        .post("/api/orders", {
          totalPrice: count.totalPrice,
          cart: cart,
          email: clientData.email,
          clientData: clientData,
          pagoId: res.data.id,
        })
        .then((response) => {
          orderIdResponse = response.data.order._id;

          axios
            .post("/api/send-email", {
              to: clientData.email,
              clientData,
              monto: count.totalPrice,
              asunto: "Confirmación de compra!",
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
              asunto: "Nueva compra realizada!",
            })
            .then(console.log("Email Sent to the store"))
            .catch((error) => {
              console.log(error);
            });

          router.push(
            `/success?status=${res.data.status}&status_detail=${res.data.status_detail}&payment_id=${res.data.id}&order_id=${orderIdResponse}`
          );
        });
    } else {
      router.push(
        `/error?status=${res.data.status}&status_detail=${res.data.status_detail}&payment_id=${res.data.id}&order_id=null`
      );
    }
  };
  return (
    <Fragment>
      {ready ? (
        <Fragment>
          <form action="/api/process_payment" method="post" id="paymentForm">
            <div>
              <h3>Detalles del comprador</h3>
              <div>
                {/* <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="text"
                defaultValue={clientData.email}
                onChange={(e) => {
                  setClientData((Rest) => {
                    return {
                      ...Rest,
                      email: e.target.email,
                    };
                  });
                }}
              />
            </div> */}
                <div className="form-group">
                  <label htmlFor="docType">Tipo de documento</label>
                  <select
                    id="docType"
                    name="docType"
                    data-checkout="docType"
                    type="text"
                    onChange={(e) => {
                      setIdentification((Rest) => {
                        return {
                          ...Rest,
                          docType: e.target.value,
                        };
                      });
                      setPayer((Rest) => {
                        return {
                          ...Rest,
                          identification: identification,
                        };
                      });
                      setFormData((Rest) => {
                        return {
                          ...Rest,
                          payer: payer,
                        };
                      });
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="docNumber">Número de documento</label>
                  <input
                    id="docNumber"
                    name="docNumber"
                    data-checkout="docNumber"
                    type="text"
                    onChange={(e) => {
                      setIdentification((Rest) => {
                        return {
                          ...Rest,
                          docNumber: e.target.value,
                        };
                      });
                      setPayer((Rest) => {
                        return {
                          ...Rest,
                          identification: identification,
                        };
                      });
                      setFormData((Rest) => {
                        return {
                          ...Rest,
                          payer: payer,
                        };
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            <div>
              <h3>Detalles de la tarjeta</h3>
              <div>
                <div className="form-group">
                  <label htmlFor="cardholderName">Titular de la tarjeta</label>
                  <input
                    id="cardholderName"
                    data-checkout="cardholderName"
                    type="text"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor>Fecha de vencimiento</label>
                  <div>
                    <input
                      type="text"
                      placeholder="MM"
                      id="cardExpirationMonth"
                      data-checkout="cardExpirationMonth"
                      onselectstart="return false"
                      onpaste="return false"
                      oncopy="return false"
                      oncut="return false"
                      ondrag="return false"
                      ondrop="return false"
                      autoComplete="off"
                      className="vencimiento-input"
                    />
                    <span className="date-separator">/</span>
                    <input
                      type="text"
                      placeholder="YY"
                      id="cardExpirationYear"
                      data-checkout="cardExpirationYear"
                      onselectstart="return false"
                      onpaste="return false"
                      oncopy="return false"
                      oncut="return false"
                      ondrag="return false"
                      ondrop="return false"
                      autoComplete="off"
                      className="vencimiento-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="cardNumber">Número de la tarjeta</label>
                  <input
                    type="text"
                    id="cardNumber"
                    data-checkout="cardNumber"
                    onselectstart="return false"
                    onpaste="return false"
                    oncopy="return false"
                    oncut="return false"
                    ondrag="return false"
                    ondrop="return false"
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="securityCode">Código de seguridad</label>
                  <input
                    id="securityCode"
                    data-checkout="securityCode"
                    type="text"
                    onselectstart="return false"
                    onpaste="return false"
                    oncopy="return false"
                    oncut="return false"
                    ondrag="return false"
                    ondrop="return false"
                    autoComplete="off"
                  />
                </div>
                <div id="issuerInput" className="form-group">
                  <label htmlFor="issuer">Banco emisor</label>
                  <select id="issuer" name="issuer" data-checkout="issuer" />
                </div>
                <div className="form-group">
                  {/* <label htmlFor="installments">Cuotas</label> */}
                  <select type="hidden" id="installments" name="installments" />
                </div>
                <div className="form-group">
                  <input
                    type="hidden"
                    name="transactionAmount"
                    id="transactionAmount"
                    defaultValue={formData.transactionAmount}
                  />
                  <input
                    type="hidden"
                    name="paymentMethodId"
                    id="paymentMethodId"
                  />
                  <input type="hidden" name="description" id="description" />
                  <br />
                  <h2>Total: ${count.totalPrice}</h2>
                  {count.totalPrice !== 0 ? (
                    <button type="submit">Pagar</button>
                  ) : null}
                  <br />
                </div>
              </div>
            </div>
          </form>
        </Fragment>
      ) : (
        <LoadingComponent />
      )}
      <style jsx>{`
        form {
          display: flex;
          padding-top: 5rem;
          align-items: center;
          justify-content: space-around;
          flex-direction: row;
          width: 50%;
          margin: auto;
          min-height: 100vh;
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
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .vencimiento-input {
          width: 100px;
        }
        label {
          color: gray;
          margin: 1.5rem 0rem 0.5rem 0rem;
        }
        h3 {
          color: #393735;
          font-size: 1rem;
          font-weight: 600;
        }
        h2 {
          font-size: 1.5rem;
          margin-bottom: 3rem;
          text-align: end;
          width: 100%;
        }
        button {
          padding: 0.8rem 2rem;
          border: none;
          color: white;
          background-color: gray;
          font-weight: 600;
          font-size: 1rem;
          border-radius: 20px;
          cursor: pointer;
        }
        #installments {
          display: none;
        }
        @media (max-width: 1200px) {
          form {
            width: 80%;
          }
        }
        @media (max-width: 600px) {
          form {
            flex-direction: column;
          }
        }
      `}</style>
    </Fragment>
  );
}
