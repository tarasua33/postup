import {Component, Input, OnInit} from '@angular/core';
import {StudentModel} from '../../../../../shared/models/student.model';
import {ClassModel} from '../../../../../shared/models/class.model';
import {SubjectModel} from '../../../../../shared/models/subject.model';

@Component({
  selector: 'pst-success-chart',
  templateUrl: './success-chart.component.html',
  styleUrls: ['./success-chart.component.less']
})
export class SuccessChartComponent implements OnInit {
  @Input() students: Array<StudentModel>;
  @Input() checkedClass: ClassModel;
  @Input() checkedSemester: number;
  @Input() subjects: Array<SubjectModel>;
  correctSubject: Array<SubjectModel>;
  checkedSubject = '00000';
  isLoad = false;
  openSubjects = false;
  oldSubject = '';
  oldSemester = 9;

  data = [
    {
      'name': 'Початковий',
      'value': 24
    },
    {
      'name': 'Достатній',
      'value': 40
    },
    {
      'name': 'Середній',
      'value': 24
    },
    {
      'name': 'Високий',
      'value': 12
    }
  ];

  ngOnInit() {
    this.correctSubject = this.subjects;
    this.updateChart();
  }
  /**UPDATE CHART**/
  updateChart() {
    if (this.oldSubject === this.checkedSubject && this.oldSemester === this.checkedSemester) {
      return;
    }
    this.isLoad = false;
    const nameSemester = this.checkedSemester === 0 ? 'semesterOne' : 'semesterSecond';
    const data = [0, 0, 0, 0];
    if (this.checkedSubject === '00000') {
      if (this.checkedSemester === 0 || this.checkedSemester === 1) {
        for (const st of this.students) {
          let counter = 0;
          let sum = 0;
          for (const sub of st.register) {
            sum += sub[nameSemester].final;
            if (sub[nameSemester].final !== 0) {
              counter++;
            }
          }
          if (counter === 0) {
            data[0]++;
          } else {
            const middle = Math.round(sum / counter);
            const lvl = middle < 4 ? 0 : middle < 7 ? 1 : middle < 10 ? 2 : 3;
            data[lvl]++;
          }
        }
      } else if (this.checkedSemester === 2) {
        for (const st of this.students) {
          let counter = 0;
          let sum = 0;
          for (const sub of st.register) {
            sum += sub.semesterOne.final;
            if (sub.semesterOne.final !== 0) {
              counter++;
            }
          }
          for (const sub of st.register) {
            sum += sub.semesterSecond.final;
            if (sub.semesterSecond.final !== 0) {
              counter++;
            }
          }
          if (counter === 0) {
            data[0]++;
          } else {
            const middle = Math.round(sum / counter);
            const lvl = middle < 4 ? 0 : middle < 7 ? 1 : middle < 10 ? 2 : 3;
            data[lvl]++;
          }
        }
      }
    } else {
      if (this.checkedSemester === 0 || this.checkedSemester === 1) {
        for (const st of this.students) {
          let counter = 0;
          let sum = 0;
          const inx = this.getSubject(st, this.checkedSubject);
          if (inx) {
            sum += st.register[inx][nameSemester].final;
            counter++;
          }
          if (counter === 0) {
            data[0]++;
          } else {
            const middle = Math.floor(sum / counter);
            const lvl = middle < 4 ? 0 : middle < 7 ? 1 : middle < 10 ? 2 : 3;
            data[lvl]++;
          }
        }
      } else if (this.checkedSemester === 2) {
        for (const st of this.students) {
          let counter = 0;
          let sum = 0;
          const inx = this.getSubject(st, this.checkedSubject);
          if (inx) {
            sum += st.register[inx].semesterOne.final;
            counter++;
            sum += st.register[inx].semesterSecond.final;
            counter++;
          }
          if (counter === 0) {
            data[0]++;
          } else {
            const middle = Math.floor(sum / counter);
            const lvl = middle < 4 ? 0 : middle < 7 ? 1 : middle < 10 ? 2 : 3;
            data[lvl]++;
          }
        }
      }
    }
    for (let i = 0; i < data.length; i++) {
      this.data[i].value = data[i];
    }
    this.oldSubject = this.checkedSubject;
    this.oldSemester = this.checkedSemester;
    setTimeout(() => {
      this.isLoad = true;
    }, 200);
  }
  /**RenderPage**/
  getSubjectName() {
    if (this.checkedSubject === '00000') {
      return 'Всі';
    }
    return this.correctSubject.find(s => s.key === this.checkedSubject).name;
  }
  getSubject(st: StudentModel, sub: string) {
    if (this.checkedSubject !== '00000') {
      for (let i = 0; i < st.register.length; i++) {
        if (st.register[i].subject === sub) {
          return i;
        }
      }
    }
  }
  checkSubject(key) {
    this.checkedSubject = key;
  }
  /**TOGGLE**/
  toggleSubjectsList() {
    this.openSubjects = !this.openSubjects;
  }

}
