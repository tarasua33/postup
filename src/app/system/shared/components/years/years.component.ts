import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../../../shared/service/auth.service';
import {Router} from '@angular/router';
import {YearsService} from '../../services/years.service';
import {Subscription} from 'rxjs';
import {NgForm} from '@angular/forms';
import {YearModel} from '../../../../shared/models/year.model';
import {MessageModel} from '../../../../shared/models/message.model';
import {ClassesSubjectsService} from '../../services/classes-subjects.service';
import {ClassModel} from '../../../../shared/models/class.model';

@Component({
  selector: 'pst-years',
  templateUrl: './years.component.html',
  styleUrls: ['./years.component.less']
})
export class YearsComponent implements OnInit, OnDestroy {
  subs1: Subscription;
  subs2: Subscription;
  subs3: Subscription;
  subs4: Subscription;
  subs5: Subscription;
  subs6: Subscription;
  years: [YearModel];
  openEditYears = false;
  openDeleteYear = false;
  openNewYear = false;
  openSecondSemesterAdd = false;
  typeEdition = null;
  checkYearId = null;
  nameYearEdition: string;
  checkedYearActive = false;
  message: MessageModel;
  classes: Array<ClassModel>;

  constructor(
    private auth: AuthService,
    private router: Router,
    private serverService: YearsService,
    private classService: ClassesSubjectsService
    ) {
    this.message = new MessageModel('', 'danger');
  }

  ngOnInit() {
    const user = this.auth.checkLog();
    if (user) {
      let right = false;
      for (let i = 0; i < user.type.length; i++) {
        if (user.type[i] === 'principal') {
          right = true;
        }
      }
      if (!right) {
        this.router.navigate(['/news']);
      }
    }
    this.subs1 = this.serverService.getYears().subscribe((response) => {
      if (response) {
        this.years = response;
        this.subs6 = this.classService.getClasses()
          .subscribe((classes: [ClassModel]) => {
            this.classes = classes;
          });
      }
    });
  }
  /**EDIT**/
  editYear(id, numb) {
    this.checkYearId = +id;
    const year: YearModel = this.years.find(( y: YearModel) => {
      return y.id === this.checkYearId;
    });
    this.nameYearEdition = year.name;
    this.checkedYearActive = year.active;
    this.typeEdition = numb;
    this.openEditYears = true;
  }
  cancelEdit() {
    this.openEditYears = false;
    this.checkYearId = null;
    this.nameYearEdition = '';
    this.checkedYearActive = false;
    this.typeEdition = null;
  }
  submitEdit(form: NgForm) {
    const year: YearModel = this.years.find(( y: YearModel) => {
      return y.id === this.checkYearId;
    });
    const yearEdit = form.value;
    /**NAME**/
    if ('nameYears' in yearEdit) {
      yearEdit['nameYears'] = yearEdit['nameYears'].trim();
      const yearNewName: YearModel = this.years.find(( y: YearModel) => {
        return y.name === yearEdit['nameYears'];
      });
      if (!yearNewName) {
        year.name = yearEdit['nameYears'];
        this.subs2 = this.serverService.putYear(year, this.checkYearId).subscribe((response) => {});
        this.checkYearId = null;
        this.nameYearEdition = '';
        this.checkedYearActive = false;
        this.openEditYears = false;
        this.typeEdition = null;
      } else if (yearNewName.id === this.checkYearId) {
        this.message = new MessageModel('Це поточна назва навчального року', 'danger');
        setTimeout(() => {
          this.message.message = '';
        }, 5000);
      } else {
        this.message = new MessageModel('Такий рік вже існує', 'danger');
        setTimeout(() => {
          this.message.message = '';
        }, 5000);
      }
      /**ACTIVE**/
    } else if ('makeActive' in yearEdit) {
      if (yearEdit['makeActive'] === false && year.active === true) {
        year.active = yearEdit['makeActive'];
        this.subs2 = this.serverService.putYear(year, this.checkYearId).subscribe((response) => {});
        this.checkYearId = null;
        this.nameYearEdition = '';
        this.checkedYearActive = false;
        this.openEditYears = false;
        this.typeEdition = null;
      } else if (yearEdit['makeActive'] === true && year.active === false) {
        const activeYear = this.years.find(( y: YearModel) => {
          return y.active === true;
        });
        if (activeYear) {
          this.message = new MessageModel('Не можливо активувати два навчальних роки одночасно. Спершу скасуйте попередній.', 'danger');
          setTimeout(() => {
            this.message.message = '';
          }, 5000);
        } else {
          year.active = yearEdit['makeActive'];
          this.subs2 = this.serverService.putYear(year, this.checkYearId).subscribe((response) => {});
          this.checkYearId = null;
          this.nameYearEdition = '';
          this.checkedYearActive = false;
          this.openEditYears = false;
          this.typeEdition = null;
        }
      } else {
        this.message = new MessageModel('Не можливо активувати два навчальних роки одночасно. Спершу скасуйте попередній.', 'danger');
        setTimeout(() => {
          this.message.message = '';
        }, 5000);
      }
      /**SEMESTER**/
    } else if ('secondSemester' in yearEdit) {
      if (year.active) {
        if (yearEdit['secondSemester'] === true) {
          if (year.semesters.length > 1) {
            year.semesters.splice(1, 1);
            this.subs2 = this.serverService.putYear(year, this.checkYearId).subscribe((response) => {});
            this.checkYearId = null;
            this.nameYearEdition = '';
            this.checkedYearActive = false;
            this.openEditYears = false;
            this.typeEdition = null;
          } else {
            this.message = new MessageModel('В даному році, ще не розпочато другий семестр', 'danger');
            setTimeout(() => {
              this.message.message = '';
            }, 5000);
          }
        }
      } else {
        this.message = new MessageModel('Ви можете видаляти інформацію про другий семест, тільки поточного навчального року', 'danger');
        setTimeout(() => {
          this.message.message = '';
        }, 5000);
      }
    } else {
      this.message = new MessageModel('Помилкова операція', 'danger');
      setTimeout(() => {
        this.message.message = '';
      }, 5000);
    }
  }
  /**DELETE**/
  deleteYear(id) {
    this.checkYearId = +id;
    const year: YearModel = this.years.find(( y: YearModel) => {
      return y.id === this.checkYearId;
    });
    this.nameYearEdition = year.name;
    this.checkedYearActive = year.active;
    this.openDeleteYear = true;
  }
  deleteYearConfirm() {
    if (!this.checkedYearActive) {
      const activeClasses = this.classes.filter(c => c.year === this.checkYearId);
      if (activeClasses.length > 0) {
        this.message = new MessageModel('Перед видаленням навчального року видаліть всі класи', 'danger');
        setTimeout(() => {
          this.message.message = '';
        }, 5000);
        return;
      }
      this.subs4 = this.serverService.deleteYear(this.checkYearId).subscribe((response) => {});
      for (let i = 0; i < this.years.length; i++) {
        if (this.years[i].id === this.checkYearId) {
          this.years.splice(i, 1);
          break;
        }
      }
      this.cancelDeleteYear();
    } else {
      this.message = new MessageModel('Не можливо видалити активний навчальний рік', 'danger');
      setTimeout(() => {
        this.message.message = '';
      }, 5000);
    }
  }
  cancelDeleteYear() {
    this.openDeleteYear = false;
    this.checkYearId = null;
    this.checkedYearActive = false;
    this.nameYearEdition = '';
  }
  /**ADD YEAR**/
  addYearOpen() {
    this.openNewYear = true;
  }
  addYearCancel() {
    this.openNewYear = false;
  }
  submitNewYear(form: NgForm) {
    const name = form.value['nameNewYear'].trim();
    const year: YearModel = this.years.find(( y: YearModel) => {
      return y.name === name;
    });
    if (!year) {
      const newYear = new YearModel(name);
      newYear.semesters = [];
      newYear.semesters.push({
        name: 'Перший'
      });
      this.subs3 = this.serverService.postYear(newYear).subscribe((response: YearModel) => {
        this.years.push(response);
      });
      this.addYearCancel();
    } else {
      this.message = new MessageModel('Такий навчальний рік уже існує', 'danger');
      setTimeout(() => {
        this.message.message = '';
      }, 5000);
    }
  }
  /**SEMESTER**/
  secondSemesterAddOpen() {
    const year: YearModel = this.years.find(( y: YearModel) => {
      return y.active === true;
    });
    if (year) {
      this.nameYearEdition = year.name;
      this.checkedYearActive = year.active;
      this.checkYearId = year.id;
    }
    this.openSecondSemesterAdd = true;
  }
  secondSemesterConfirm() {
    if (this.checkedYearActive) {
      const year: YearModel = this.years.find(( y: YearModel) => {
        return y.active === true;
      });
      if (year.semesters.length > 1) {
        const mess = 'Другий навчальний семестр вже додано. Якщо Ви хочете його замінити, спершу видаліть діючий другий семестр';
        this.message = new MessageModel(mess, 'danger');
        setTimeout(() => {
          this.message.message = '';
        }, 5000);
      } else {
        year.semesters.push({
          name: 'Другий'
        });
        this.subs5 = this.serverService.putYear(year, this.checkYearId).subscribe((response) => {});
        this.secondSemesterCancel();
      }
    } else {
      this.message = new MessageModel('Не можливо добавити другий семестр, якщо немає активного навчального року', 'danger');
      setTimeout(() => {
        this.message.message = '';
      }, 5000);
    }
  }
  secondSemesterCancel() {
    this.openSecondSemesterAdd = false;
    this.checkYearId = null;
    this.checkedYearActive = false;
    this.nameYearEdition = '';
  }
  ngOnDestroy() {
    if (this.subs1) {
      this.subs1.unsubscribe();
    }
    if (this.subs2) {
      this.subs2.unsubscribe();
    }
    if (this.subs3) {
      this.subs3.unsubscribe();
    }
    if (this.subs4) {
      this.subs4.unsubscribe();
    }
    if (this.subs5) {
      this.subs5.unsubscribe();
    }
    if (this.subs6) {
      this.subs6.unsubscribe();
    }
  }
}
