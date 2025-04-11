import { AcceptConnection, getMyConnectionRequests } from '@/config/redux/action/authAction';
import DashBoardLayout from '@/layout/dashboardLayout'
import UserLayout from '@/layout/userLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.css';
import { useRouter } from 'next/router';

export default function MyConnectionsPage() {
  const authState=useSelector((state)=>state.auth);
  const dispatch=useDispatch();
  const router=useRouter();
  useEffect(()=>{
    dispatch(getMyConnectionRequests({token:localStorage.getItem("token")}));
  },[]);

  useEffect(()=>{
    if(authState.connectionRequest.length !=0 ){
      console.log(authState.connectionRequest);
    }
  },[authState.connectionRequest]);

  return (
    <UserLayout>
        <DashBoardLayout>
            <div style={{display:"flex",flexDirection:"column",gap:"1.7rem"}}>
                <h4>My Connections</h4>
                {authState.connectionRequest.length === 0 && <h2>No Connection Requests</h2> }
                {authState.connectionRequest.length !=0 && authState.connectionRequest.filter((connection)=>connection.status_accepted ===  null).map((user,index)=>{
                  return (
                    <div onClick={()=>{
                      router.push(`/view_profile/${user.userId.username}`)
                    }} className={styles.userCard} key={index}>
                      <div style={{display:"flex",alignItems:"center",gap:"1.2rem",justifyContent:"space-between"}}>
                        <div className={styles.profilePicture}>
                          <img src={user.userId.profilePictureUrl} alt="" />
                        </div>
                        <div className={styles.userInfo}>
                          <h3>{user.userId.name}</h3>
                          <p>@{user.userId.username}</p>
                        </div>
                        <button onClick={async (e)=>{
                          e.stopPropagation();
                          await dispatch(AcceptConnection({token:localStorage.getItem("token"),requestId:user._id,action_type:"accept"}));
                          }} className={styles.connectedButton}>Accept</button>
                      </div>
                    </div>
                  )
                })}
                <h4>My Network</h4>
                {authState.connectionRequest.length !=0 && authState.connectionRequest.filter((connection)=>connection.status_accepted !==  null).map((user,index)=>{
                  return (
                    <div onClick={()=>{
                      router.push(`/view_profile/${user.userId.username}`)
                    }} className={styles.userCard} key={index}>
                      <div style={{display:"flex",alignItems:"center",gap:"1.2rem",justifyContent:"space-between"}}>
                        <div className={styles.profilePicture}>
                          <img src={user.userId.profilePictureUrl} alt="" />
                        </div>
                        <div className={styles.userInfo}>
                          <h3>{user.userId.name}</h3>
                          <p>@{user.userId.username}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
        </DashBoardLayout>
    </UserLayout>
  )
}
