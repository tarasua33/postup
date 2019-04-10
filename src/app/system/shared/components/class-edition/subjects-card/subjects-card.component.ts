import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ClassesSubjectsService} from '../../../services/classes-subjects.service';
import {Subscription} from 'rxjs';
import {MessageModel} from '../../../../../shared/models/message.model';

@Component({
  selector: 'pst-subjects-card',
  templateUrl: './subjects-card.component.html',
  styleUrls: ['./subjects-card.component.less']
})
export class SubjectsCardComponent implements OnDestroy {
  subs1: Subscription;
  subs2: Subscription;
  @Input() subjects: Array<{id, name}>;
  @Output() edited = new EventEmitter();
  openEditSubject = false;
  openDeleteSubject = false;
  checkedSubject: {id, name};
  message: MessageModel;
  constructor(private servService: ClassesSubjectsService) {
    this.message = new MessageModel('');
  }

  editSubject(id) {
    this.checkedSubject = this.subjects.find((s) => {
      return s.id === id;
    });
    this.openEditSubject = true;
  }
  editSubjectCancel() {
    this.checkedSubject = null;
    this.openEditSubject = false;
  }
  editSubjSubmit(form: NgForm) {
    const subjName = form.value['nameSubject'].trim();
    if (subjName.toLowerCase() === this.checkedSubject.name.toLowerCase()) {
      this.message = new MessageModel('Це дійсна назва предмета', 'danger');
      setTimeout(() => {
        this.message.message = '';
      }, 5000);
    } else {
      const sameNameSubj = this.subjects.find((s) => {
        return s.name.toLowerCase() === subjName.toLowerCase();
      });
      if (sameNameSubj) {
        this.message = new MessageModel('Такий навчальний предмет уже існує', 'danger');
        setTimeout(() => {
          this.message.message = '';
        }, 5000);
      } else {
        this.checkedSubject.name = subjName;
        this.subs1 = this.servService.putSubject(this.checkedSubject.id, this.checkedSubject).subscribe((response) => {
          this.edited.emit({
            subject: response,
            isDel: false
          });
        });
        this.editSubjectCancel();
      }
    }
  }
  /**Delete**/
  deleteSubjectOpen(id) {
    this.checkedSubject = this.subjects.find(s => s.id === id);
    this.openDeleteSubject = true;
  }
  deleteSubjectCancel() {
    this.openDeleteSubject = false;
    this.checkedSubject = null;
  }
  deleteSubjectSubmit() {
    if (this.checkedSubject) {
      const needDel = this.checkedSubject;
      this.subs2 = this.servService.deleteSubject(this.checkedSubject.id).subscribe((res) => {
        this.edited.emit({
          isDel: true,
          subject: needDel
        });
      });
    }
    this.deleteSubjectCancel();
  }
  ngOnDestroy() {
    if (this.subs1) {
      this.subs1.unsubscribe();
    }
    if (this.subs2) {
      this.subs2.unsubscribe();
    }
  }
}
