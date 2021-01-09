import React, { Fragment, useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";

export default function success() {
  const router = useRouter();
  const { status, status_detail, payment_id, order_id } = router.query;

  return (
    <Fragment>
      <section id="success">
        <h2>ERROR. Estado de la operación: {status_detail}.</h2>
      </section>
      <style jsx>{`
        #success {
          width: 70%;
          margin: auto;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }
        span {
          font-size: 1rem;
          color: gray;
          font-weight: 400;
          margin-top: 2rem;
        }
        h2 {
          font-size: 1.5rem;
          margin-bottom: 2rem;
        }
        h3 {
          color: black;
          font-weight: 600;
          align-self: flex-end;
        }
        p {
          align-self: flex-start;
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
      `}</style>
    </Fragment>
  );
}
