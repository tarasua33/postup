import {animate, style, transition, trigger} from '@angular/animations';

export const triggerFadeAnimare = trigger('fade', [
  transition(':enter', [
    style({
      opacity: 0,
      height: 0
    }),
    animate(300)
  ]),
  transition(':leave', [
    animate(300, style({
      opacity: 0,
      height: 0
    }))
  ])
]);
