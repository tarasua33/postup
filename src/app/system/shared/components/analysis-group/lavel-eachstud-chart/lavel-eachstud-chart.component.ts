import {Component, Input, OnInit} from '@angular/core';
import {StudentModel} from '../../../../../shared/models/student.model';
import {SubjectModel} from '../../../../../shared/models/subject.model';

@Component({
  selector: 'pst-lavel-eachstud-chart',
  templateUrl: './lavel-eachstud-chart.component.html',
  styleUrls: ['./lavel-eachstud-chart.component.less']
})
export class LavelEachstudChartComponent implements OnInit {
  @Input() students: Array<StudentModel>;
  @Input() subjects: Array<SubjectModel>;
  @Input() checkedSemester: number;
  checkedSubject = '*';
  isLoad = true;
  openSubjects = false;
  oldSubject = '';
  oldSemester = 9;
  data = [
    {
      'name': 'Іванко',
      'value': 2
    },
    {
      'name': 'Маринка',
      'value': 12
    },
    {
      'name': 'Катеринка',
      'value': 7
    }
  ];

  constructor() { }

  ngOnInit() {
    this.updateData();
  }
  updateData() {
    this.data = [];
    if (this.oldSubject === this.checkedSubject && this.oldSemester === this.checkedSemester) {
      return;
    }
    this.isLoad = false;
    if (this.checkedSemester === 0) {
      if (this.checkedSubject === '*') {
        for (const st of this.students) {
          let sum = 0;
          let counter = 0;
          for (const sub of st.register) {
            sum += sub.semesterOne.final;
            if (sub.semesterOne.final !== 0) {
              counter++;
            }
          }
          let middle = 0;
          if (counter > 0) {
            middle = Math.round( (sum / counter) * 100 ) / 100;
          }
          this.data.push({
            'name': st.name,
            'value': middle
          });
        }
      } else {
        for (const st of this.students) {
          let sum = 0;
          const indx = this.getSubject(st, this.checkedSubject);
          if (indx) {
            sum += st.register[indx].semesterOne.final;
          }
          this.data.push({
            'name': st.name,
            'value': sum
          });
        }
      }
    } else if (this.checkedSemester === 1) {
      if (this.checkedSubject === '*') {
        for (const st of this.students) {
          let sum = 0;
          let counter = 0;
          for (const sub of st.register) {
            sum += sub.semesterSecond.final;
            if (sub.semesterSecond.final !== 0) {
              counter++;
            }
          }
          let middle = 0;
          if (counter > 0) {
            middle = Math.round( (sum / counter) * 100 ) / 100;
          }
          this.data.push({
            'name': st.name,
            'value': middle
          });
        }
      } else {
        for (const st of this.students) {
          let sum = 0;
          const indx = this.getSubject(st, this.checkedSubject);
          if (indx) {
            sum += st.register[indx].semesterSecond.final;
          }
          this.data.push({
            'name': st.name,
            'value': sum
          });
        }
      }
    } else {
      if (this.checkedSubject === '*') {
        for (const st of this.students) {
          let sum = 0;
          let counter = 0;
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
          let middle = 0;
          if (counter > 0) {
            middle = Math.round( (sum / counter) * 100 ) / 100;
          }
          this.data.push({
            'name': st.name,
            'value': middle
          });
        }
      } else {
        for (const st of this.students) {
          let sum = 0;
          let counter = 1;
          const indx = this.getSubject(st, this.checkedSubject);
          if (indx) {
            sum += st.register[indx].semesterOne.final;
            sum += st.register[indx].semesterSecond.final;
            if (st.register[indx].semesterSecond.final !== 0) {
              counter++;
            }
          }
          sum = Math.round( (sum / counter) * 100 ) / 100;
          this.data.push({
            'name': st.name,
            'value': sum
          });
        }
      }
    }
    this.oldSubject = this.checkedSubject;
    this.oldSemester = this.checkedSemester;
    setTimeout(() => {
      this.isLoad = true;
    }, 200);
  }

  /**RenderPage**/
  getSubjectName() {
    if (this.checkedSubject === '*') {
      return 'Всі';
    }
    return this.subjects.find(s => s.key === this.checkedSubject).name;
  }
  getSubject(st: StudentModel, sub: string) {
    if (this.checkedSubject !== '*') {
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
