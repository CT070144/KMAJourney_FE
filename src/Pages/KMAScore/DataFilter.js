function DataFilter(result) {

    const subjectsPassed = result.filter(item => item.diem_thi>=4&&item.diem_tong_ket>=4);
    const subjectsFailed = result.filter(item => item.diem_thi<4||item.diem_tong_ket<4);

    // Tổng số tín chỉ đã học (tính tất cả các môn)
    const totalCredits = result.reduce((sum, item) => sum + item.soTinChi, 0);
    // Tổng (điểm tổng kết * số tín chỉ)
    const totalWeightedScore = result.reduce((sum, item) => sum + item.diem_tong_ket * item.soTinChi, 0);

    const GPA = totalCredits > 0 ? (totalWeightedScore / totalCredits).toFixed(2) : 0;
    const GPA4 = ((GPA/10)*4).toFixed(2);
    return {
        subjectsPassed,
        subjectsFailed,
        GPA: GPA4
    };
}

export default DataFilter;