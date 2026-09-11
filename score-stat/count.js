const scores = [
  {name:'用户1',count: 1, score: 92/60 ,grade: '失败'},
  {name:'用户1',count: 2, score: 45/45 ,grade: '成功'},
  {name:'用户1',count: 3, score: 99/20 ,grade: '大失败'},
  {name:'用户1',count: 4, score: 20/50 ,grade: '困难成功'},
  {name:'用户2',count: 5, score: 1/30 ,grade: '大成功'},
  {name:'用户2',count: 6, score: 12/75 ,grade: '极难成功'},
  {name:'用户2',count: 7, score: -2/1001 ,grade: '成功'}//错误数据
];
const cleanScores = (list) => list.filter(s => s.score >= 0);//清洗错误数据。

const gradeCount = (list) => {
    return cleanScores(list).reduce((result, s) => {
    const user = s.name;
    const grade = s.grade;

    if (!result[user][grade]){
    result[user][grade] = 0;
    }
    result[user][grade]++;
    return result;
    }, {'用户1': {}, '用户2': {}});
};//统计每个用户不同等级结果数量。
console.log('清洗后:', cleanScores(scores));
console.log('统计:',gradeCount(scores));
