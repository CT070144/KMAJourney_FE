import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.scss';
import Button from '~/components/Button';
import paths from '~/Config/routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faSpinner } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { API_URL } from '~/Config/APIconfig';
import { useState } from 'react';

const cx = classNames.bind(styles);

function LoginForm() {
    const [loading, setLoading] = useState(false);
   
    const navigate = useNavigate();
      
    const ValidationSchema = Yup.object(
        {
            username: Yup.string().required('Tên đăng nhập là bắt buộc'),
            password: Yup.string().required('Mật khẩu là bắt buộc')
        }
    )
   const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: yupResolver(ValidationSchema),
    mode: 'onBlur'
   });


    

    const onSubmit = (data) => {
        setLoading(true);
        setTimeout(async () => {
            try {
            
                const response = await fetch(`${API_URL}/auth/token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
    
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
    
                const dataResponse = await response.json();
                if(dataResponse.result.authenticated){
                   
                    toast.success('Đăng nhập thành công!');
                    setTimeout(() => {
                        navigate(paths.score);
                    }, 200);
                } else {
                   
                   setError('password', { message: 'Sai mật khẩu!' });
                    toast.error('Sai mật khẩu!');
                }
            } catch (error) {
                
            
                toast.error('Tài khoản không tồn tại');
            }
            finally{
                setLoading(false);
            }




        }, 800);
       
    };
 
    return (
        <div className={cx('wrapper')}>
           {loading&&<div className={cx('loading-container')}>
            <div className={cx('loading')} /> 
             <FontAwesomeIcon className={cx('loading-icon')} icon={faSpinner} spin />
           </div>}
            <h1 className={cx('title')}>LOGIN</h1>
            <form className={cx('form')} onSubmit={handleSubmit(onSubmit)}>
                <div className={cx('form-group')}>
                    <label htmlFor="username" className={cx('label')}>
                       Username
                    </label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username"
                        {...register('username')}
                     
                        
                        className={cx('input')} 
                    />
                    {errors.username && (
                        <span className={cx('message', 'error')}>{errors.username.message}</span>
                    )}
                </div>
                <div className={cx('form-group')}>
                    <label htmlFor="password" className={cx('label')}>
                        Password
                    </label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password"
                        {...register('password')}
                        
                        className={cx('input')} 
                    />
                    {errors.password && (
                <span className={cx('message', 'error')}>{errors.password.message}</span>
                    )}
                </div>

                <div className={cx('btn-group')}>
                    <Button 
                        medium
                        type="button"  
                        className={cx('custom-btn')} 
                        outline 
                        onClick={()=>navigate(paths.register)}
                    >
                        Create new account
                    </Button>
                    <Button 
                        medium 
                        type="submit"  
                        primary 
                        icon={<FontAwesomeIcon icon={faRightFromBracket} />}
                    >
                        LOGIN
                    </Button>
                </div>
                <div className={cx('form-group')}>
                    <Button type="button" className={cx('forgot-password')} onClick={()=>navigate(paths.verify)}>
                        Forgot password?
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;
