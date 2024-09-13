import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent implements OnInit {

  @Output() login = new EventEmitter<string>();

  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      allyCode: ['', [Validators.required, Validators.pattern(/^(\d{3}-?){2}\d{3}$/)]]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const allyCode = this.loginForm.get('allyCode')?.value.replace(/-/g, '');
      this.login.emit(allyCode);
    }
  }

  // displays as 123-456-789
  formatAllyCode(event: any): void {
    let allyCode = event.target.value.replace(/\D/g, '');

    if (allyCode.length > 9) {
      allyCode = allyCode.substr(0, 9);
    }

    const parts = [];
    for (let i = 0; i <allyCode.length; i += 3) {
      parts.push(allyCode.substr(i, 3));
    }

    event.target.value = parts.join('-');
    this.loginForm.get('allyCode')?.setValue(event.target.value);
  }
}
