import React from 'react'
import './loader.scss'

const FullPageLoader = ({ message = "Loading your interview plan...", subtitle = "" }) => {
    return (
        <div className="fullpage-loader">
            <div className="simple-loader-box">
                <div className="simple-spinner" />
                <h3 className="simple-loader-title">{message}</h3>
                {subtitle && <p className="simple-loader-subtitle">{subtitle}</p>}
            </div>
        </div>
    )
}

export default FullPageLoader
