import { Injectable } from '@angular/core';
import { Theme } from '../models';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private theme: BehaviorSubject<Theme> = new BehaviorSubject(Theme.Primary);

  constructor() { }

  changeTheme(t: Theme) {
    this.theme.next(t);
  }

  get currentTheme(): Observable<Theme> {
    return this.theme.asObservable();
  }
}
