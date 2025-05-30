import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from './AddScore.module.scss';
import axios from 'axios';
import { API_URL } from '~/Config/APIconfig';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
const schema = yup.object().shape({
    ma_sinh_vien: yup.string().required('Mã sinh viên là bắt buộc'),
    ma_hoc_phan: yup.string().required('Mã học phần là bắt buộc'),
    diemThanhPhan1: yup.number()
        .required('Điểm thành phần 1 là bắt buộc')
        .transform((value, originalValue) => {
            return originalValue === '' ? undefined : value;
          })
        .min(0, 'Điểm không được nhỏ hơn 0')
        .max(10, 'Điểm không được lớn hơn 10'),
    diemThanhPhan2: yup.number()
        .required('Điểm thành phần 2 là bắt buộc')
        .transform((value, originalValue) => {
            return originalValue === '' ? undefined : value;
          })
        .min(0, 'Điểm không được nhỏ hơn 0')
        .max(10, 'Điểm không được lớn hơn 10'),
    diemThi: yup.number()
        .required('Điểm thi là bắt buộc')
        .transform((value, originalValue) => {
            return originalValue === '' ? undefined : value;
          })
        .min(0, 'Điểm không được nhỏ hơn 0')
        .max(10, 'Điểm không được lớn hơn 10'),
});

function AddScore() {
    const [studentName, setStudentName] = useState('');
    const [subjectName, setSubjectName] = useState('');
    const [diemTongKet, setDiemTongKet] = useState(0);
    const [diemChu, setDiemChu] = useState('');
    const [validForm, setValidForm] = useState(false);
    
    const fileInputRef = useRef(null);

    const { register, handleSubmit, watch, formState: { errors }, setError } = useForm({
        resolver: yupResolver(schema),
        mode: 'onBlur'
    });

    const watchDiemThanhPhan1 = watch('diemThanhPhan1');
    const watchDiemThanhPhan2 = watch('diemThanhPhan2');
    const watchDiemThi = watch('diemThi');

    useEffect(() => {
        if (watchDiemThanhPhan1 && watchDiemThanhPhan2 && watchDiemThi) {
            const tongKet = ((watchDiemThanhPhan1 * 0.7 + watchDiemThanhPhan2 * 0.3) * 0.3) + (watchDiemThi * 0.7);
            const diemTongKetValue = parseFloat(tongKet.toFixed(2));
            setDiemTongKet(diemTongKetValue);
            
            // Tính điểm chữ
            if (diemTongKetValue >= 9 && diemTongKetValue <= 10) {
                setDiemChu('A+');
            } else if (diemTongKetValue >= 8.5 && diemTongKetValue < 9) {
                setDiemChu('A');
            } else if (diemTongKetValue >= 7.8 && diemTongKetValue < 8.5) {
                setDiemChu('B+');
            } else if (diemTongKetValue >= 7.0 && diemTongKetValue < 7.8) {
                setDiemChu('B');
            } else if (diemTongKetValue >= 6.3 && diemTongKetValue < 7.0) {
                setDiemChu('C+');
            } else if (diemTongKetValue >= 5.5 && diemTongKetValue < 6.3) {
                setDiemChu('C');
            } else if (diemTongKetValue >= 4.8 && diemTongKetValue < 5.5) {
                setDiemChu('D+');
            } else if (diemTongKetValue >= 4.0 && diemTongKetValue < 4.8) {
                setDiemChu('D');
            } else if (diemTongKetValue < 4.0) {
                setDiemChu('F');
            } else {
                setDiemChu('Không xác định');
            }
        }
    }, [watchDiemThanhPhan1, watchDiemThanhPhan2, watchDiemThi]);

 

    const handleImport = () => {
      if(fileInputRef.current.files.length === 0){
      fileInputRef.current.click();}
      else{
        console.log(fileInputRef.current.files[0]);
      }
    };

    const checkStudent = async (ma_sinh_vien) => {
        
      
       try{
        const response = await axios.get(`${API_URL}/sinhvien/${ma_sinh_vien}`);
        
        setStudentName(response.data.result[0].ten_sinh_vien);
        setValidForm(true);
       }catch(error){
         setError('ma_sinh_vien', { message: 'Mã sinh viên không tồn tại' });
         setStudentName('');
         setValidForm(false);
       }
    };

    const checkSubject = async (ma_hoc_phan) => {
      try{
        const response = await axios.get(`${API_URL}/hocphan/${ma_hoc_phan}`);
        setSubjectName(response.data.result[0].ten_hoc_phan);
        setValidForm(true);
      }catch(error){
        setError('ma_hoc_phan', { message: 'Mã học phần không tồn tại' });
        setSubjectName('');
        setValidForm(false);
      }
    };

    const onSubmit = async (data) => {
        try {
            // Kiểm tra sinh viên
            const studentResponse = await axios.get(`${API_URL}/sinhvien/${data.ma_sinh_vien}`);
            if (!studentResponse.data.result[0]) {
                setError('ma_sinh_vien', { message: 'Mã sinh viên không tồn tại' });
                return;
            }
            setStudentName(studentResponse.data.result[0].ten_sinh_vien);

            // Kiểm tra học phần
            const subjectResponse = await axios.get(`${API_URL}/hocphan/${data.ma_hoc_phan}`);
            if (!subjectResponse.data.result[0]) {
                setError('ma_hoc_phan', { message: 'Mã học phần không tồn tại' });
                return;
            }
            setSubjectName(subjectResponse.data.result[0].ten_hoc_phan);

            // Thêm điểm tổng kết và điểm chữ vào data
            const tongKet = ((data.diemThanhPhan1 * 0.7 + data.diemThanhPhan2 * 0.3) * 0.3) + (data.diemThi * 0.7);
            const diemTongKetValue = parseFloat(tongKet.toFixed(2));
            
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
                diemTongKet: diemTongKetValue,
                diemChu: diemChuValue
            };
            console.log(submitData);

            const response = await axios.post(`${API_URL}/ketqua/add-score`, submitData);
            toast.success('Thêm điểm thành công');
            
            // Reset form
            setStudentName('');
            setSubjectName('');
            setDiemTongKet(0);
            setDiemChu('');
            
        } catch (error) {
            toast.error('Thêm điểm thất bại');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Nhập Điểm Học Phần</h2>
                <div className={styles.uploadSection}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className={styles.fileInput}
                        accept=".xlsx,.xls,.csv"
                    />
                    
                  
                        <button 
                            className={styles.importBtn}
                            onClick={handleImport}
                        >
                            Import
                        </button>
                    
                </div>
            </div>
            <div className={styles.content}>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.scoreForm}>
                    <div className={styles.formGroup}>
                        <label>Mã Sinh Viên:
                        {studentName && (
                            <span className={styles.info}>{" "+studentName}</span>
                        )}
                        </label>
                        <input
                            type="text"
                            {...register('ma_sinh_vien', {
                                onBlur: (e) => checkStudent(e.target.value)
                            })}
                        />
                        {errors.ma_sinh_vien && (
                            <span className={styles.error}>{errors.ma_sinh_vien.message}</span>
                        )}
                        
                    </div>

                    <div className={styles.formGroup}>
                        <label>Mã Học Phần: 
                        {subjectName && (
                            <span className={styles.info}>{" "+subjectName}</span>
                        )}
                        </label>
                        <input
                            type="text"
                            {...register('ma_hoc_phan', {
                                onBlur: (e) => checkSubject(e.target.value)
                            })}
                        />
                        {errors.ma_hoc_phan && (
                            <span className={styles.error}>{errors.ma_hoc_phan.message}</span>
                        )}
                        
                    </div>

                    <div className={styles.formGroup}>
                        <label>Điểm Thành Phần 1:</label>
                        <input
                            type="number"
                            step="0.1"
                            {...register('diemThanhPhan1')}
                        />
                        {errors.diemThanhPhan1 && (
                            <span className={styles.error}>{errors.diemThanhPhan1.message}</span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Điểm Thành Phần 2:</label>
                        <input
                            type="number"
                            step="0.1"
                            {...register('diemThanhPhan2')}
                        />
                        {errors.diemThanhPhan2 && (
                            <span className={styles.error}>{errors.diemThanhPhan2.message}</span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Điểm Thi:</label>
                        <input
                            type="number"
                            step="0.1"
                            {...register('diemThi')}
                        />
                        {errors.diemThi && (
                            <span className={styles.error}>{errors.diemThi.message}</span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Điểm Tổng Kết:</label>
                        <input
                            type="text"
                            value={diemTongKet}
                            readOnly
                            {...register('diemTongKet')}
                            className={styles.readOnlyInput}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Điểm Chữ:</label>
                        <input
                            type="text"
                            value={diemChu}
                            {...register('diemChu')}
                            readOnly
                            className={styles.readOnlyInput}
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                        Lưu Điểm
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddScore;