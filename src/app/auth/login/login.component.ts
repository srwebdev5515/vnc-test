import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  invalidPassword: boolean;

  constructor(
    private fb: FormBuilder,
    private us: UserService
  ) {
    this.buildForm();
  }

  ngOnInit() {
  }

  onLogin() {
    const data = this.form.value;
    if (!this.us.logIn(data)) {
      this.invalidPassword = true;
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

}
