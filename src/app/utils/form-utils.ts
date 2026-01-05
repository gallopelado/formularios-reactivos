import { AbstractControl, FormArray, FormGroup, ValidationErrors } from '@angular/forms';

async function sleep() {
  return new Promise( resolve => {
    setTimeout(() => {
      resolve(true);
    }, 2500);
  });
}
export class FormUtils {

  static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';

  static getTextError(errors: ValidationErrors): string | null {
    for ( const key of Object.keys(errors) ) {
      switch(key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo de ${ errors['minlength'].requiredLength } caracteres`;
        case 'min':
          return `Valor mínimo de ${ errors['min'].min } caracteres`;
        case 'emailTaken':
          return `El correo electrónico ya está siendo usado por otro usuario`;
        case 'noStrider':
          return 'El usuario no puede ser strider';
        case 'pattern':
          if ( errors['pattern'].requiredPattern == FormUtils.emailPattern ) {
            return 'El valor ingresado no luce como un email';
          }
          return 'Error de patrón contra expresión regular';

        default:
          return `Error de validación no controlado ${key}`;

      }
    }
    return null;
  }

  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return ( !!form.controls[fieldName].errors && form.controls[fieldName].touched );
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {

    if ( !form.controls[fieldName] ) return null;

    const errors = form.controls[fieldName].errors ?? {};

    return FormUtils.getTextError(errors);

  }

  static isValidFieldInArray(formArray: FormArray, index: number) {
    return (
      formArray.controls[index].errors && formArray.controls[index].touched
    );
  }

  static getFieldErrorInArray(formArray: FormArray, index: number): string | null {

    if ( formArray.controls.length === 0 ) return null;

    const errors = formArray.controls[index].errors ?? {};

    return FormUtils.getTextError(errors);

  }

  static isFieldOneEqualFieldTwo( field1: string, field2: string ) {
    return ( formGroup: AbstractControl ) => {
      const field1Value = formGroup.get(field1)?.value;
      const field2Value = formGroup.get(field2)?.value;

      return field1Value === field2Value ? null : { passwordNotEqual: true };
    };
  }

  static async checkingServerResponse(control: AbstractControl): Promise<ValidationErrors | null> {

    console.log('Validando contra servidor');
    await sleep(); // 2.5 segundos

    const formValue = control.value;

    if ( formValue === "hola@mundo.com" ) {
      return {
        emailTaken: true
      };
    }

    return null;
  }

  // static notStrider(field: string): ValidationErrors | null {

  //   return ( formGroup: AbstractControl ) => {
  //     const userNameValue = formGroup.get(field)?.value.toLocaleLowerCase();
  //     return userNameValue.includes("strider") ? { noStrider: true } : null;
  //   }
  //   // { noStrider: true ?? null }
  // }

  // otra forma
  static notStrider(control: AbstractControl): ValidationErrors | null {
    const userNameValue = control.value;
    return userNameValue === 'strider' ? { noStrider: true } : null;
  }

}
