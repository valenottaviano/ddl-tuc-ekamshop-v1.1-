import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import ProductPreview from '../components/ProductPreview'

export default function MainSection({products, setSelecCat}) {
    const [categories, setCategories] = useState([])
    let bestSellers = []
    
    bestSellers = products.filter(val=>{
        if(val.bestSeller){
            return val
        }else{
            return
        }
    })

    useEffect(()=>{
        axios.get('/api/getCategories').then(res=>{
            setCategories(res.data.data[0].list)
        })
    },[])

    return (
        <Fragment>
            <div className="main-section">
                {bestSellers.length !== 0 ?
                <Fragment>
                    <h3>Más vendidos</h3>
                        <div className="all-products">
                        {products.map((p, key) => {
                            if (p.bestSeller) {
                            return (
                                <ProductPreview
                                name={p.name}
                                picture={p.picture}
                                productId={p._id}
                                key={key}
                                price={p.price}
                                product={p}
                                />
                            );
                            }
                            return;
                        })}
                        </div>
                </Fragment>:
                ""
                }
                {categories.map(cat=>{
                    let filteredArray = products.filter(prod =>{
                        let catMatched = false
                        let catMatch = prod.categories.map(prodCat=>{
                            if(prodCat === cat){
                                catMatched = true
                            }
                        })
                        if(catMatched){
                            return prod
                        }
                    })
                    // console.log(filteredArray)
                    
                    let renderedProducts = filteredArray.map((prod,key)=>{
                        if(key<4){
                            return <ProductPreview
                            name={prod.name}
                            picture={prod.picture}
                            productId={prod._id}
                            price={prod.price}
                            product={prod}
                            key={key}
                            />
                        }
                    })
                    
                    // let handleRender = ()=>{
                    //     if(filteredArray.length > 5){
                    //         for(let i = 0; i > 5 ; i++){
                    //             renderedProducts.push(
                    //                 <ProductPreview
                    //                 name={filteredArray[i].name}
                    //                 picture={filteredArray[i].picture}
                    //                 productId={filteredArray[i]._id}
                    //                 price={filteredArray[i].price}
                    //                 product={filteredArray[i]}
                    //                 key={i}
                    //                 /> 
                    //             )
                    //         }
                    //     }else{
                    //         renderedProducts = filteredArray.map((prod,key)=>{
                    //             return <ProductPreview
                    //             name={prod.name}
                    //             picture={prod.picture}
                    //             productId={prod._id}
                    //             price={prod.price}
                    //             product={prod}
                    //             key={key}
                    //             />
                    //         })
                    //     }
                    // }
                    // handleRender()
                    console.log(renderedProducts)
                    return (
                        <Fragment>
                            {filteredArray.length > 0 ? 
                            <Fragment>
                                <h3>{cat}</h3>
                                <div className="categories-container">
                                    {
                                        renderedProducts
                                    }
                                </div>
                                <p
                                className="ver-todos"
                                onClick={()=>{
                                    setSelecCat(cat)
                                    window.scrollTo(0, 0)
                                }}
                                >{filteredArray.length > 4 ? `Ver los ${filteredArray.length} productos...` : ''}</p>
                            </Fragment>
                                 : 
                            null
                            }
                        </Fragment>
                    )
                })}
                <h3>Todos los productos</h3>
                <div className="all-products">
                {products.map((p, key) => {
                    return (
                    <ProductPreview
                        name={p.name}
                        picture={p.picture}
                        productId={p._id}
                        key={key}
                        price={p.price}
                        product={p}
                    />
                    );
                })}
                </div>
            </div>
            <style jsx>{`
            h3{
                color: #4E3514
            }
            .ver-todos{
                text-align:center;
                margin-bottom: 2rem;
                cursor: pointer;
                font-size: 1.3rem;
            }
            .main-section {
                width: 70%;
                margin: auto;
            }
            .all-products {
                border-top: 2px solid #4E3514;
                width: 100%;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                flex-wrap: wrap;
                padding: 3rem 0rem;
            }
            .categories-container{
                border-top: 2px solid #4E3514;
                width: 100%;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                flex-wrap: wrap;
                padding: 3rem 0rem;
            }
            @media (max-width: 600px) {
                .main-section {
                    width: 90%;
                }
                .all-products, .categories-container{
                    justify-content:center;
                }
                h3{
                    font-size: 1rem;
                }
                .all-products{
                    justify-content:center;
                }
            }
            `}</style>
        </Fragment>
    )
}
