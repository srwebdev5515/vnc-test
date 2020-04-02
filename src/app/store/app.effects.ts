import { Injectable } from '@angular/core';
import { Actions } from './app.models';

@Injectable() export class AppEffects {

  constructor(
    private as: Actions
  ) { }

}
