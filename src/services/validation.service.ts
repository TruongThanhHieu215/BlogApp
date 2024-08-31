import { Injectable } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  constructor() { }

  NoWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let controlVal = control.value;
      if (typeof controlVal === "number") {
        controlVal = `${controlVal}`;
      }
      const isWhitespace = (controlVal || "").trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    };
  }
}
