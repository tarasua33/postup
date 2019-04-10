import {Component, Input, OnInit} from '@angular/core';
import {StudentModel} from '../../../../../shared/models/student.model';
import {SubjectModel} from '../../../../../shared/models/subject.model';

@Component({
  selector: 'pst-middle-rate-student',
  templateUrl: './middle-rate-student.component.html',
  styleUrls: ['./middle-rate-student.component.less']
})
export class MiddleRateStudentComponent implements OnInit {
  @Input() checkedStudent: StudentModel;
  @Input() checkedSemester: number;
  @Input() subjects: Array<SubjectModel>;
  nameStudent = '';
  oldCheckSemester = 9;
  oldCheckStudent = {};
  isLoad = false;
  data = [
    {
      'name': 'Some5',
      'value': 24
    },
    {
      'name': 'Some2',
      'value': 4
    },
    {
      'name': 'Some1',
      'value': 12
    }
  ];
  constructor() { }

  ngOnInit() {
    this.updateChart();
  }
  updateChart() {
    if (this.oldCheckSemester === this.checkedSemester && this.oldCheckStudent === this.checkedStudent) {
      return;
    }
    this.isLoad = false;
    this.data = [];
    if (this.checkedSemester === 0) {
      for (const sub of this.checkedStudent.register) {
        const correctSubject = this.subjects.find(s => s.key === sub.subject);
        if (correctSubject) {
          let sum = 0;
          let counter = 0;
          for (const n of sub.semesterOne.rates) {
            sum += n;
            counter++;
          }
          let middle = 1;
          if (counter > 0) {
            middle = Math.round((sum / counter) * 100) / 100;
          }
          this.data.push({
            'name': correctSubject.name,
            'value': middle
          });
        }
      }
    } else if (this.checkedSemester === 1) {
      for (const sub of this.checkedStudent.register) {
        const correctSubject = this.subjects.find(s => s.key === sub.subject);
        if (correctSubject) {
          let sum = 0;
          let counter = 0;
          for (const n of sub.semesterSecond.rates) {
            sum += n;
            counter++;
          }
          let middle = 1;
          if (counter > 0) {
            middle = Math.round((sum / counter) * 100) / 100;
          }
          this.data.push({
            'name': correctSubject.name,
            'value': middle
          });
        }
      }
    } else if (this.checkedSemester === 2) {
      for (const sub of this.checkedStudent.register) {
        const correctSubject = this.subjects.find(s => s.key === sub.subject);
        if (correctSubject) {
          let sum = 0;
          let counter = 0;
          for (const n of sub.semesterOne.rates) {
            sum += n;
            counter++;
          }
          for (const n of sub.semesterSecond.rates) {
            sum += n;
            counter++;
          }
          let middle = 1;
          if (counter > 0) {
            middle = Math.round((sum / counter) * 100) / 100;
          }
          this.data.push({
            'name': correctSubject.name,
            'value': middle
          });
        }
      }
    }
    this.nameStudent = this.checkedStudent.name;
    this.oldCheckStudent = this.checkedStudent;
    this.oldCheckSemester = this.checkedSemester;
    setTimeout(() => {
      this.isLoad = true;
    }, 200);
  }

}
