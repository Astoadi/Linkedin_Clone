 import { getAllUsers } from '@/config/redux/action/authAction';
import DashBoardLayout from '@/layout/dashboardLayout'
import UserLayout from '@/layout/userLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import  styles from './styles.module.css';
import { useRouter } from 'next/router';

 export default function DiscoverPage() {

  const authState=useSelector((state)=>state.auth);
  const dispatch=useDispatch();
  const router=useRouter();

  useEffect(()=>{
    if(!authState.allProfilesFetched){
      dispatch(getAllUsers());
    }
  },[])

   return (
     <UserLayout>
        <DashBoardLayout>
            <div className={styles.discoverContainer}>
                <h1 style={{textAlign:"center"}}>Discover</h1>
                <div className={styles.allUserProfile}>
                  {authState.allProfilesFetched && authState.allUsers.map((user)=>{
                    return (
                      <div onClick={()=>router.push(`/view_profile/${user.userId.username}`)} className={styles.userProfileCard} key={user._id}>
                        <img className={styles.userProfileCard_image} src={user.userId.profilePictureUrl} alt="#" />
                        <div>
                          <h1>{user.userId.name}</h1>
                          <p>{user.userId.email}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
            </div>
        </DashBoardLayout>
     </UserLayout>
   )
 }
 