import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from './student.service';

import { Student } from '../models/ui-models/student.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  @ViewChild(MatPaginator) matPaginator!:MatPaginator;
  @ViewChild(MatSort) matSort!:MatSort;
  displayedColumns: string[] = ['firstName', 'lastName', 'dateOfBirth', 'email','mobile','gender','edit'];
  constructor(private studentService:StudentService) { }
 students:Student[]=[];
 dataSource:MatTableDataSource<Student>=new MatTableDataSource<Student>();

  ngOnInit(): void {
    this.studentService.getStudents().subscribe(
     (successResponse)=>
     {
       this.students=successResponse;
       this.dataSource=new MatTableDataSource<Student>(this.students);
       if(this.matPaginator)
       this.dataSource.paginator=this.matPaginator;
       if(this.matSort)
        this.dataSource.sort=this.matSort;

     },
     (errorResponse)=>
     {
       console.log(errorResponse);
     }
    )
  }
  filterStudent(searchText:HTMLInputElement)
  {
   // console.log(searchText.value);
    this.dataSource.filter=searchText.value.trim().toLowerCase();
  }

}
