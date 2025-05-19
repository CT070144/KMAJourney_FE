
import styles from './RegisterForm.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import { useNavigate } from 'react-router-dom';
import paths from '~/Config/routes';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { API_URL } from '~/Config/APIconfig';
const cx = classNames.bind(styles);


function RegisterForm() {
    const navigate = useNavigate();
    
    const ValidationSchema = Yup.object({
        fullName: Yup.string().required('Họ tên là bắt buộc'),
        dateOfBirth: Yup.date().nullable()
            .transform((value, originalValue) => (originalValue === '' ? null : value)).required('Ngày sinh là bắt buộc'),
        email: Yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
        phone: Yup.string().matches(/^[0-9]+$/, 'Số điện thoại không hợp lệ').required('Số điện thoại là bắt buộc'),
        gender: Yup.string().required('Giới tính là bắt buộc'), 
        userName: Yup.string().min(6, 'Tên đăng nhập phải có ít nhất 6 ký tự').required('Tên đăng nhập là bắt buộc'),
        passWord: Yup.string().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái, số và ký tự đặc biệt').required('Mật khẩu là bắt buộc'),
        confirmPassword: Yup.string().oneOf([Yup.ref('passWord'), null], 'Mật khẩu không khớp').required('Xác nhận mật khẩu là bắt buộc')
    });

    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: yupResolver(ValidationSchema),
        mode: 'onBlur'
    });

    const onSubmit = async (data) => {
        console.log(data);
        try {
            const response = await fetch(`${API_URL}/users/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            
            if (response.status === 400) {
                if (responseData.message === "Email existed") {
                    console.log("Email đã tồn tại");
                    toast.error('Email đã tồn tại!');
                    setError('email', {
                        type: 'manual',
                        message: 'Email này đã được đăng kí'
                    });
                } else if (responseData.message === "User existed") {
                    console.log("Tên đăng nhập đã tồn tại");
                    toast.error('Tên đăng nhập đã tồn tại!');
                    setError('userName', {
                        type: 'manual',
                        message: 'Tên đăng nhập đã tồn tại'
                    });
                }
                return;
            }

            toast.success('Đăng ký thành công!');
            navigate(paths.login);

        } catch (error) {
            toast.error('Đăng ký thất bại: ' + error.message);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('title')}>Đăng Ký</h2>
            <form className={cx('form')} onSubmit={handleSubmit(onSubmit)}>
                <div className={cx('form-group')}>
                    <label className={cx('label')}>Họ tên</label>
                    <input
                        type="text"
                        className={cx('input')}
                        {...register('fullName')}
                        placeholder="Nhập họ tên"
                    />
                    {errors.fullName && <span className={cx('message')}>{errors.fullName.message}</span>}
                </div>

                <div className={cx('form-group')}>
                    <label className={cx('label')}>Ngày sinh</label>
                    <input
                        type="date"
                        className={cx('input', cx('date-input'))}
                        {...register('dateOfBirth')}
                        max="2025-12-31"
                        min="1900-01-01"
                    />
                    {errors.dateOfBirth && <span className={cx('message')}>{errors.dateOfBirth.message}</span>}
                </div>

                <div className={cx('form-group')}>
                    <label className={cx('label')}>Email</label>
                    <input
                        type="email"
                        className={cx('input')}
                        {...register('email')}
                        placeholder="Nhập email"
                    />
                    {errors.email && <span className={cx('message')}>{errors.email.message}</span>}
                </div>

                <div className={cx('form-group')}>
                    <label className={cx('label')}>Số điện thoại</label>
                    <input
                        type="tel"
                        className={cx('input')}
                        {...register('phone')}
                        placeholder="Nhập số điện thoại"
                    />
                    {errors.phone && <span className={cx('message')}>{errors.phone.message}</span>}
                </div>

                <div className={cx('form-group')}>
                    <label className={cx('label')}>Giới tính</label>
                    <div className={cx('radio-group')}>
                        <label className={cx('radio-label')}>
                            <input
                                type="radio"
                                value="male"
                                {...register('gender')}
                                className={cx('radio-input')}
                            />
                            <span className={cx('radio-text')}>Nam</span>
                        </label>
                        <label className={cx('radio-label')}>
                            <input
                                type="radio"
                                value="female"
                                {...register('gender')}
                                className={cx('radio-input')}
                            />
                            <span className={cx('radio-text')}>Nữ</span>
                        </label>
                        <label className={cx('radio-label')}>
                            <input
                                type="radio"
                                value="other"
                                {...register('gender')}
                                className={cx('radio-input')}
                            />
                            <span className={cx('radio-text')}>Khác</span>
                        </label>
                    </div>
                    {errors.gender && <span className={cx('message')}>{errors.gender.message}</span>}
                </div>

                <div className={cx('form-group')}>
                    <label className={cx('label')}>Tên đăng nhập</label>
                    <input
                        type="text"
                        className={cx('input')}
                        {...register('userName')}
                        placeholder="Nhập tên đăng nhập"
                    />
                    {errors.userName && <span className={cx('message')}>{errors.userName.message}</span>}
                </div>

                <div className={cx('form-group')}>
                    <label className={cx('label')}>Mật khẩu</label>
                    <input
                        type="password"
                        className={cx('input')}
                        {...register('passWord')}
                        placeholder="Nhập mật khẩu"
                    />
                    {errors.passWord && <span className={cx('message')}>{errors.passWord.message}</span>}
                </div>

                <div className={cx('form-group')}>
                    <label className={cx('label')}>Xác nhận mật khẩu</label>
                    <input
                        type="password"
                        className={cx('input')}
                        {...register('confirmPassword')}
                        placeholder="Nhập lại mật khẩu"
                    />
                    {errors.confirmPassword && <span className={cx('message')}>{errors.confirmPassword.message}</span>}
                </div>

                <div className={`${cx('btn-group')} ${cx('btn-group')}`}>
                    <Button primary large>Đăng Ký</Button>
                </div>
            </form>
        </div>
    );
}

export default RegisterForm; 