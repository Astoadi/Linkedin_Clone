import DashBoardLayout from '@/layout/dashboardLayout'
import UserLayout from '@/layout/userLayout'
import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { getAboutUser } from '@/config/redux/action/authAction';
import { useDispatch, useSelector } from 'react-redux';
import { get_all_posts } from '@/config/redux/action/postAction';
import { clientServer } from '@/config';

export default function ProfilePage() {
    const [userProfile,setUserProfile]=useState({});
    const [userPosts,setUserPosts]=useState([]);
    const [isWorkModalOpen,setIsWorkModalOpen]=useState(false);
    const [isEducationModalOpen,setIsEducationModalOpen]=useState(false);

    const dispatch=useDispatch();
    const authState=useSelector((state)=>state.auth);
    const postReducer=useSelector((state)=>state.posts);

    const [companyName,setCompanyName]=useState("");
    const [companyPos,setCompanyPos]=useState("");
    const [companyYears,setCompanyYears]=useState(null);

    const [schoolName,setSchoolName]=useState("");
    const [degreeName,setDegreeName]=useState("");
    const [fieldOfStudy,setFieldOfStudy]=useState("");

    // useEffect(()=>{
    //     dispatch(getAboutUser({token:localStorage.getItem("token")}));
    //     dispatch(get_all_posts());
    // },[]);

  const updateProfileData=async ()=>{
    const request =await clientServer.post('/user_update',{
      token:localStorage.getItem("token"),
      name:userProfile.userId.name
    });
    const response=await clientServer.post('/update_profile_data',{
      token:localStorage.getItem("token"),
      bio:userProfile.bio,
      currentPostion:userProfile.currentPostion,
      pastWork:userProfile.pastWork,
      education:userProfile.education
    });
    await dispatch(getAboutUser({token:localStorage.getItem("token")}));
  }

  const handleAddingWork=async ()=>{
    const response=await clientServer.post('/update_profile_data',{
      token:localStorage.getItem("token"),
      ...userProfile,
      pastWork:[
        ...userProfile.pastWork,
        {
          company: companyName,
          position: companyPos,
          years: companyYears
        }
      ]
    })
    setIsWorkModalOpen(false);
    await dispatch(getAboutUser({token:localStorage.getItem("token")}));
  }

  const handleAddingEducation=async ()=>{
    const response=await clientServer.post('/update_profile_data',{
      token:localStorage.getItem("token"),
      ...userProfile,
      education:[
        ...userProfile.education,
        {
          school: schoolName,
          degree: degreeName,
          fieldOfStudy: fieldOfStudy
        }
      ]
    })
    setIsEducationModalOpen(false);
    await dispatch(getAboutUser({token:localStorage.getItem("token")}));
  }

    useEffect(()=>{
        dispatch(getAboutUser({token:localStorage.getItem("token")}));
        dispatch(get_all_posts());
    },[])

    useEffect(()=>{
        if(authState.user!==undefined){
            setUserProfile(authState.user);
            let posts=postReducer.posts.filter((post)=>{
                return post.userId.username===authState.user.userId.username
              })
              setUserPosts(posts);
        }
    },[authState.user,postReducer.posts]);

    const updateProfilePicture=async (file)=>{
        const formData=new FormData();
        formData.append('profile_picture',file);
        formData.append('token',localStorage.getItem('token'));
        const response=await clientServer.post('update_profile_picture',formData,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        });
        await dispatch(getAboutUser({token:localStorage.getItem("token")}));
    }

  return (
    <UserLayout>
        <DashBoardLayout>
        {authState.user && userProfile.userId &&
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <label className={styles.backDrop_overlay} htmlFor="ProfilePictureEdit">Edit</label>
            <input onChange={(e)=>updateProfilePicture(e.target.files[0])} type="file" id='ProfilePictureEdit' hidden />
            <img className={styles.backDrop} src={userProfile.userId.profilePictureUrl} alt="" />
          </div>
          <div className={styles.profileContainer_details}>
            <div className={styles.profileContainer_main} style={{display:"flex",gap:"0.7rem"}}>
              <div style={{flex:"0.8"}}>
                  <div className={styles.profile_viewContainer} style={{display:"flex",width:"fit-content",alignItems:"center",gap:"1.2rem"}}>
                    <input className={styles.nameEdit} type="text" onChange={(e)=>{
                      setUserProfile({...userProfile,userId:{...userProfile.userId,name:e.target.value}});
                    }} value={userProfile.userId.name}/>
                    <p className={styles.profile_viewContainerUsername} style={{color:"grey"}}>@{userProfile.userId.username}</p>
                  </div>
                    <div style={{marginTop:"0.4rem"}}>
                      <textarea onChange={(e)=>{
                        setUserProfile({...userProfile,bio:e.target.value})
                      }} className={styles.bioPlaceHolder}  placeholder='Bio' rows={Math.max(3,Math.ceil(userProfile.bio.length/80))} value={userProfile.bio}></textarea>
                    </div>
              </div>

              <div style={{flex:"0.2"}}>
                    <h3 style={{textAlign:"center"}}>RecentActivity</h3>
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
          {authState.user != userProfile && <div onClick={()=>updateProfileData()} className={styles.updateButton}>Update Profile</div> }
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
            <button className={styles.addWorkButton} onClick={()=>{
                      setIsWorkModalOpen(true);
            }}>Add Work</button>
          </div>

          <div className={styles.workHistory}>
            <h4>Education</h4>
            <div className={styles.workHistoryContainer}>
                    {
                      userProfile.education.map((education,index)=>{
                        return (
                          <div key={index} className={styles.workHistoryCard}>
                            <p style={{fontWeight:"bold",display:"flex",alignItems:"center",gap:"0.8rem"}}>
                              {education.degree} - {education.fieldOfStudy}
                            </p>
                            <p>{education.school}</p>
                          </div>
                        )
                      })
                    }
            </div>
            <button className={styles.addWorkButton} onClick={()=>{
                      setIsEducationModalOpen(true);
                    }}>Add Education</button>
          </div>
          {isWorkModalOpen &&
          <div className={styles.addWorkContainer} onClick={()=>setIsWorkModalOpen(false)}>
              <div className={styles.addWorkContainer_main} onClick={(e)=>{
                e.stopPropagation();
              }}>
                <div className={styles.inputContainer}>
                  <input required className={styles.inputField} type="text" placeholder='Company' onChange={(e)=>setCompanyName(e.target.value)} />
                  <input required className={styles.inputField} type="text" placeholder='Position' onChange={(e)=>setCompanyPos(e.target.value)} />
                  <input required className={styles.inputField} type="number" placeholder='Years' onChange={(e)=>setCompanyYears(e.target.value)} />
                  <button onClick={()=>handleAddingWork()} style={{background:"#E4EFE7",cursor:"pointer"}} className={styles.inputField}>Add Work</button>
                </div>
              </div>
          </div>
        }
        {isEducationModalOpen &&
          <div className={styles.addWorkContainer} onClick={()=>setIsEducationModalOpen(false)}>
              <div className={styles.addWorkContainer_main} onClick={(e)=>{
                e.stopPropagation();
              }}>
                <div className={styles.inputContainer}>
                  <input required className={styles.inputField} type="text" placeholder='School' onChange={(e)=>setSchoolName(e.target.value)} />
                  <input required className={styles.inputField} type="text" placeholder='Degree' onChange={(e)=>setDegreeName(e.target.value)} />
                  <input required className={styles.inputField} type="text" placeholder='Field of Study' onChange={(e)=>setFieldOfStudy(e.target.value)} />
                  <button onClick={()=>handleAddingEducation()} style={{background:"#E4EFE7",cursor:"pointer"}} className={styles.inputField}>Add Education</button>
                </div>
              </div>
          </div>
        }
        </div>
        }
        </DashBoardLayout>
    </UserLayout>
  )
}
