import styles from './VerifyForm.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import OtpInput from 'react-otp-input';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


import axios from 'axios';
import { useDispatch } from 'react-redux';
import paths from '~/Config/routes';
import { setEmail as setEmailRedux } from '~/store/slices/emailSlice';
import { API_URL } from '~/Config/APIconfig';





const cx = classNames.bind(styles);

function VerifyForm() {


    const dispatch = useDispatch();
    
    const [isOpen, setIsOpen] = useState(false);
    const [erroCode, setErrorCode] = useState('');
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [serverResponse, setServerResponse] = useState(null);
    const navigate  = useNavigate();
    useEffect(() => {
        Modal.setAppElement('#root');
    }, []);
   
    const openModal = async(e) => {
      
        e.preventDefault();
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Email không hợp lệ');
            return;
        }
        //Check email is exist
        try{
            const response = await axios.post(`${API_URL}/users/check-email`, {email: email});
            if(response.data.result.existed){
                setOtp('');
                setErrorCode('');
                setIsOpen(true);
                try {
                    const response = await axios.post(`${API_URL}/send-otp`, {email: email});
                    setServerResponse(response);
                    dispatch(setEmailRedux(email));
                    console.log(response);
                } catch (error) {
                   toast.error('Lỗi khi gửi mã xác nhận');
                }
            }
            else{
                setError('Email này chưa đăng ký tài khoản');
            }
        }
        catch(error){
            toast.error('Lỗi server');
        }

        
    };

    const closeModal = () => setIsOpen(false);

    const handleCodeSubmit = async (e) => {
        e.preventDefault();
      
        if (otp.length !== 6) {
            setErrorCode('Mã xác nhận không hợp lệ');
            return;
        }

        try {
            if (serverResponse.data.result.otp === otp) {
                toast.success('Xác thực thành công!');
                closeModal();
                navigate(paths.resetPassword);
            } else {
                setErrorCode('Mã xác nhận không đúng');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setErrorCode('Có lỗi xảy ra khi xác thực mã');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <h1 className={cx('title')}>Verify email</h1>
            <form className={cx('form')}>
                <div className={cx('form-group')}>
                    <label htmlFor="email" className={cx('label')}>
                        Enter your email
                    </label>
                    <br/>
                   
                    <input
                     onFocus={() => setError('')}
                      type="email"
                       id="email"
                        className={cx('input')} 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} />
                </div>
                {error && <span style={{color: 'red', fontSize: '2.2rem',textAlign: 'center'}} className={cx('error')}>{error}</span>}
                <div className={cx('btn-group')}>
                    <Button
                        medium
                        className={cx('custom-btn')}
                        type="button"
                        primary
                        onClick={openModal}
                    >
                        Get new password
                    </Button>
                </div>
            </form>

            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                className={cx('modal')}
                overlayClassName={cx('overlay')}
                ariaHideApp={false}
            >
                <h2>Enter verification code</h2>
                <br/>
                <span className={cx('notification')}>We sent a code to your email. Please enter code </span>
                <form onSubmit={handleCodeSubmit}>
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                       
                        numInputs={6}
                        inputType="tel"
                        renderSeparator={<span> - </span>}
                        renderInput={(props) => <input {...props} className={cx('otp-input')} />}
                    />
                    {erroCode && <span  className={cx('errorCode')}>{erroCode}</span>}
                    <div className={cx('btn-group')}>
                        <Button type="submit" className={cx('custom-btn-confirm')} >
                            Verify
                        </Button>
                        <Button type="button" onClick={closeModal}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default VerifyForm;
