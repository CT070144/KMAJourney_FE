import classNames from 'classnames/bind';
import styles from './AddStudent.module.scss';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_URL } from '~/Config/APIconfig';

const cx = classNames.bind(styles);

const schema = yup.object({
    ma_sinh_vien: yup.string().required('Mã sinh viên là bắt buộc').max(8, 'Mã sinh viên tối đa 8 ký tự').transform(value => value ? value.trim() : value),
    ten_sinh_vien: yup.string().required('Tên sinh viên là bắt buộc').transform(value => value ? value.trim() : value),
    lop: yup.string().required('Lớp là bắt buộc').transform(value => value ? value.trim() : value),
    khoa: yup.string().required('Khoa là bắt buộc').transform(value => value ? value.trim() : value),
    trang_thai: yup.string().required('Trạng thái là bắt buộc').transform(value => value ? value.trim() : value),
});
Modal.setAppElement('#root');
function AddStudent() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data) => {
        setFormData(data);
        setIsModalOpen(true);
    };

    const handleConfirm = async () => {
        try {
            console.log(formData);
            const response = await axios.post(`${API_URL}/sinhvien/add`,formData);
            if (response.data.code === 100) {
                toast.success('Thêm sinh viên thành công!');
                setIsModalOpen(false);
                reset();
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('title')}>Thêm Sinh Viên</h2>
            <form onSubmit={handleSubmit(onSubmit)} className={cx('form')}>
                <div className={cx('form-group')}>
                    <label>Mã Sinh Viên</label>
                    <input
                        type="text"
                        {...register('ma_sinh_vien')}
                        className={cx('input')}
                    />
                    {errors.ma_sinh_vien && (
                        <span className={cx('error')}>{errors.ma_sinh_vien.message}</span>
                    )}
                </div>

                <div className={cx('form-group')}>
                    <label>Tên Sinh Viên</label>
                    <input
                        type="text"
                        {...register('ten_sinh_vien')}
                        className={cx('input')}
                    />
                    {errors.ten_sinh_vien && (
                        <span className={cx('error')}>{errors.ten_sinh_vien.message}</span>
                    )}
                </div>

                <div className={cx('form-group')}>
                    <label>Lớp</label>
                    <input
                        type="text"
                        {...register('lop')}
                        className={cx('input')}
                    />
                    {errors.lop && (
                        <span className={cx('error')}>{errors.lop.message}</span>
                    )}
                </div>

                <div className={cx('form-group')}>
                    <label>Khoa</label>
                    <input
                        type="text"
                        {...register('khoa')}
                        className={cx('input')}
                    />
                    {errors.khoa && (
                        <span className={cx('error')}>{errors.khoa.message}</span>
                    )}
                </div>

                <div className={cx('form-group')}>
                    <label>Trạng Thái</label>
                    <select {...register('trang_thai')} className={cx('select')}>
                        <option value="">Chọn trạng thái</option>
                        <option value="ĐANG HỌC">Đang học</option>
                        <option value="NGHỈ HỌC">Thôi học</option>
                        <option value="tot_nghiep">Đã tốt nghiệp</option>
                    </select>
                    {errors.trang_thai && (
                        <span className={cx('error')}>{errors.trang_thai.message}</span>
                    )}
                </div>

                <button type="submit" className={cx('submit-btn')}>
                    Tạo
                </button>
            </form>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className={cx('modal')}
                overlayClassName={cx('overlay')}
            >
                <div className={cx('modal-content')}>
                    <h3>Xác nhận thông tin sinh viên</h3>
                    {formData && (
                        <div className={cx('modal-info')}>
                            <p><strong>Mã Sinh Viên:</strong> {formData.ma_sinh_vien}</p>
                            <p><strong>Tên Sinh Viên:</strong> {formData.ten_sinh_vien}</p>
                            <p><strong>Lớp:</strong> {formData.lop}</p>
                            <p><strong>Khoa:</strong> {formData.khoa}</p>
                            <p><strong>Trạng Thái:</strong> {
                                formData.trang_thai === 'ĐANG HỌC' ? 'Đang học' :
                                formData.trang_thai === 'NGHỈ HỌC' ? 'Thôi học' :
                                'Đã tốt nghiệp'
                            }</p>
                        </div>
                    )}
                    <div className={cx('modal-buttons')}>
                        <button onClick={handleConfirm} className={cx('confirm-btn')}>
                            Xác nhận
                        </button>
                        <button onClick={closeModal} className={cx('cancel-btn')}>
                            Hủy
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default AddStudent;