import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  selector: 'app-register-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {

  //! Tarea
  /**
   * name -> obligatorio
   * email -> obligatorio y un email (Validators.email?)
   * username -> obligatorio, minlength 6
   * password -> obligatorio, minlength 6
   * password2 -> obligatorio, minlength 6
   */
  private fb = inject(FormBuilder);
  formUtils = FormUtils;

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.pattern( FormUtils.namePattern )]],
    email: ['',
      [
        Validators.required,
        Validators.pattern( FormUtils.emailPattern ),
      ], [FormUtils.checkingServerResponse]
    ],
    username: ['', [Validators.required, Validators.minLength(6), , Validators.pattern( FormUtils.notOnlySpacesPattern )]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password2: ['', [Validators.required]],
  }, {
    validators: [
      this.formUtils.isFieldOneEqualFieldTwo('password', 'password2')
    ]
  });

  onSubmit() {
    console.log(this.myForm.value);
    this.myForm.markAllAsTouched();
  }
}
