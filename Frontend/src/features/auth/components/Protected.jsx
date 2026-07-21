import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'
import FullPageLoader from "../../../components/FullPageLoader";

const Protected = ({children}) => {
    const { loading, user } = useAuth()

    if(loading){
        return <FullPageLoader message="Verifying session..." />
    }


    if(!user){
        return <Navigate to={'/login'} />
    }
    
    return children
}

export default Protected