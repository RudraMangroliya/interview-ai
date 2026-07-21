import { createContext, useState, useEffect } from "react";
import { getMe, login as apiLogin, register as apiRegister, logout as apiLogout } from "./services/auth.api";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const cachedUser = localStorage.getItem("interview_ai_user")
            return cachedUser ? JSON.parse(cachedUser) : null
        } catch (e) {
            return null
        }
    })
    
    // If user exists in cache, don't show full-page loading block initially
    const [loading, setLoading] = useState(() => {
        return localStorage.getItem("interview_ai_user") ? false : true
    })

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await apiLogin({ email, password })
            if (data?.user) {
                setUser(data.user)
                localStorage.setItem("interview_ai_user", JSON.stringify(data.user))
                if (data.token) {
                    localStorage.setItem("token", data.token)
                }
            }
            return data
        } catch (err) {
            console.error(err)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await apiRegister({ username, email, password })
            if (data?.user) {
                setUser(data.user)
                localStorage.setItem("interview_ai_user", JSON.stringify(data.user))
                if (data.token) {
                    localStorage.setItem("token", data.token)
                }
            }
            return data
        } catch (err) {
            console.error(err)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await apiLogout()
        } catch (err) {
            console.error(err)
        } finally {
            setUser(null)
            localStorage.removeItem("interview_ai_user")
            localStorage.removeItem("token")
            setLoading(false)
        }
    }

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const data = await getMe()
                if (data?.user) {
                    setUser(data.user)
                    localStorage.setItem("interview_ai_user", JSON.stringify(data.user))
                } else {
                    setUser(null)
                    localStorage.removeItem("interview_ai_user")
                    localStorage.removeItem("token")
                }
            } catch (err) {
                setUser(null)
                localStorage.removeItem("interview_ai_user")
                localStorage.removeItem("token")
            } finally {
                setLoading(false)
            }
        }

        verifyUser()
    }, [])


    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, handleLogin, handleRegister, handleLogout }}>
            {children}
        </AuthContext.Provider>
    )
}