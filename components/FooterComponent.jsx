import React, { Fragment } from 'react';
import Link from 'next/link'

const FooterComponent = () => {
    return (
        <Fragment>
            <footer>
            <div className="footer-container">
                <Link href="/"><img src="./logo.svg" className="logo-text"/></Link>
                <a className="ekam-logo" href="https://agenciaekam.com" >
                    <h4>Desarrollado por Agencia Ekam</h4>
                    <img src="icon/ekam.svg"/>
                </a>
            </div>
            </footer>
            <style jsx>
                {`
                    footer{
                        background-color: #B7A792; 
                    }
                    
                    .footer-container{
                        min-height:30vh;
                        width:80%;
                        margin:auto;
                        display:flex;
                        flex-direction:column;
                        justify-content:space-between;
                        align-items:center;
                        color: white;
                        text-align:center;
                        padding:3rem 0rem;
                    }
                    .footer-container h4{
                        font-size:1rem;
                        font-weight:400;
                        color: white;
                    }
                    .footer-container h1{
                        margin-bottom:3rem;
                        color: white;

                    }
                    .footer-container img{
                        height:30px;
                        margin-top: 1rem;
                        color: white;
                        cursor: pointer;
                    }
                    .footer-container .logo-text{
                        height:100px;
                        margin-bottom: 2rem;
                    }
                    .dashboard{
                        margin:3rem;
                        color:white;
                        font-size:1rem;
                    }
                `}
            </style>
        </Fragment>
    );
}

export default FooterComponent;

