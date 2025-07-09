import React from 'react'
import styles from './styles.module.css'
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/config/redux/reducer/authReducer';

export default function NavBarComponent() {
    const router=useRouter();
    const dispatch=useDispatch();
    const authState=useSelector((state)=>state.auth);
    const handleLogOutUser=()=>{
        localStorage.removeItem("token");
        router.push('/login');
        dispatch(reset());
    }

  return (
    <>
    <div className={styles.container}>
        <div className={styles.navbar}>
            <h1 className={styles.logo} onClick={()=>router.push("/")}>🚀 ProConnect</h1>
            <div className={styles.navbarOptionContainer}>
               
               {authState.profileFetched ?(
                <div className={styles.navMenu}>
                    <p className={styles.greeting}>Hey, {authState.user?.userId?.name || "User"}</p>
                    <p className={styles.navLink} onClick={()=>router.push('/profile')}>Profile</p>
                    <p className={styles.logout} onClick={handleLogOutUser}>LogOut</p>
                </div>
               ):(
                <div onClick={()=>{
                    router.push("/login");
                }} className={styles.buttonJoin}>Be A Part
                </div>
               )}
            </div>
        </div>
    </div>
    </>
  )
}
