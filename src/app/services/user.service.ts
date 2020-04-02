import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private isUserLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private router: Router
  ) { }

  logIn(data): boolean {
    if (data.username === 'admin' && data.password === '1111') {
      this.isUserLoggedIn$.next(true);
      this.router.navigateByUrl('/');
      return true;
    } else {
      this.isUserLoggedIn$.next(false);
      return false;
    }
  }

  logout() {
    this.isUserLoggedIn$.next(false);
    this.router.navigateByUrl('/auth');
  }

  isUserLoggedIn(): Observable<boolean> {
    return this.isUserLoggedIn$.asObservable();
  }

}
