import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable, timer, combineLatest, of } from 'rxjs';
import { switchMap, retryWhen, tap, delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OnlineCheckService {

  private readonly heartbeatUrl = '//ipv4.icanhazip.com/';
  private readonly heartbeatInterval = 10000;
  private readonly heartbeatRetryInterval = 5000;

  private networkStatus = false;
  private internetStatus = false;

  private networkStatus$: BehaviorSubject<boolean> = new BehaviorSubject(navigator.onLine);
  private internetStatus$: BehaviorSubject<boolean> = new BehaviorSubject(null);

  constructor(
    private http: HttpClient
  ) {
    this.monitorNetworkState();
    this.monitorInternetState();
  }

  getOnlineStatus(): Observable<boolean> {
    return this.networkStatus$.pipe(
      switchMap(networkStatus => networkStatus === false ? of(false) : this.internetStatus$)
    );
  }

  private monitorNetworkState() {
    fromEvent(window, 'online').subscribe(() => {
      this.networkStatus$.next(true);
    });

    fromEvent(window, 'offline').subscribe(() => {
      this.networkStatus$.next(false);
    });
  }

  private monitorInternetState() {
    return timer(0, this.heartbeatInterval)
      .pipe(
        switchMap(() => this.http.head(this.heartbeatUrl, { responseType: 'text' })),
        retryWhen(errors =>
          errors.pipe(
            // log error message
            tap(val => {
              console.error('Http error:', val);
              if (this.internetStatus) {
                this.internetStatus = false;
                this.internetStatus$.next(false);
              }
            }),
            // restart after 5 seconds
            delay(this.heartbeatRetryInterval)
          )
        )
      ).subscribe(() => {
        if (!this.internetStatus) {
          this.internetStatus$.next(true);
          this.internetStatus = true;
        }
      });
  }

}
