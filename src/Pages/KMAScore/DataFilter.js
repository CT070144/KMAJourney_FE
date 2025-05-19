function DataFilter(data) {
    const scoreList = data.map(item => ({
        subject: item[4],
        score1: item[5],
        score2: item[6],
        examScore: item[7],
        finalScore: item[8],
        letterScore: item[9],
        semester: item[10],
        courceCredit: item[11]
    }));
    const subjectsPassed = scoreList.filter(item => item.finalScore>=4||item.examScore>=4);
    const subjectsFailed = scoreList.filter(item => item.finalScore<4||item.examScore<4);

    // Tổng số tín chỉ đã học (tính tất cả các môn)
    const totalCredits = scoreList.reduce((sum, item) => sum + item.courceCredit, 0);
    // Tổng (điểm tổng kết * số tín chỉ)
    const totalWeightedScore = scoreList.reduce((sum, item) => sum + item.finalScore * item.courceCredit, 0);

    const GPA = totalCredits > 0 ? (totalWeightedScore / totalCredits).toFixed(2) : 0;
    const GPA4 = ((GPA/10)*4).toFixed(2);
    return {
        subjectsPassed,
        subjectsFailed,
        GPA: GPA4
    };
}

export default DataFilter;