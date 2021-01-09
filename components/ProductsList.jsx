import React, { Fragment } from 'react'
import ProductPreview from './ProductPreview'

export default function ProductsList({products, searchTerm, categorie}) {
    let filtered = []

    //primer caso
    if(searchTerm !== "" && categorie === null){
        filtered = products.filter(val=>{
            if(val.name.toLowerCase().includes(searchTerm.toLowerCase())){
                return val
            }
        })
    }

    //segundo caso
    if(searchTerm === "" && categorie !== null){
        filtered = products.filter(prod =>{
            let catMatched = false
            let catMatch = prod.categories.map(prodCat=>{
                if(prodCat === categorie){
                    catMatched = true
                }
            })
            if(catMatched){
                return prod
            }
        })
    }


    //tercer y último caso
    if(searchTerm !== "" && categorie !== null){
        let preFilter = products.filter(val=>{
            if(val.name.toLowerCase().includes(searchTerm.toLowerCase())){
                return val
            }
        })
        filtered = preFilter.filter(prod =>{
            let catMatched = false
            let catMatch = prod.categories.map(prodCat=>{
                if(prodCat === categorie){
                    catMatched = true
                }
            })
            if(catMatched){
                return prod
            }
        })
    }

    const renderedProducts = filtered.map(f=>{
        return <ProductPreview picture={f.picture} productId={f._id} name={f.name} price={f.price} product={f}/>

    })
    return (
        <Fragment>
            <div className="search-results">
                {renderedProducts}
            </div>
            <style jsx>{`
                .search-results{
                    width: 90%;
                    margin: auto;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-wrap: wrap;
                    padding: 3rem 0rem;
                }
            `}</style>
        </Fragment>
    )
}
