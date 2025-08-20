import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { FormlyFieldConfig } from '@ngx-formly/core';
@Injectable({
  providedIn: 'root'
})
export class Common {

    constructor(private http: HttpClient) { }

    getFileUrl(filePath: String)
    {
       return this.http.get(environment.imageUrl+filePath, {responseType: 'blob'});
    }


   filterModelByFormFields(data: any, fields: FormlyFieldConfig[]): any {
  const extractKeys = (fieldsList: FormlyFieldConfig[]): string[] => {
    return fieldsList.flatMap(field => {
      if (field.fieldGroup) {
        return extractKeys(field.fieldGroup);
      }
      return typeof field.key === 'string' ? [field.key] : [];
    });
  };

  let details = structuredClone(data[0]);
    const validKeys = extractKeys(fields);
    const filtered: any = {};
    for (const key of validKeys) {
      if (details.hasOwnProperty(key)) {
        filtered[key] = details[key];
      }
    }
    const finaldata = this.convertDatesForForm(filtered, fields);
    return finaldata;
  }



  convertDatesForForm(model: any, fields: FormlyFieldConfig[]): any {
  const extractDateKeys = (fieldsList: FormlyFieldConfig[]): string[] => {
    return fieldsList.flatMap(field => {
      if (field.fieldGroup) return extractDateKeys(field.fieldGroup);
      if (
        field.templateOptions?.type === 'date' ||
        field.type === 'datepicker' // in case you're using a custom type
      ) {
        return typeof field.key === 'string' ? [field.key] : [];
      }
      return [];
    });
  };

  const dateKeys = extractDateKeys(fields);
  const updatedModel = { ...model };
  dateKeys.forEach(key => {
    const value = updatedModel[key];
    if (value) {
      updatedModel[key] = this.toHtmlDateString(value);
    }
  });
  return updatedModel;
}

toHtmlDateString(value: string | Date): string {
  const d = new Date(value);
  return d.toISOString().split('T')[0]; // returns 'YYYY-MM-DD'
}


}
