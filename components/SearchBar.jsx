import React, {Fragment, useState , useEffect} from 'react'
import axios from 'axios'

export default function SearchBar({searchTerm, setSearchTerm, selecCat, setSelecCat}) {
    const [ categories , setCategories ] = useState([])

    useEffect(() => {
        axios.get('/api/getCategories').then(res=>{
            setCategories(res.data.data[0].list)
        })
        
    }, []);
    
    return (
        <Fragment>
            <div className="search-bar-container">    
                <p>Buscar productos</p>
                <div className="search-bar">
                    <img src="icon/search.svg" />
                    <input value={searchTerm} 
                        placeholder="Buscar..."
                        onChange={(e)=>{
                        setSearchTerm(e.target.value)
                    }}/>
                </div>
                <div className="categories-container">
                   {categories.map(cat=>{
                       return <div
                       className={`categorie ${selecCat === cat ? "selected" : '' }`}
                       onClick={()=>{
                        if(selecCat === cat){
                            setSelecCat(null)
                        }else{
                            setSelecCat(cat)
                        }
                        }}
                       >{cat}</div>
                   })}
                </div>
            </div>
            <style jsx>{`
                .categories-container{
                    width: 100;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    margin: 2rem 0rem;
                    flex-wrap: wrap;
                }
                .categorie{
                    padding: 0.5rem 1rem;
                    background: #F4F4F4;
                    border-radius: 15px;
                    margin: 0.5rem 0.5rem;
                    font-size: 0.8rem;
                    cursor: pointer;
                    color: white;
                    background-color: #AC916C;
                }
                p{
                    color: #4E3514
                }
                .categorie.selected{
                    color: white;
                    background: #4E3514;
                }
                .search-bar-container{
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    flex-direction: column;
                }
                .search-bar-container input{
                    padding: 0.5rem 1rem;
                    background: white;
                    border: none;
                    width:400px;
                    margin-left: 1rem;
                    background:white;
                }
                .search-bar{
                    margin-top: 2rem;
                    display:flex;
                    align-items: center;
                    padding: 1rem;
                    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
                    border-radius: 20px;
                    background-color: white;
                }
                .search-bar img{
                    width: 20px;
                }
                @media (max-width: 600px){
                    .search-bar-container input{
                        width:100%
                    }
                    .search-bar-container{
                        width:100%;
                    }
                }
            `}</style>
        </Fragment>
    )
}
