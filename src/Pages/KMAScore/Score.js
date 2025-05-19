import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Styles from './Score.module.scss';
import Header from '~/components/Layouts/Header';
import Footer from '~/components/Layouts/Footer';
import { faChartSimple, faCircleCheck, faExclamation, faFeatherPointed, faRoadCircleCheck } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/Button';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import DataFilter from './DataFilter';
import { API_URL } from '~/Config/APIconfig';
const cx = classNames.bind(Styles);
function Score() {

    const [studentCode, setStudentCode] = useState('');
    const [result, setResult] = useState(null);
    const [infor, setInfor] = useState({});
    const [dataFiltered, setDataFiltered] = useState({});
   const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(studentCode);

    try{
        const response = await axios.get(`${API_URL}/hocphan/${studentCode}`);
        console.log(response);
        setResult(response.data.result);
        const studentInfo = response.data.result[0];
        setInfor({
            name: studentInfo[1],
            studentCode: studentInfo[0],
            class: studentInfo[2],
            major: studentInfo[3]
        });
        setDataFiltered(DataFilter(response.data.result));
        console.log(infor);

    }
    catch(error){
       toast.error('Lỗi khi lấy dữ liệu');
    }
    


   }


    return (
        <div className={cx('wrapper')}>
            <Header title="KMA SCORE" icon={<FontAwesomeIcon icon={faFeatherPointed} />} />
            <div className={cx('container')}>
            <div className={cx('fetch_field')}>
            <form action="" className={cx('fetch_field_form')} onSubmit={handleSubmit}>
                <input type="text" className={cx('fetch_field_input')} 
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                placeholder="Enter student code" />
                <div className={cx('fetch_field_notify')}></div>
                <select className={cx('fetch_field_select')}>
                    <option className={cx('fetch_field_option')} value=""></option>
                    <option className={cx('fetch_field_option')} value="value1">
                        Xếp hạng lớp
                    </option>
                    <option className={cx('fetch_field_option')} value="value2">
                        Xếp hạng khối
                    </option>
                    <option className={cx('fetch_field_option')} value="value3">
                        Xếp hạng khóa
                    </option>
                    <option className={cx('fetch_field_option')} value="value3">
                        Xếp hạng trường
                    </option>
                </select>
                <Button type="submit" className={cx('fetch_field-button')}>
                    Fetch
                </Button>
            </form>
        </div>
        {result && <div>
                <div className={cx('result_field')}>
                    <div className={cx('infor_wrapper')}>
                        <div className={cx('infor_name')}> {infor.name} </div>
                        <div className={cx('infor_descripbe')}>
                            <ul className={cx('infor_list')}>
                                <li className={cx('infor_items', 'infor_studentcode')}>{infor.studentCode}</li>
                                <li className={cx('infor_items', 'infor_class')}>{infor.class}</li>
                                <li className={cx('infor_items', 'infor_top')}>{infor.major}</li>
                            </ul>
                        </div>
                    </div>
                    <div className={cx('infor_summary')}>
                        <ul className={cx('infor_summary_list')}>
                            <li className={cx('infor_summary_items', 'infor_completed')}>
                                <FontAwesomeIcon className={cx('infor_summary_items-icon')} icon={faCircleCheck}></FontAwesomeIcon>
                                <span className={cx('infor_summary_items_title')}>Số môn đã hoàn thành</span>
                                <div className={cx('infor_summary_items_number')}>{dataFiltered.subjectsPassed.length}</div>
                            </li>
                            <li className={cx('infor_summary_items', 'infor_incomplete')}>
                                <FontAwesomeIcon className={cx('infor_summary_items-icon')} icon={faExclamation}></FontAwesomeIcon>
                                <span className={cx('infor_summary_items_title')}>Số môn còn nợ</span>
                                <div className={cx('infor_summary_items_number')}>{dataFiltered.subjectsFailed.length}</div>
                            </li>
                            <li className={cx('infor_summary_items', 'infor_gpa')}>
                                <FontAwesomeIcon className={cx('infor_summary_items-icon')} icon={faChartSimple}></FontAwesomeIcon>
                                <span className={cx('infor_summary_items_title')}>GPA</span>
                                <div className={cx('infor_summary_items_number')}>{dataFiltered.GPA}</div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={cx('result_field_table')}>
                    <table className={cx('table', 'table_field')}>
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Tên học phần</th>
                                <th scope="col">Điểm TP1</th>
                                <th scope="col">Điểm TP2</th>
                                <th scope="col">Điểm thi</th>
                                <th scope="col">Điểm tổng kết</th>
                                <th scope="col">Điểm chữ</th>
                                <th scope="col">Học kỳ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                result.map((item, index) => (
                                    <tr key={index}
                                     className={item[7]<4||item[8]<4?cx('table_row_failed'):cx('')}
                                    >
                                        <td className={cx('index_table')}>{index + 1}</td>
                                        <td className={cx('subject_name')}>{item[4]}</td>
                                        <td className={cx('score_table')}>{item[5]}</td>
                                        <td className={cx('score_table')}>{item[6]}</td>
                                        <td className={cx('score_table')}>{item[7]}</td>
                                        <td className={cx('score_table')}>{item[8]}</td>
                                        <td className={cx('score_table')}>{item[9]}</td>
                                        <td className={cx('score_table')}>{item[10]}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>}
            </div> 

            <Footer />
        </div> 
    );
}

export default Score;
