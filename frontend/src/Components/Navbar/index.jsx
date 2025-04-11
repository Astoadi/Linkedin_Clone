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
            <h1 style={{cursor:"pointer"}} onClick={()=>router.push("/")}>Pro connect</h1>
            <div className={styles.navbarOptionContainer}>
               
               {authState.profileFetched && <div>
                
                <div style={{display:"flex",gap:"1.2rem"}}>
                    {/* <p>Hey, {authState.user?.userId?.name || "User"}</p> */}
                    <p style={{fontWeight:"bold",cursor:"pointer"}} onClick={()=>router.push('/profile')}>Profile</p>
                    {authState.profileFetched && 
                    <p style={{cursor:"pointer",fontWeight:"bolder"}} onClick={handleLogOutUser}>LogOut</p>
                    }
                </div>

                </div>}

                {!authState.profileFetched && <div onClick={()=>{
                    router.push("/login");
                }} className={styles.buttonJoin}>Be A Part</div>}
            </div>
        </div>
    </div>
    </>
  )
}
