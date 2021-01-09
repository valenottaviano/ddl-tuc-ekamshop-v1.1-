import React, { Fragment, useContext, useState, useEffect } from 'react'
import Link from 'next/link'
import UserContext from '../UserContext'

export default function NavBar({cart, children ,setSelecCat, setSearchTerm}) {

    const {count, setCart, handleCart, removeCart} = useContext(UserContext)
    let counter = count.quantity
    let totalPrice = count.totalPrice
    let type = cart.type
    const [cartActive, setCartActive] = useState(false)
    const [updater, setUpdater] = useState(false)

    return (
        <Fragment>
            <header>
                <nav>
                    <div className="logo-container" onClick={()=>{
                            document.querySelectorAll('.burger div').forEach(link=>{
                                link.classList.remove('toggle')
                            })
                            document.querySelector('.nav-links').classList.remove('active')
                        }}  >
                        <div onClick={()=>{
                            if(children){
                                return
                            }else{
                                setSelecCat(null)
                            }
                        }}><Link href="/"><img src={children? '../logo-text.svg' : './logo-text.svg'} className="icon-img"/></Link></div>
                    </div>

                    
                    <ul className="nav-links" 
                    onClick={()=>{
                        document.querySelector('body').classList.add('active')
                        document.querySelector('html').classList.add('active')
                        setCartActive(true)
                    }}>
                        <span>{counter}</span>
                        <img src={children? '../icon/cart.svg' : 'icon/cart.svg'}/>
                    </ul>
                </nav>
            </header>
            <div className={`cart-container ${cartActive ? 'active' :  ""}`}>
                <div className={`cart ${cartActive ? 'active' :  ""}`}>
                    <h2>Carrito de compra</h2>
                   <div className="cart-items-container">
                    {cart.map((prod,index)=>{
                            return <div className="cart-item">
                                        <div className="image-container">
                                            <img src={prod.product.picture}/>
                                        </div>
                                        <div className="text-container">
                                            <div>
                                                <h3>{prod.product.name} - {prod ? prod.type : ""} </h3>
                                                <p>Cantidad: {prod.quantity}</p>
                                                <p>Precio Un.: {prod.product.price}</p>
                                            </div>
                                        </div>
                                        <div className="delete-btn"
                                        onClick={(e)=>{
                                            removeCart(prod, index, prod.type)
                                            setUpdater(!updater)
                                        }}
                                        >
                                        -
                                        </div>
                                </div>
                        })}
                   </div>
                    <div className="total-text">
                        <h2>Total: ${totalPrice}</h2>
                    </div>
                    <Link href="/checkout">
                        <div className="checkout-btn"
                        onClick={()=>{
                            document.querySelector('body').classList.remove('active')
                            document.querySelector('html').classList.remove('active')
                            setCartActive(false)
                        }}>
                            <button className="checkout-button">Pagar</button>
                        </div>
                    </Link>
                    <button className="close-btn"
                    
                    onClick={()=>{
                        document.querySelector('body').classList.remove('active')
                        document.querySelector('html').classList.remove('active')
                        setCartActive(false)
                    }}
                    
                    

                    >X</button>
                </div>
            </div>
            <style jsx>
                {`
                    header{
                        min-height:10vh;
                        width:100%;
                        display:flex;
                        align-items:center;
                        position: fixed;
                        top:0%;
                        left: 0%;
                        z-index: 2;
                        background: #FFF9F1;
                    }
                    .icon-img{
                        height: 50px;
                        cursor: pointer;
                    }
                    nav{
                        width:70%;
                        margin:auto;
                        display: flex;
                        align-items:center;
                        justify-content:space-between;
                    }
                    .logo-container{
                        flex:1;
                        margin-right:1rem;
                    }
                    .nav-links{
                        display:flex;
                        align-items: center;
                        justify-content:space-between;
                        cursor:pointer;
                        transition:all 800ms ease;
                    }
                    .nav-links span{
                        margin-right:0.5rem;
                        color: #4E3514;
                    }
                    .cart-container{
                        opacity: 0;
                        pointer-events: none;
                        min-height:100vh;
                        width:100%;
                        background: rgba(0, 0, 0, 0.4);
                        backdrop-filter: blur(5px);
                        position:fixed;
                        top:0%;
                        left: 0%;
                        z-index: 2;
                        transition: all 400ms ease;
                    }
                    .cart-container.active{
                        opacity: 1;
                        pointer-events: all;
                    }
                    .cart{
                        position:fixed;
                        top:5%;
                        right:10%;
                        background-color: white;
                        padding: 2rem;
                        border-radius: 10px;
                        transition: 1s ease-in;

                    }
                    .cart.active{
                        animation: appear 800ms;
                    }
                    .cart h2{
                        font-size: 1.3rem;
                        font-weight: 500;
                        color: black;
                        margin-bottom: 2rem;
                    }
                    .cart h3{
                        font-size: 1rem;
                        font-weight: 500;
                        color: black;
                    }
                    .cart p{
                        font-size: 0.8rem;
                        font-weigth: 400;
                    }
                    .text-container{
                        margin-left: 2rem;
                    }
                    .close-btn{
                        border: none;
                        border-radius: 50%;
                        color: white;
                        background-color: #1E1E1E;
                        height:20px;
                        width:20px;
                        position: absolute;
                        top:-10px;
                        right:-10px;
                        cursor:pointer;
                    }
                    .cart-item{
                        display: flex;
                        align-items: center;
                        margin-bottom: 2rem;
                        padding-right: 3rem;
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
                        max-height:60vh;
                        border-top: 2px solid #AC916C;
                        padding-top: 2rem;
                        overflow-y:scroll;
                        -ms-overflow-style: none; 
                        scrollbar-width: none; 
                        display:flex;
                        flex-direction: column;
                        transition: all 1s ease;
                    }
                    .cart-items-container::-webkit-scrollbar {
                        display: none;
                    }
                    .delete-btn{
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        position:absolute;
                        top:10px;
                        right: 0px;
                        width: 20px;
                        height: 20px;
                        border-radius: 15px;
                        cursor: pointer;
                        border:2px solid #ec3b3b;
                        font-weigth: 600;
                        color: #ec3b3b;
                    }
                    .checkout-button{
                        width: 100%;
                        padding: 0.8rem;
                        border: none;
                        color: white;
                        background-color: #AC916C;
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
                    @media (max-width: 1200px){                        
                          h1{
                              font-size: 1rem;
                          }
                          nav{
                            width:80%;
                        }  
                    }
                    @media (max-width: 500px){
                        .cart{
                            width:100%;
                            min-height: 80vh;
                            top: unset;
                            right: unset;
                            bottom:0%;
                            left: 0%;
                            border-radius: 10px 10px 0px 0px;
                        }
                        .close-btn{
                            top: 30px;
                            right: 30px;
                        }
                        .cart-items-container{
                            width:100%;
                            height:60vh;
                            overflow-y:scroll;
                            padding: 2rem 0rem; 
                            -ms-overflow-style: none; 
                            scrollbar-width: none; 
                        }
                        .cart-items-container::-webkit-scrollbar {
                            display: none;
                        }
                    }
                `}
            </style>
        </Fragment>
    )
}
