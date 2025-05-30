import styles from './Subjects.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { API_URL } from '~/Config/APIconfig';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const cx = classNames.bind(styles);

// Form validation schema
const editSubjectSchema = yup.object().shape({
    ten_hoc_phan: yup.string().required('Tên môn học là bắt buộc')
        .transform(value => value ? value.trim() : value),
    sotinchi: yup.number()
        .required('Số tín chỉ là bắt buộc')
        .min(1, 'Số tín chỉ phải lớn hơn 0')
        .max(10, 'Số tín chỉ không được vượt quá 10'),
    hocky: yup.number()
        .required('Học kỳ là bắt buộc')
        .min(1, 'Học kỳ phải lớn hơn 0')
        .max(10, 'Học kỳ không được vượt quá 10')
});

function Subjects() {
    // State management
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedCredits, setSelectedCredits] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentSubject, setCurrentSubject] = useState(null);
    const [refresh, setRefresh] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(editSubjectSchema)
    });

    // Fetch subjects data
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/hocphan/subject-list`);
                setSubjects(response.data.result);
                setError(null);
            } catch (err) {
                setError('Failed to fetch subjects data');
                console.error('Error fetching subjects:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, [refresh]);

    // Filter handler
    const handleFilter = async () => {
        if(filterType === 'semester'){
            if(selectedSemester === ''){
                setRefresh(!refresh);
                return;
            }
       try{
        const response = await axios.get(`${API_URL}/hocphan/filter/hocky/${selectedSemester}`);
        setSubjects(response.data.result);
       }catch(error){
        toast.error('Lỗi khi lọc môn học');
       }}
       else if(filterType === 'credits'){
        if(selectedCredits === ''){
            setRefresh(!refresh);
            return;
        }

        try{
            const response = await axios.get(`${API_URL}/hocphan/filter/tinchi/${selectedCredits}`);
            setSubjects(response.data.result);
        }catch(error){
            toast.error('Lỗi khi lọc môn học');
        }
       }
        
    };

    // Edit handler
    const handleEdit = (subject) => {
        setCurrentSubject(subject);
        reset(subject);
        setIsEditModalOpen(true);
    };

    // Delete handler
    const handleDelete = (subject) => {
        setCurrentSubject(subject);
        setIsDeleteModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsEditModalOpen(false);
        setIsDeleteModalOpen(false);
        setCurrentSubject(null);
    };

    // Submit edit form
    const onSubmit = async (data) => {

        console.log(data);
        try {
            const response = await axios.put(`${API_URL}/hocphan/update`, data);
            if (response.data.code === 100) {
                toast.success('Cập nhật môn học thành công');
                setRefresh(!refresh);
                closeModal();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật môn học');
        }
    };

    // Confirm delete
    const handleConfirmDelete = async () => {
        try {
            const response = await axios.delete(`${API_URL}/hocphan/${currentSubject.ma_hoc_phan}`);
            if (response.data.code === 100) {
                toast.success('Xoá thành công môn học ' + currentSubject.ma_hoc_phan);
                setRefresh(!refresh);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xoá môn học');
        }
        closeModal();
    };

    // Search handler
    const handleSearch = async () => {
        try {
            const response = await axios.get(`${API_URL}/hocphan/${searchQuery}`);
            setSubjects(response.data.result);
            
        } catch (err) {
            toast.error('Không tìm thấy môn học');
        }
    };

    // Cancel search
    const handleCancel = () => {
        setSearchQuery('');
        setRefresh(!refresh);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('filter')}>
                <div className={cx('filter-item')}>
                    <label htmlFor="search" className={cx('label')}>Tìm kiếm</label>
                    <input
                        type="text"
                        id="search"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className={cx('input')}
                        placeholder="Nhập mã môn học..."
                    />
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
                        <option value="">Chọn kiểu lọc</option>
                        <option value="semester">Lọc theo học kỳ</option>
                        <option value="credits">Lọc theo số tín chỉ</option>
                    </select>
                    {filterType === 'semester' && (
                        <>
                            <label htmlFor="semester" className={cx('label')}>Học kỳ</label>
                            <select
                                id="semester"
                                className={cx('select')}
                                value={selectedSemester}
                                onChange={e => setSelectedSemester(e.target.value)}
                            >
                                <option className={cx('option')} value="">Tất cả</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8,9,10].map(sem => (
                                    <option key={sem} value={sem}>Học kỳ {sem}</option>
                                ))}
                            </select>
                        </>
                    )}
                    {filterType === 'credits' && (
                        <>
                            <label htmlFor="credits" className={cx('label')}>Số tín chỉ</label>
                            <select
                                id="credits"
                                className={cx('select')}
                                value={selectedCredits}
                                onChange={e => setSelectedCredits(e.target.value)}
                            >
                                <option className={cx('option')} value="">Tất cả</option>
                                {[1, 2, 3, 4, 5, 6].map(credit => (
                                    <option key={credit} value={credit}>{credit} tín chỉ</option>
                                ))}
                            </select>
                        </>
                    )}
                    <Button outline className={cx('button')} onClick={handleFilter}>Lọc</Button>
                </div>
            </div>

            <div className={cx('content')}>
                {loading ? (
                    <div className={cx('loading')}>
                        <FontAwesomeIcon spin icon={faSpinner} className={cx('icon')} />
                        Đang tải dữ liệu...
                    </div>
                ) : error ? (
                    <div className={cx('error')}>{error}</div>
                ) : (
                    <div className={cx('table-container')}>
                        <table className={cx('table')}>
                            <thead>
                                <tr>
                                    <th>Mã môn học</th>
                                    <th>Tên môn học</th>
                                    <th>Số tín chỉ</th>
                                    <th>Học kỳ</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.map(subject => (
                                    <tr key={subject.ma_hoc_phan}>
                                        <td>{subject.ma_hoc_phan}</td>
                                        <td>{subject.ten_hoc_phan}</td>
                                        <td>{subject.sotinchi}</td>
                                        <td>{subject.hocky}</td>
                                        <td className={cx('action-buttons')}>
                                            <Button outline className={cx('action-button', 'edit')} onClick={() => handleEdit(subject)}>
                                                <FontAwesomeIcon icon={faPenToSquare} className={cx('icon')} />Sửa
                                            </Button>
                                            <Button outline className={cx('action-button', 'delete')} onClick={() => handleDelete(subject)}>
                                                <FontAwesomeIcon icon={faTrash} className={cx('icon')} />Xoá
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Edit Modal */}
                <Modal
                    isOpen={isEditModalOpen}
                    onRequestClose={closeModal}
                    className={cx('modal')}
                    overlayClassName={cx('modal-overlay')}
                    contentLabel="Chỉnh sửa môn học"
                >
                    <div className={cx('modal-content')}>
                        <h3>Chỉnh sửa môn học</h3>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className={cx('form-group')}>
                                <label>Mã môn học:</label>
                                <input
                                    value={currentSubject?.ma_hoc_phan}
                                    disabled
                                    className={cx('form-control')}
                                />
                            </div>
                            <div className={cx('form-group')}>
                                <label>Tên môn học:</label>
                                <input
                                    {...register('ten_hoc_phan')}
                                    className={cx('form-control', { 'is-invalid': errors.ten_hoc_phan })}
                                />
                                {errors.ten_hoc_phan && (
                                    <div className={cx('error-message')}>{errors.ten_hoc_phan.message}</div>
                                )}
                            </div>
                            <div className={cx('form-group')}>
                                <label>Số tín chỉ:</label>
                                <input
                                    type="number"
                                    {...register('sotinchi')}
                                    className={cx('form-control', { 'is-invalid': errors.sotinchi })}
                                />
                                {errors.sotinchi && (
                                    <div className={cx('error-message')}>{errors.sotinchi.message}</div>
                                )}
                            </div>
                            <div className={cx('form-group')}>
                                <label>Học kỳ:</label>
                                <input
                                    type="number"
                                    {...register('hocky')}
                                    className={cx('form-control', { 'is-invalid': errors.hocky })}
                                />
                                {errors.hocky && (
                                    <div className={cx('error-message')}>{errors.hocky.message}</div>
                                )}
                            </div>
                            <div className={cx('modal-actions')}>
                                <Button outline className={cx('action-button')} onClick={closeModal}>Huỷ</Button>
                                <Button primary className={cx('action-button')} type="submit">Lưu</Button>
                            </div>
                        </form>
                    </div>
                </Modal>

                {/* Delete Modal */}
                {isDeleteModalOpen && currentSubject && (
                    <div className={cx('modal-overlay')}>
                        <div className={cx('modal')}>
                            <h3>Xác nhận xoá</h3>
                            <p>Bạn có chắc chắn muốn xoá môn học <b>{currentSubject.ten_hoc_phan}</b> không?</p>
                            <div className={cx('modal-actions')}>
                                <Button outline className={cx('action-button')} onClick={closeModal}>Huỷ</Button>
                                <Button outline className={cx('action-button', 'delete')} onClick={handleConfirmDelete}>Xoá</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Subjects;