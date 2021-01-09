import React, { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

export default function OrderComponent({
    nombre,
    apellido,
    email,
    telefono,
    provincia,
    direccion,
    monto,
    cart,
    pagoId}) {
    
    const [status , setStatus] = useState('')
 
    useEffect(()=>{
        const fetchStatus = async ()=>{
            const data = await axios.get(`https://api.mercadopago.com/v1/payments/${pagoId}`,{
                headers: {
                    'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
                }})
                setStatus(data.data.status_detail)
        }
        if(pagoId === null){
            return
        }else{
            fetchStatus()
        }
    },[])
    return (
        <Fragment>
            <div className="order">
                {status === 'pending_contingency' ? <div className="order-status"></div> : null}
                <p><strong>Cliente:</strong> {nombre} {apellido}</p>

                <div className="telefono">
                    <p><strong>Teléfono:</strong> {telefono}</p>
                    {/* <img src="../icon/clipboard.svg" onClick={(e)=>{
                    }}/> */}
                    <Link href={`https://api.whatsapp.com/send?phone=549${telefono}`}><img src="../icon/wa-min.svg"/></Link>
                </div>

                {pagoId === null ? <p><strong>Orden de compra</strong></p> : <p><strong>Estado del pago:</strong> {status === "" ? "Cargando..." : status}</p>}
                <div className="cart-items-container">
                {cart.map((prod,index)=>{
                    

                return <div className="cart-item">
                        <div className="image-container">
                            <img src={prod.product.picture}/>
                        </div>
                        <div className="text-container">
                            
                            <span className="name-product">{prod.product.name} - {prod ? prod.type : ""} </span>
                            <p>Cantidad: {prod.quantity}</p>
                            <p>Precio Un.: {prod.product.price}</p>
                            
                            </div>
                        </div>
                })}
                </div>
                {direccion === "" && provincia === "" ? 
                <p>Retiro en sucursal</p>:
                <p>Envío a domicilio. <br/>
                <strong>Dirección:</strong> {direccion}. {provincia}</p> }
                <h3>Total: ${monto}</h3>
            </div>
            <style jsx>{`
            .number-handler{
            }
            .order-status{
                height: 20px;
                width: 20px;
                border-radius: 50%;
                background-color: orange;
                position:absolute;
                top: 10px;
                right: 10px;
            }
            .telefono{
                display:flex
            }
            .telefono p {
                flex:1;
                margin: 1rem 0rem;
            }
            .telefono img{
                margin-left: 1.5rem;
            }
            .order{
                background-color: white;
                padding: 1rem;
                margin: 1.5rem 0rem;
                box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
                border-radius: 20px;
                width:100%;
                position: relative;
            }
            .order h3{
                color: black; 
                font-weight: 500;
                text-align: right;
            }
            .text-container{
                margin-left: 2rem;
            }
            
            .cart-item{
                display: flex;
                align-items: center;
                margin-bottom: 2rem;
                position:relative;
                transition:all 800ms ease;
            }
            .cart-item.removed{
                animation: bye 800ms ease-out;
            }
            .cart-item img{
                height: 70px;
                width: 70px;
                object-fit:cover;
                border-radius: 8px;
            }
            .cart-items-container{
                border-top: 2px solid gray;
                padding-top: 2rem;
                display:flex;
                flex-direction: column;
                transition: all 1s ease;
            }
            .cart-item h2{
                font-size: 1.3rem;
                font-weight: 500;
                color: black;
                margin-bottom: 2rem;
            }
            .cart-item h3{
                font-size: 1rem;
                font-weight: 500;
                color: black;
            }
            .cart-item p{
                font-size: 0.8rem;
                font-weigth: 400;
            }
            .name-product {
                text-align:left;
                font-size: 1rem;
                font-weight: 500;
            }
            
            `}</style>
        </Fragment>
    )
}
