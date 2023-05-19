import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MyErrorStateMatcher } from 'src/app/shared/matcher/error-state-matcher';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  hide = true;

  loading: boolean = false;

  formGroup: FormGroup;

  matcher = new MyErrorStateMatcher();

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.initForm();
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  login(): void {
    if (this.formGroup.valid) {
      this.loading = true;
      this.authService
        .login(this.formGroup.value.email, this.formGroup.value.password)
        .subscribe((res: any) => {
          if (res) {
            if (res.status === 'success') {
              this.router.navigate(['/system']);
            }
          }
          this.loading = false;
        });
    }
  }
}
