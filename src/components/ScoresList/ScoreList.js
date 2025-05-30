import React, { useState } from 'react';
import styles from './ScoresList.module.scss';
import classNames from 'classnames/bind';
import axios from 'axios';
import { API_URL } from '~/Config/APIconfig';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

const editScoreSchema = yup.object().shape({
    diemThanhPhan1: yup.number()
        .required('Điểm thành phần 1 là bắt buộc')
        .min(0, 'Điểm không được nhỏ hơn 0')
        .max(10, 'Điểm không được lớn hơn 10'),
    diemThanhPhan2: yup.number()
        .required('Điểm thành phần 2 là bắt buộc')
        .min(0, 'Điểm không được nhỏ hơn 0')
        .max(10, 'Điểm không được lớn hơn 10'),
    diemThi: yup.number()
        .required('Điểm thi là bắt buộc')
        .min(0, 'Điểm không được nhỏ hơn 0')
        .max(10, 'Điểm không được lớn hơn 10'),
});

function ScoreList() {
    const [scores, setScores] = useState([]);
    const [studentCode, setStudentCode] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedScore, setSelectedScore] = useState(null);

    const { register: registerEdit, handleSubmit: handleSubmitEdit, formState: { errors: errorsEdit }, reset: resetEdit } = useForm({
        resolver: yupResolver(editScoreSchema)
    });

    const handleSearch = async () => {
        if (!studentCode) {
            toast.error('Vui lòng nhập mã sinh viên');
            return;
        }
        

        try {
            const response = await axios.get(`${API_URL}/ketqua/${studentCode}`);
            setScores(response.data.result.diem);
        } catch (error) {
            toast.error('Không tìm thấy kết quả');
            setScores([]);
        }
    };

    const handleEdit = (score) => {
        setSelectedScore(score);
        resetEdit({
            diemThanhPhan1: score.diem_thanh_phan1,
            diemThanhPhan2: score.diem_thanh_phan2,
            diemThi: score.diem_thi
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = (score) => {
        setSelectedScore(score);
        setIsDeleteModalOpen(true);
    };

    const onSubmitEdit = async (data) => {
        try {
            // Tính điểm tổng kết
            const tongKet = ((data.diemThanhPhan1 * 0.7 + data.diemThanhPhan2 * 0.3) * 0.3) + (data.diemThi * 0.7);
            const diemTongKetValue = parseFloat(tongKet.toFixed(2));
            
            // Tính điểm chữ
            let diemChuValue = '';
            if (diemTongKetValue >= 9 && diemTongKetValue <= 10) {
                diemChuValue = 'A+';
            } else if (diemTongKetValue >= 8.5 && diemTongKetValue < 9) {
                diemChuValue = 'A';
            } else if (diemTongKetValue >= 7.8 && diemTongKetValue < 8.5) {
                diemChuValue = 'B+';
            } else if (diemTongKetValue >= 7.0 && diemTongKetValue < 7.8) {
                diemChuValue = 'B';
            } else if (diemTongKetValue >= 6.3 && diemTongKetValue < 7.0) {
                diemChuValue = 'C+';
            } else if (diemTongKetValue >= 5.5 && diemTongKetValue < 6.3) {
                diemChuValue = 'C';
            } else if (diemTongKetValue >= 4.8 && diemTongKetValue < 5.5) {
                diemChuValue = 'D+';
            } else if (diemTongKetValue >= 4.0 && diemTongKetValue < 4.8) {
                diemChuValue = 'D';
            } else if (diemTongKetValue < 4.0) {
                diemChuValue = 'F';
            } else {
                diemChuValue = 'Không xác định';
            }

            const submitData = {
                ...data,
                ma_hoc_phan: selectedScore.ma_hoc_phan,
                diemTongKet: diemTongKetValue,
                diemChu: diemChuValue,
                ma_sinh_vien: studentCode
            };

            console.log(submitData);
            await axios.put(`${API_URL}/ketqua/update`, submitData);
            toast.success('Cập nhật điểm thành công');
            setIsEditModalOpen(false);
            handleSearch(); // Refresh data
        } catch (error) {
            toast.error('Cập nhật điểm thất bại');
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`${API_URL}/ketqua/${studentCode}/${selectedScore.ma_hoc_phan}`);
            toast.success('Xóa điểm thành công');
            setIsDeleteModalOpen(false);
            handleSearch(); // Refresh data
        } catch (error) {
            toast.error('Xóa điểm thất bại');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <div className={cx('searchBox')}>
                    <input
                        type="text"
                        placeholder="Nhập mã sinh viên"
                        value={studentCode}
                        onChange={(e) => setStudentCode(e.target.value)}
                    />
                    <button onClick={handleSearch}>Xem điểm</button>
                </div>
            </div>
            <div className={cx('content')}>
                <table className={cx('table')}>
                    <thead>
                        <tr>
                            <th>Tên học phần</th>
                            <th>Mã học phần</th>
                            <th>Điểm thành phần 1</th>
                            <th>Điểm thành phần 2</th>
                            <th>Điểm thi</th>
                            <th>Điểm tổng kết</th>
                            <th>Điểm chữ</th>
                            <th>Số tín chỉ</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.map((score, index) => (
                            <tr key={index}>
                                <td>{score.ten_hoc_phan}</td>
                                <td>{score.ma_hoc_phan}</td>
                                <td>{score.diem_thanh_phan1}</td>
                                <td>{score.diem_thanh_phan2}</td>
                                <td>{score.diem_thi}</td>
                                <td>{score.diem_tong_ket}</td>
                                <td>{score.diem_chu}</td>
                                <td>{score.soTinChi}</td>
                                <td>
                                    <div className={cx('actionButtons')}>
                                        <button className={cx('edit')} onClick={() => handleEdit(score)}>
                                            Sửa
                                        </button>
                                        <button className={cx('delete')} onClick={() => handleDelete(score)}>
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onRequestClose={() => setIsEditModalOpen(false)}
                className={cx('modal')}
                overlayClassName={cx('modalOverlay')}
            >
                <div className={cx('modalHeader')}>
                    <h2>Sửa điểm</h2>
                    <button onClick={() => setIsEditModalOpen(false)}>&times;</button>
                </div>
                <form onSubmit={handleSubmitEdit(onSubmitEdit)}>
                    <div className={cx('formGroup')}>
                        <label>Điểm thành phần 1:</label>
                        <input
                            type="number"
                            step="0.1"
                            {...registerEdit('diemThanhPhan1')}
                        />
                        {errorsEdit.diemThanhPhan1 && (
                            <span className={cx('error')}>{errorsEdit.diemThanhPhan1.message}</span>
                        )}
                    </div>
                    <div className={cx('formGroup')}>
                        <label>Điểm thành phần 2:</label>
                        <input
                            type="number"
                            step="0.1"
                            {...registerEdit('diemThanhPhan2')}
                        />
                        {errorsEdit.diemThanhPhan2 && (
                            <span className={cx('error')}>{errorsEdit.diemThanhPhan2.message}</span>
                        )}
                    </div>
                    <div className={cx('formGroup')}>
                        <label>Điểm thi:</label>
                        <input
                            type="number"
                            step="0.1"
                            {...registerEdit('diemThi')}
                        />
                        {errorsEdit.diemThi && (
                            <span className={cx('error')}>{errorsEdit.diemThi.message}</span>
                        )}
                    </div>
                    <div className={cx('modalFooter')}>
                        <button type="button" className={cx('cancel')} onClick={() => setIsEditModalOpen(false)}>
                            Hủy
                        </button>
                        <button type="submit" className={cx('submit')}>
                            Lưu
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onRequestClose={() => setIsDeleteModalOpen(false)}
                className={cx('modal')}
                overlayClassName={cx('modalOverlay')}
            >
                <div className={cx('modalHeader')}>
                    <h2>Xác nhận xóa</h2>
                    <button onClick={() => setIsDeleteModalOpen(false)}>&times;</button>
                </div>
                <p>Bạn có chắc chắn muốn xóa điểm của học phần {selectedScore?.ten_hoc_phan}?</p>
                <div className={cx('modalFooter')}>
                    <button className={cx('cancel')} onClick={() => setIsDeleteModalOpen(false)}>
                        Hủy
                    </button>
                    <button className={cx('submit')} onClick={handleConfirmDelete}>
                        Xóa
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default ScoreList;