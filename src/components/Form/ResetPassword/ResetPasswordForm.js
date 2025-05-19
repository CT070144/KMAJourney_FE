import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import styles from './ResetPasswordForm.module.scss';
import Button from '~/components/Button';
import paths from '~/Config/routes';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { API_URL } from '~/Config/APIconfig';
const cx = classNames.bind(styles);

function ResetPasswordForm() {
    const userEmail = useSelector(state => state.email.email);

    
    const navigate = useNavigate();
      
   

   
    const ValidationSchema = Yup.object({
        newPassword: Yup.string().required('Mật khẩu là bắt buộc'),
        confirmPassword: Yup.string().required('Xác nhận mật khẩu là bắt buộc').oneOf([Yup.ref('newPassword'), null], 'Mật khẩu không khớp')
    });

    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: yupResolver(ValidationSchema),
        mode: 'onBlur'
    });

    const onSubmit = async (formData) => {
       
      
        try {
            const response = await axios.post(`${API_URL}/users/update-password`,{
                email: userEmail,
                newPassword: formData.newPassword
            }
               );

            const data = response.data;
            console.log(data.result.status);
            if(data.result.status == "success"){
                toast.success('Đổi mật khẩu thành công!');
                setTimeout(() => {
                    navigate(paths.login);
                }, 500);
            } else {
               toast.error('Đổi mật khẩu thất bại');
            }
        } catch (error) {
            
        
            toast.error('Lỗi server');
        }
    };
 
    return (
        <div className={cx('wrapper')}>
           
            <h1 className={cx('title')}>NEW PASSWORD</h1>
       
            <form className={cx('form')} onSubmit={handleSubmit(onSubmit)}>
                
                <div className={cx('form-group')}>
                    <label htmlFor="newPassword" className={cx('label')}>
                        New Password
                    </label>
                    <input 
                        type="password" 
                        id="newPassword" 
                        name="newPassword"
                        {...register('newPassword')}
                       
                        className={cx('input', { 'error': errors.newPassword })} 
                    />
                    {errors.newPassword && (
                        <span className={cx('message', 'error')}>{errors.newPassword.message}</span>
                    )}
                </div>
                <div className={cx('form-group')}>
                    <label htmlFor="confirmPassword" className={cx('label')}>
                        Confirm Password
                    </label>
                    <input 
                        type="password" 
                        id="confirmPassword" 
                        name="confirmPassword"
                        {...register('confirmPassword')}
                       
                      
                        className={cx('input', { 'error': errors.confirmPassword })} 
                    />
                    {errors.confirmPassword && (
                        <span className={cx('message', 'error')}>{errors.confirmPassword.message}</span>
                    )}
                </div>

                <div className={cx('btn-group')}>
                   
                    <Button 
                        small 
                        type="submit"  
                        primary 
                        className={cx('custom-btn')}
                       
                    >
                        SAVE
                    </Button>
                </div>
                
            </form>
        </div>
    );
}

export default ResetPasswordForm;
