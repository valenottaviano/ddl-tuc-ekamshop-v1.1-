import React, { Fragment } from 'react'

export default function LoadingComponent() {
    return (
        <Fragment>
            <div className="loading-page">
                {/* <img src="icon/spinner.svg" /> */}
                <h3>Cargando...</h3>
            </div>
            <style jsx>{`
            .loading-page{
                min-height:100vh;
                display:flex;
                width:100%;
                align-items:center;
                justify-content:center;
                background-color: transparent
            }
            img{
                height: 80px
            }
            `}</style>
        </Fragment>
    )
}
