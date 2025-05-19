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
  useEffect(()=>{
    startingServer();
  },[]);
  return (
    <>
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer_left}>
            <p>Connect With Friends without Exaggeration</p>
            <p>A True social media platform, with stories no blufs !</p>
            <div onClick={()=>{
              router.push("/login")
            }} className={styles.buttonJoin}>
              <p>Join Now</p>
            </div>
          </div>
          <div className={styles.mainContainer_right}>
            <img src="/images/home_main_connection.jpg"/>
          </div>
        </div>
      </div>
    </UserLayout>
    </>
  );
}
