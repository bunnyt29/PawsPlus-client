export interface MultiStepFormField {
  name: string;
  type: string;
  formControlName: number;
  validations?: { [key: string]: any };
  errors?: { [key: string]: any };
  placeholder?: string;
  imagePath?: string;
}
