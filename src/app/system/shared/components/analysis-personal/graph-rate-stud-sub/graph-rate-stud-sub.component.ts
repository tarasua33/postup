import {Component, Input, OnInit} from '@angular/core';
import {StudentModel} from '../../../../../shared/models/student.model';
import {SubjectModel} from '../../../../../shared/models/subject.model';

@Component({
  selector: 'pst-graph-rate-stud-sub',
  templateUrl: './graph-rate-stud-sub.component.html',
  styleUrls: ['./graph-rate-stud-sub.component.less']
})
export class GraphRateStudSubComponent implements OnInit {
  @Input() checkedStudent: StudentModel;
  @Input() checkedSemester: number;
  @Input() subjects: Array<SubjectModel>;
  nameStudent = '';
  checkedSubject: Array<SubjectModel> = [];
  isLoad = false;
  openSubjects = false;
  data = [
    {
      'name': 'Germany',
      'series': [
        {
          'name': '2010',
          'value': 7300000
        },
        {
          'name': '2011',
          'value': 8940000
        }
      ]
    },
  ];
  constructor() { }

  ngOnInit() {
    if (this.subjects[0]) {
      this.checkedSubject.push(this.subjects[0]);
    }
    this.updateChart();
  }
  getIndexSubject(st: StudentModel, subj: string): number {
    for (let i = 0; i < st.register.length; i++) {
      if (st.register[i].subject === subj) {
        return i;
      }
    }
    return null;
  }
  updateChart() {
    this.isLoad = false;
    this.data = [];
    if (this.checkedSubject.length > 0) {
      for (const sub of this.checkedSubject) {
        const indx = this.getIndexSubject(this.checkedStudent, sub.key);
        if (indx || indx === 0) {
          const newItem = {
            'name': sub.name,
            'series': [
              {
                'name': '0',
                'value': 1
              }
            ]
          };
          if (this.checkedSemester === 0) {
            for (let i = 0; i < this.checkedStudent.register[indx].semesterOne.rates.length; i++) {
              const el = String(i + 1);
              newItem['series'].push({
                'name': el,
                'value': this.checkedStudent.register[indx].semesterOne.rates[i]
              });
            }
          } else if (this.checkedSemester === 1) {
            for (let i = 0; i < this.checkedStudent.register[indx].semesterSecond.rates.length; i++) {
              const el = String(i + 1);
              newItem['series'].push({
                'name': el,
                'value': this.checkedStudent.register[indx].semesterSecond.rates[i]
              });
            }
          } else if (this.checkedSemester === 2) {
            let num = 1;
            for (let i = 0; i < this.checkedStudent.register[indx].semesterOne.rates.length; i++) {
              const el = String(num);
              newItem['series'].push({
                'name': el,
                'value': this.checkedStudent.register[indx].semesterOne.rates[i]
              });
              num++;
            }
            for (let i = 0; i < this.checkedStudent.register[indx].semesterSecond.rates.length; i++) {
              const el = String(num);
              newItem['series'].push({
                'name': el,
                'value': this.checkedStudent.register[indx].semesterSecond.rates[i]
              });
              num++;
            }
          }
          this.data.push(newItem);
        }
      }
    }
    setTimeout(() => {
      this.isLoad = true;
    }, 200);
  }
  /**TOGGLE && CHECK SUBJECTS**/
  toggleListSubjects() {
    this.openSubjects = !this.openSubjects;
  }
  checkSubject(sub: SubjectModel) {
    if (this.checkedSubject.length < 5) {
      const isNot = this.checkedSubject.find(s => s === sub);
      if (!isNot) {
        this.checkedSubject.push(sub);
      }
    }
    this.toggleListSubjects();
  }
  deleteFromSubList(key) {
    for (let i = 0; i < this.checkedSubject.length; i++) {
      if (this.checkedSubject[i].key === key) {
        this.checkedSubject.splice(i, 1);
        break;
      }
    }
  }

}
