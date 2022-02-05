import React, {useState, useRef, useEffect} from 'react';
import "./Updatepassword.css";
import {useSelector, useDispatch} from "react-redux";
import { clearErrors, loadUser, updatePassword } from "../../actions/userAction";
// import { useNavigate } from 'react-router';
import Loader from "../layout/Loader/Loader";
import {Link} from "react-router-dom";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import LockIcon from "@material-ui/icons/Lock";
import { useAlert } from "react-alert";
import { UPDATE_PASSWORD_RESET} from '../../constants/userConstants';
import MetaData from '../layout/MetaData';

const UpdatePassword = ({history}) => {

    const {user} = useSelector(state => state.user)
    const { error, isUpdated, loading } = useSelector((state) => state.profile);


    const dispatch = useDispatch()
    // const navigate = useNavigate()
    const alert = useAlert()
    
    const [oldPassword, setOldPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();


    const[avatar, setAvatar] = useState();
    const[avatarPreview, setAvatarPreview] = useState("/profile.png")

    const updatePasswordSubmit=(e)=>{
        e.preventDefault()
        const myForm = new FormData()

        myForm.set("oldPassword", oldPassword);
       myForm.set("newPassword", newPassword);
        myForm.set("confirmPassword", confirmPassword);

        dispatch(updatePassword(myForm))
    }

      
    useEffect(()=>{
        if(error){
           alert.error(error)
           dispatch(clearErrors())
        }
        if(isUpdated){
              alert.success("Profile Updated Successfully");
              dispatch(loadUser())
              history.push("/account")
              dispatch({
                  type:UPDATE_PASSWORD_RESET
              })
        }
    }, [dispatch,error,alert,isUpdated, history])
    return (
        <>
        {loading ? <Loader /> : (
             <>
             <MetaData  title=" Update Password"/>
              <div className='updatePasswordContainer'>
                  <div className='updatePasswordBox'>
                      <h2 className='updatePasswordHeading'> Change Password</h2>
                      <form
                             className="updatePasswordForm"
                             encType="multipart/form-data"
                             onSubmit={updatePasswordSubmit}
                      >
                       <div className="updatePassword">
                        <VpnKeyIcon />
                        <input
                            type="password"
                            placeholder="Old Password"
                            required
                            name="password"
                            value={oldPassword}
                            onChange={(e)=> setOldPassword(e.target.value)}
                        />
                    </div>
                    <div className="updatePassword">
                        <LockOpenIcon />
                        <input
                            type="password"
                            placeholder="New Password"
                            required
                            name="password"
                            value={newPassword}
                            onChange={(e)=> setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="updatePassword">
                        <LockIcon />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            required
                            name="password"
                            value={confirmPassword}
                            onChange={(e)=> setConfirmPassword(e.target.value)}
                        />
                    </div>
                     <input
                       type="submit"
                       value="Change password"
                       className="updatePasswordBtn"
                     />
                   </form>
     
                  </div>
              </div>
            </>
        )}
      </>
    )
}

export default UpdatePassword
