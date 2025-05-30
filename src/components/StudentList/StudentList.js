import styles from './StudentList.module.scss';
import classNames from 'classnames/bind';
import Button  from '~/components/Button';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { API_URL } from '~/Config/APIconfig';
import paths from '~/Config/routes';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const cx = classNames.bind(styles);

// Form validation schema
const editStudentSchema = yup.object().shape({
    ten_sinh_vien: yup.string().required('Tên sinh viên là bắt buộc')
    .transform(value => value ? value.trim() : value),
    lop: yup.string().required('Lớp là bắt buộc'),
    khoa: yup.string().required('Khoa là bắt buộc'),
    trang_thai: yup.string().required('Trạng thái là bắt buộc')
});

function StudentList() {
    // Mock data for classes and departments
    const classes = ['CT7A','CT7B', 'CT7C', 'AT19A', 'AT19E', 'DT6A', 'DT6B'];
    const departments = ['CNTT', 'ATTT', 'DTVT'];
    
    // State for students data and loading
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    // State cho filter
    const [filterType, setFilterType] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);
    const [refresh, setRefresh] = useState(false);
    
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(editStudentSchema)
    });

    // Fetch students data
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/sinhvien/student-list`);
                setStudents(response.data.result);
                setError(null);
            } catch (err) {
                setError('Failed to fetch students data');
                console.error('Error fetching students:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [refresh]);

    // Hàm xử lý lọc
    const handleFilter = () => {
        console.log('Lọc với:', {
            filterType,
            selectedClass,
            selectedDepartment
        });
        // TODO: Thực hiện logic lọc dữ liệu ở đây
    };

    // Hàm mở modal sửa
    const handleEdit = (student) => {
        setCurrentStudent(student);
        reset(student); // Reset form with student data
        setIsEditModalOpen(true);
    };
    // Hàm mở modal xoá
    const handleDelete = (student) => {
        setCurrentStudent(student);
        setIsDeleteModalOpen(true);
    };
    // Hàm đóng modal
    const closeModal = () => {
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setCurrentStudent(null);
    };
    // Hàm xử lý lưu chỉnh sửa
    const onSubmit = async (data) => {
        try {
            const response = await axios.put(`${API_URL}/sinhvien/update`, data);
            if (response.data.code === 100) {
                toast.success('Cập nhật sinh viên thành công');
                setRefresh(!refresh);
                closeModal();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật sinh viên');
        }
    };
    // Hàm xác nhận xoá (mock)
    const handleConfirmDelete = async () => {
        try{
            console.log(`${API_URL}/sinhvien/${currentStudent.ma_sinh_vien}`)
            const response = await axios.delete(`${API_URL}/sinhvien/${currentStudent.ma_sinh_vien}`);
            if(response.data.code === 100){
                toast.success('Xoá thành công sinh viên '+ currentStudent.ma_sinh_vien);
                setRefresh(!refresh);
                
            }
        }catch(error){
            toast.error(error.response.data.message);
        }
        closeModal();
    };
    // Hàm xử lý tìm kiếm
    const handleSearch = async () => {
        try {
            const response = await axios.get(`${API_URL}/sinhvien/${searchQuery}`);
            setStudents(response.data.result);
        } catch (err) {
           
        }
    };
    // Hàm xử lý huỷ tìm kiếm
    const handleCancel = () => {
        setSearchQuery('');
        setRefresh(!refresh);
     
    };

    return ( 
        <div className={cx('wrapper')}>
            <div className={cx('filter')}>
                <div className={cx('filter-item')}>
                    <label htmlFor="search" className={cx('label')}>Tìm kiếm</label>
                    <input type="text" id="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className={cx('input')} placeholder="Nhập tên hoặc mã sinh viên..." />
                    <Button outline className={cx('button')} onClick={handleSearch}>Tìm</Button>
                    <Button primary className={cx('button')} onClick={handleCancel}>Huỷ</Button>
                </div>
                <div className={cx('filter-item')}>
                    <label htmlFor="filterType" className={cx('label')}>Lọc</label>
                    <select
                        id="filterType"
                        className={cx('select')}
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                    >
                        <option value=""></option>
                        <option value="class">Lọc theo lớp</option>
                        <option value="department">Lọc theo khoa</option>
                    </select>
                    {filterType === 'class' && (
                        <>
                            <label htmlFor="class" className={cx('label')}>Chọn lớp</label>
                            <select
                                id="class"
                                className={cx('select')}
                                value={selectedClass}
                                onChange={e => setSelectedClass(e.target.value)}
                            >
                                <option value="">Tất cả</option>
                                {classes.map(cls => (
                                    <option key={cls} value={cls}>{cls}</option>
                                ))}
                            </select>
                        </>
                    )}
                    {filterType === 'department' && (
                        <>
                            <label htmlFor="department" className={cx('label')}>Chọn khoa</label>
                            <select
                                id="department"
                                className={cx('select')}
                                value={selectedDepartment}
                                onChange={e => setSelectedDepartment(e.target.value)}
                            >
                                <option value="">Tất cả</option>
                                {departments.map(dep => (
                                    <option key={dep} value={dep}>{dep}</option>
                                ))}
                            </select>
                        </>
                    )}
                    <Button outline className={cx('button')} onClick={handleFilter}>Lọc</Button>
                    <Button primary medium className={cx('add-button')} to={paths.addStudent}>
                        <FontAwesomeIcon icon={faPlus} className={cx('icon')}/>Thêm sinh viên
                    </Button>
                </div>
            </div>
            <div className={cx('content')}>
                {loading ? (
                    <div className={cx('loading')}> <FontAwesomeIcon spin icon={faSpinner} className={cx('icon')}/>Đang tải dữ liệu...</div>
                ) : error ? (
                    <div className={cx('error')}>{error}</div>
                ) : (
                    <div className={cx('table-container')}>
                        <table className={cx('table')}>
                            <thead>
                                <tr>
                                    <th>Mã sinh viên</th>
                                    <th>Tên sinh viên</th>
                                    <th>Lớp</th>
                                    <th>Khoa</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student.ma_sinh_vien}>
                                        <td>{student.ma_sinh_vien}</td>
                                        <td>{student.ten_sinh_vien}</td>
                                        <td>{student.lop}</td>
                                        <td>{student.khoa}</td>
                                        <td className={cx(student.trang_thai === 'ĐANG HỌC' ? 'trang_thai-active' : 'trang_thai-inactive')}>
                                            {student.trang_thai === 'ĐANG HỌC' ? 'Đang học' : 'Nghỉ học'}
                                        </td>
                                        <td className={cx('action-buttons')}>
                                            <Button outline className={cx('action-button','edit')} onClick={() => handleEdit(student)}>
                                                <FontAwesomeIcon icon={faPenToSquare} className={cx('icon')}/>Sửa
                                            </Button>
                                            <Button outline className={cx('action-button','delete')} onClick={() => handleDelete(student)}>
                                                <FontAwesomeIcon icon={faTrash} className={cx('icon')}/>Xoá
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {/* Modal sửa */}
                <Modal
                    isOpen={isEditModalOpen}
                    onRequestClose={closeModal}
                    className={cx('modal')}
                    overlayClassName={cx('modal-overlay')}
                    contentLabel="Chỉnh sửa sinh viên"
                >
                    <div className={cx('modal-content')}>
                        <h3>Chỉnh sửa sinh viên</h3>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className={cx('form-group')}>
                                <label>Mã sinh viên:</label>
                                <input 
                                    value={currentStudent?.ma_sinh_vien} 
                                    disabled 
                                    className={cx('form-control')}
                                />
                            </div>
                            <div className={cx('form-group')}>
                                <label>Tên sinh viên:</label>
                                <input 
                                    {...register('ten_sinh_vien')}
                                    className={cx('form-control', { 'is-invalid': errors.ten_sinh_vien })}
                                />
                                {errors.ten_sinh_vien && (
                                    <div className={cx('error-message')}>{errors.ten_sinh_vien.message}</div>
                                )}
                            </div>
                            <div className={cx('form-group')}>
                                <label>Lớp:</label>
                                <select 
                                    {...register('lop')}
                                    className={cx('form-control', { 'is-invalid': errors.lop })}
                                >
                                    {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                                </select>
                                {errors.lop && (
                                    <div className={cx('error-message')}>{errors.lop.message}</div>
                                )}
                            </div>
                            <div className={cx('form-group')}>
                                <label>Khoa:</label>
                                <select 
                                    {...register('khoa')}
                                    className={cx('form-control', { 'is-invalid': errors.khoa })}
                                >
                                    {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                                </select>
                                {errors.khoa && (
                                    <div className={cx('error-message')}>{errors.khoa.message}</div>
                                )}
                            </div>
                            <div className={cx('form-group')}>
                                <label>Trạng thái:</label>
                                <select 
                                    {...register('trang_thai')}
                                    className={cx('form-control', { 'is-invalid': errors.trang_thai })}
                                >
                                    <option value="ĐANG HỌC">Đang học</option>
                                    <option value="NGHỈ HỌC">Nghỉ học</option>
                                </select>
                                {errors.trang_thai && (
                                    <div className={cx('error-message')}>{errors.trang_thai.message}</div>
                                )}
                            </div>
                            <div className={cx('modal-actions')}>
                                <Button outline className={cx('action-button')} onClick={closeModal}>Huỷ</Button>
                                <Button primary className={cx('action-button')} type="submit">Lưu</Button>
                            </div>
                        </form>
                    </div>
                </Modal>
                {/* Modal xoá */}
                {isDeleteModalOpen && currentStudent && (
                    <div className={cx('modal-overlay')}>
                        <div className={cx('modal')}>
                            <h3>Xác nhận xoá</h3>
                            <p>Bạn có chắc chắn muốn xoá sinh viên <b>{currentStudent.name}</b> không?</p>
                            <div className={cx('modal-actions')}>
                                <Button outline className={cx('action-button')} onClick={closeModal}>Huỷ</Button>
                                <Button outline className={cx('action-button')} onClick={handleConfirmDelete}>Xoá</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
     );
}

export default StudentList;