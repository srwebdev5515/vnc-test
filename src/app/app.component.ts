import { Component } from '@angular/core';
import { OnlineCheckService, AppService } from './services';
import { Theme } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'vnc-test';
  theme: Theme;

  constructor(private as: AppService) {
    this.as.currentTheme.subscribe(t => this.theme = t);
  }

}
