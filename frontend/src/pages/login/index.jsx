import UserLayout from '@/layout/userLayout';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './style.module.css';
import { loginUser, registerUser } from '@/config/redux/action/authAction';
import { emptyMessage } from '@/config/redux/reducer/authReducer';

function LoginComponent() {
    const router=useRouter();

    const authState=useSelector((state)=>state.auth);
    
    const dispatch=useDispatch();

    const [userLoginMethod,setLoginMethod]=useState(false);

    const [username,setUsername]=useState("");
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const[password,setPassword]=useState("");

    useEffect(()=>{
        if(authState.loggedIn){
            router.push("/dashboard");
        }
    },[authState.loggedIn]);

    useEffect(()=>{
        dispatch(emptyMessage());
    },[userLoginMethod]);

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(emptyMessage());
        }, 2000);
    
        return () => clearTimeout(timer); // Cleanup function
    }, [authState.message]);
    

    // useEffect(()=>{
    //     if(localStorage.getItem("token")){
    //         router.push('/dashboard');
    //     }
    // },[])

    const handleRegister=async ()=>{
        await dispatch(registerUser({username,name,email,password}));
    }

    const handleLogin=async ()=>{
        await dispatch(loginUser({email,password}));
    }

    return ( 
        <>
            <UserLayout>
                <div className={styles.container}>
                    <div className={styles.cardContainer}>
                        <div className={styles.cardContainer_left}>
                            <p className={styles.cardleft_heading}>{userLoginMethod?"Sign In":"Sign Up"}</p>
                            {authState.message && (
                            <p style={{ color: authState.isError ? "red" : "green" }}>
                                {authState.message.message || authState.message}
                            </p>
                            )}
                            <div className={styles.inputContainers}>
                                {!userLoginMethod &&
                                <div className={styles.inputRow}>
                                    <input onChange={(e)=>setUsername(e.target.value.trim())} type="text" placeholder='Username' className={styles.inputField} />
                                    <input onChange={(e)=>setName(e.target.value.trim())} type="text" placeholder='Name' className={styles.inputField} />
                                </div>}
                                <input onChange={(e)=>setEmail(e.target.value.trim())} type="text" placeholder='Email' className={styles.inputField} />
                                <input onChange={(e)=>setPassword(e.target.value)} type="password" placeholder='Password' className={styles.inputField} />
                                <div onClick={()=>{
                                    if(userLoginMethod){
                                        handleLogin();
                                    }else{
                                        handleRegister();
                                    }
                                }} className={styles.buttonWithOutline}>
                                    <p>{userLoginMethod?"Sign In":"Sign Up"}</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.cardContainer_right}>
                            <div>
                                <p style={{whiteSpace:"nowrap"}}>{!userLoginMethod?"Already Have an Account?":"Don't Have an Account?"}</p>
                                <div onClick={()=>setLoginMethod(!userLoginMethod)} className={styles.buttonWithOutline}>
                                    <p>{!userLoginMethod?"Sign In":"Sign Up"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </UserLayout>
        </>
     );
}

export default LoginComponent;