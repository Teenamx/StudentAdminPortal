import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { AddStudentRequest } from '../models/api-models/add-student-request.model';
import { Student } from '../models/api-models/student.model';
import { UpdateStudentRequest } from '../models/api-models/update-student-request.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private baseUrl=environment.baseUrl;
  constructor(private http:HttpClient) { }
  getStudents():Observable<Student[]>
  {
   return this.http.get<Student[]>(this.baseUrl+'/Students')
  }
  getStudent(studentId:string):Observable<Student>
  {
   return this.http.get<Student>(this.baseUrl+'/Students/'+studentId);
  }
  updateStudent(studentId:string ,studentRequest:Student):Observable<Student>
  {
     const updateStudentRequest:UpdateStudentRequest={
       firstName:studentRequest.firstName,
       lastName:studentRequest.lastName,
       dateOfBirth:studentRequest.dateOfBirth,
       email:studentRequest.email,
       mobile:studentRequest.mobile,
       genderId:studentRequest.genderId,
       physicalAddress:studentRequest.address.physicalAddress,
       postalAddress:studentRequest.address.postalAddress
     };
     return this.http.put<Student>(this.baseUrl+'/Students/'+studentId,updateStudentRequest);
  }
  deleteStudent(studentId:string):Observable<Student>
  {
    return  this.http.delete<Student>(this.baseUrl+'/Students/'+studentId);
  }
  addStudent(studentRequest:Student):Observable<Student>
  {
    const addStudentRequest:AddStudentRequest={
      firstName:studentRequest.firstName,
      lastName:studentRequest.lastName,
      dateOfBirth:studentRequest.dateOfBirth,
      email:studentRequest.email,
      mobile:studentRequest.mobile,
      genderId:studentRequest.genderId,
      physicalAddress:studentRequest.address.physicalAddress,
      postalAddress:studentRequest.address.postalAddress
    };
    return this.http.post<Student>(this.baseUrl+'/Students/add',addStudentRequest);
  }
  uploadImage(studentId:string,file:File):Observable<any>
  {
    const formData=new FormData();
    formData.append("profileImage",file);
    return this.http.post(this.baseUrl+'/students/'+studentId+'/upload-image',
    formData,{responseType:'text'}
    );

  }
  getImagePath(relativePath:string)
  {
    return `${this.baseUrl}/${relativePath}`;
  }
}

