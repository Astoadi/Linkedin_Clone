import { base_url, clientServer } from '@/config';
import DashBoardLayout from '@/layout/dashboardLayout';
import UserLayout from '@/layout/userLayout';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from './styles.module.css';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { get_all_posts } from '@/config/redux/action/postAction';
import { getConnectionsRequest, getMyConnectionRequests, sendConnectionRequest } from '@/config/redux/action/authAction';

export default function ViewProfilePage({userProfile}) {
  const router=useRouter();
  const postReducer=useSelector((state)=>state.posts);
  const dispatch=useDispatch();
  const authState=useSelector((state)=>state.auth);
  const [userPosts,setUserPosts]=useState([]);
  const [isCurrentUserInConnection,setIsCurrentUserInConnection]=useState(false);

  const [isConnectionNull,setIsConnectionNull]=useState(true);

  const getUserPost=async ()=>{
    await dispatch(get_all_posts());
    await dispatch(getConnectionsRequest({token:localStorage.getItem("token")}));
    await dispatch(getMyConnectionRequests({token:localStorage.getItem("token")}));
  }

  useEffect(()=>{
    let posts=postReducer.posts.filter((post)=>{
      return post.userId.username===router.query.username;
    })
    setUserPosts(posts);
  },[postReducer.posts]);

  useEffect(()=>{
    // console.log(authState.connections,userProfile.userId._id);
    if( authState.connections.some(user=>user.connectionId._id === userProfile.userId._id)){
      setIsCurrentUserInConnection(true);
      if(authState.connections.find(user=>user.connectionId._id === userProfile.userId._id).status_accepted === true){
        setIsConnectionNull(false);
      }
    }

    if(authState.connectionRequest.some((user)=>user.userId._id ===  userProfile.userId._id)){
      setIsCurrentUserInConnection(true);
      if(authState.connectionRequest.find((user)=>user.userId._id === userProfile.userId._id).status_accepted === true ){
        setIsConnectionNull(false);
      }
    }
  },[authState.connections,authState.connectionRequest]);

  useEffect(()=>{
    getUserPost();
  },[]);

  const searchParams=useSearchParams();

  return (
    <UserLayout>
      <DashBoardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img className={styles.backDrop} src={userProfile.userId.profilePictureUrl} alt="" />
          </div>
          <div className={styles.profileContainer_details}>
            <div className={styles.profileContainer_flex}>
              <div style={{flex:"0.8"}}>
                  <div style={{display:"flex",width:"fit-content",alignItems:"center",gap:"1.2rem"}}>
                    <h2>{userProfile.userId.name}</h2>
                    <p style={{color:"grey"}}>@{userProfile.userId.username}</p>
                  </div>
                  <div style={{display:"flex",gap:"1rem",alignItems:"center",textAlign:"center",justifyContent:"flex-start"}}>
                    {isCurrentUserInConnection ?
                      <button className={styles.connectedButton}>{isConnectionNull?"Pending":"Connected"}</button>
                      :
                      <button onClick={()=>{
                        dispatch(sendConnectionRequest({token:localStorage.getItem("token"),user_id:userProfile.userId._id}));
                      }} className={styles.connectBtn} >Connect</button> }
                      <svg onClick={async ()=>{
                        try{
                          const response=await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
                          window.open(`${base_url}/${response.data.message}`,"_blank");
                        }catch(error){
                            print("error")
                        }
                      }} style={{width:"1.5em",cursor:"pointer"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                  </div>
                    <div style={{marginTop:"0.4rem"}}>
                      <p>{userProfile.bio}</p>
                    </div>
              </div>

              <div style={{flex:"0.2"}}>
                    <h3 style={{textAlign:"start"}}>RecentActivity</h3>
                    {userPosts.map((post)=>{
                      return (
                        <div key={post._id} className={styles.postCard}>
                          <div className={styles.card}>
                            <div className={styles.card_profileContainer}>
                              {post.media !==''? <img src={post.mediaUrl} alt="#" />: <div style={{width:"3.4rem",height:"3.4rem"}}></div> }
                            </div>
                            <p>{post.body}</p>
                          </div>
                        </div>
                      )
                    })}
              </div>
            </div>
          </div>
          <div className={styles.workHistory}>
            <h4>Work History</h4>
            <div className={styles.workHistoryContainer}>
                    {
                      userProfile.pastWork.map((work,index)=>{
                        return (
                          <div key={index} className={styles.workHistoryCard}>
                            <p style={{fontWeight:"bold",display:"flex",alignItems:"center",gap:"0.8rem"}}>
                              {work.company} - {work.position}
                            </p>
                            <p>{work.years}</p>
                          </div>
                        )
                      })
                    }
            </div>
          </div>
        </div>
      </DashBoardLayout>
    </UserLayout>
  )
}

export async function getServerSideProps(context){
  const request=await clientServer.get('user/get_User_Profile_Based_On_Username/',{
    params:{
      username:context.query.username
    }
  });
  const response=await request.data;
  return {props:{userProfile:response.userProfile}}
}