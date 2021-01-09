import React, { Fragment, useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import UserContext from '../UserContext'


export default function ProductPreview({picture, name, productId, price, product}) {
    const {userData, setUserData, cart ,handleCart} = useContext(UserContext)
    return (
        <Fragment>
            <Link href={`/product/${productId}`}>
                <div className="product-preview">
                    <img src={picture}/>
                    <div className="text-container">
                        <p>{name}</p>
                        <p>${price}</p>
                    </div>
                    {userData.user ? 
                    <Link href={`/edit/${productId}`}>
                        <div className="edit">
                            <img src="icon/pencil.svg"/>
                        </div>
                    </Link>:
                    ""
                    }
                    {/* <div className="add-cart" onClick={()=>{
                        handleCart(product)
                    }}>
                        <span>+</span>
                    </div> */}
                </div>
            </Link>
            <style jsx>{`
                .product-preview{
                    cursor: pointer;
                    padding:1rem;
                    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
                    border-radius: 20px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    flex-direction:column;
                    margin:1rem;
                    position:relative;
                    width: 300px;
                    min-height: 300px;
                    max-width: 500px;
                    background-color: white;
                    ${
                        userData.user ? "margin-bottom:3rem;" : ""
                    }
                }
                .product-preview img{
                    height:200px;
                    width: 200px;
                    object-fit:cover;
                    border-radius: 15px;
                }
                .product-preview p{
                    font-weight: 500;
                    margin-top: 1rem;
                }
                .text-container{
                    width:80%;
                    margin:auto;
                    display:flex;
                    align-items:flex-start;
                    justify-content:center;
                    flex-direction:column;
                }
                .edit img{
                    height: 20px;
                    width: 20px;
                    border-radius: unset;
                }
                .edit{
                    position: absolute;
                    bottom:-20px;
                    right:-20px;
                    padding: 0.8rem;
                    background:white;
                    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
                    border-radius: 50%;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    cursor: pointer;
                    
                }
                .add-cart{
                    position: absolute;
                    top:-20px;
                    right:-20px;
                    padding: 0.8rem;
                    background:white;
                    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
                    border-radius: 50%;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    cursor: pointer;
                    height: 50px;
                    width: 50px;
                }
                .add-cart span{
                    font-size:2rem;
                    pointer-events:none;
                    -webkit-touch-callout: none; 
                    -webkit-user-select: none; 
                    -khtml-user-select: none;
                    -moz-user-select: none; 
                    -ms-user-select: none; 
                    user-select: none;
                }
                @media (max-width: 400px) {
                    .product-preview img{
                        object-fit:cover;
                        border-radius: 15px;
                    }
                    .edit img{
                        border-radius: unset;
                    }
                }
            `}</style>
        </Fragment>
    )
}
