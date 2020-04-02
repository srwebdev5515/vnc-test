import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { OnlineCheckService, UserService, AppService } from 'src/app/services';
import { Subscription, timer, ReplaySubject, interval, Observable, of } from 'rxjs';
import { filter, switchMap, scan, withLatestFrom, map, take } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Message, Theme, MessagesMock, Conversation, ConversationsMock } from 'src/app/models';
import { AppState, AppFields, AppTypes, Store } from 'src/app/store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private sub: Subscription;
  private myNumber$: ReplaySubject<any> = new ReplaySubject(1);

  searchForm: FormGroup;
  messages: Message[] = [];
  messages$: Observable<Message[]> = MessagesMock;
  conversations$: Observable<Conversation[]>;

  constructor(
    private ocs: OnlineCheckService,
    private us: UserService,
    private as: AppService,
    private fb: FormBuilder,
    private store: Store<any>
  ) {
    this.emitNumbers();
    this.buildSearchForm();

    this.conversations$ = this.store.select(AppFields.App, AppFields.Conversations);
  }

  ngOnInit() {

    // #1 and #2 Write a log “User is online and logged in”
    this.sub.add(this.ocs.getOnlineStatus().pipe(
      filter(isOnline => isOnline),
      switchMap(() => this.us.isUserLoggedIn()),
      filter(isLoggedin => isLoggedin)
    ).subscribe(() => {
      console.log('User is online and logged in');
    }));

    // #3 Write a code to get list of number from that function when there is change each 2s
    this.sub.add(this.getNumber().subscribe(res => {
      console.log('---- Numbers list emitted from myNumber$ ---- ');
      console.log(res);
    }));

    // #4 Writing a code that get value from one input on change and use that value for a function
    this.onSearch();

    // #6 Add conversations to store
    this.conversations$.pipe(take(1)).subscribe(res => res === null && this.store.dispatch({
      type: AppTypes.UpdateState,
      payload: {
        [AppFields.Conversations]: ConversationsMock
      }
    }));
    this.sub.add(this.conversations$.subscribe(res => {
      console.log('------- Messages in Store -------');
      console.log(res);
    }));

  }

  getNumber() {
    return interval(2000).pipe(
      withLatestFrom(
        this.myNumber$.asObservable().pipe(
          scan((acc, curr) => [...acc, curr], [])
        )
      ),
      map(([_, numbers]) => numbers)
    );
  }

  onLogout() {
    this.us.logout();
  }

  onSearch() {
    this.sub.add(this.searchMessages(this.searchForm.value.key).subscribe(res => this.messages = res));
  }

  onToggleTheme(t: Theme) {
    this.as.changeTheme(t);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private emitNumbers() {
    this.sub = timer(0, 500).subscribe(() => {
      this.myNumber$.next(Math.floor(Math.random() * 10));
    });
  }

  private buildSearchForm() {
    this.searchForm = this.fb.group({
      key: [null]
    });
  }

  private searchMessages(keyword: string): Observable<Message[]> {
    return this.messages$.pipe(
      map(res => res.filter(m => !keyword || m.message.toLowerCase().includes(keyword.toLowerCase())))
    );
  }

}
