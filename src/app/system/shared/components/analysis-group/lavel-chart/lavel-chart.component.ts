import {Component, Input, OnInit} from '@angular/core';
import {StudentModel} from '../../../../../shared/models/student.model';
import {SubjectModel} from '../../../../../shared/models/subject.model';

@Component({
  selector: 'pst-lavel-chart',
  templateUrl: './lavel-chart.component.html',
  styleUrls: ['./lavel-chart.component.less']
})
export class LavelChartComponent implements OnInit {
  @Input() students: Array<StudentModel>;
  @Input() subjects: Array<SubjectModel>;
  @Input() checkedSemester: number;
  oldSemester = 9;
  isLoad = false;
  data = [
    {
      'name': 'Some5',
      'value': 24
    }
  ];

  ngOnInit() {
    this.updateChart();
  }
  updateChart() {
    if (this.oldSemester === this.checkedSemester) {
      return;
    }
    this.isLoad = false;
    this.data = [];
    if (this.checkedSemester === 0) {
      for (const sub of this.subjects) {
        let sum = 0;
        let counter = 0;
        for (const st of this.students) {
          const indx = this.getIndex(st, sub.key);
          if (indx || indx === 0) {
            sum += st.register[indx].semesterOne.final;
            counter++;
          }
        }
        let middle = 0;
        if (counter > 0) {
          middle = Math.round(sum / counter);
        }
        this.data.push({
          'name': sub.name,
          'value': middle
        });
      }
    } else if (this.checkedSemester === 1) {
      for (const sub of this.subjects) {
        let sum = 0;
        let counter = 0;
        for (const st of this.students) {
          const indx = this.getIndex(st, sub.key);
          if (indx || indx === 0) {
            sum += st.register[indx].semesterSecond.final;
            counter++;
          }
        }
        let middle = 0;
        if (counter > 0) {
          middle = Math.round(sum / counter);
        }
        this.data.push({
          'name': sub.name,
          'value': middle
        });
      }
    } else {
      for (const sub of this.subjects) {
        let sum = 0;
        let counter = 0;
        for (const st of this.students) {
          const indx = this.getIndex(st, sub.key);
          if (indx || indx === 0) {
            sum += st.register[indx].semesterSecond.final;
            counter++;
          }
        }
        for (const st of this.students) {
          const indx = this.getIndex(st, sub.key);
          if (indx || indx === 0) {
            sum += st.register[indx].semesterOne.final;
            counter++;
          }
        }
        let middle = 0;
        if (counter > 0) {
          middle = Math.round(sum / counter);
        }
        this.data.push({
          'name': sub.name,
          'value': middle
        });
      }
    }
    this.oldSemester = this.checkedSemester;
    setTimeout(() => {
      this.isLoad = true;
    }, 200);
  }
  getIndex(st: StudentModel, subj: string): number {
    for (let i = 0; i < st.register.length; i++) {
      if (st.register[i].subject === subj) {
        return i;
      }
    }
    return null;
  }

}
