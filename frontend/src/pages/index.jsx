import Head from "next/head";
import UserLayout from "@/layout/userLayout";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { clientServer } from "@/config";
export default function Home() {
  const router=useRouter();
  const startingServer=async ()=>{
    const response=await clientServer.get('/');
    console.log(response.data?.message);
  }
  const hanleGetStartedButtonClick=()=>{
    if(localStorage.getItem('token')){
      router.push('/dashboard');
    }else{
      router.push('/login')
    }
  }
  useEffect(()=>{
    startingServer();
  },[]);
  return (
    <>
    <UserLayout>
      <div className={styles.container}>
          <div className={styles.blurBg} />
        <div className={styles.mainContainer}>
        <div className={styles.mainCard}>
          <div className={styles.mainContainer_left}>
            <p className={styles.heroTitle}>
              Connect With Friends without Exaggeration
              </p>
            <p className={styles.subTagline}>Your Professional World, Reimagined.</p>
            <p className={styles.subTitle}>
              A True social media platform, with stories no blufs !
            </p>
            <div onClick={hanleGetStartedButtonClick} className={styles.buttonJoin}>
              <p >🚀 Get Started</p>
            </div>
          </div>
          <div className={styles.mainContainer_right}>
            <img src="/images/home_main_connection.jpg" alt="Connect With Friends" className={styles.heroImage}/>
          </div>
        </div>
      </div>
      </div>
    </UserLayout>
    </>
  );
}
