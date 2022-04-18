import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Gender } from 'src/app/models/ui-models/Gender.model';
import { Student } from 'src/app/models/ui-models/student.model';
import { GenderService } from 'src/app/services/gender.service';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit {
  displayProfileImageUrl='';
  studentId:string |null;
  student:Student=
  {
    id:'',
    firstName:'',
    lastName:'',
    dateOfBirth:'',
    email:'',
    mobile:'0',
    profileImageUrl:'',
    genderId:'',
    gender:{
      id:'',
      description:''
    },
    address:{
      id:'',
      physicalAddress:'',
      postalAddress:''
    }

  };
  genderList:Gender[]=[];
  isNewStudent=false;
  header='';
  constructor(private readonly studentService:StudentService,
    private readonly route:ActivatedRoute,
    private readonly genderService:GenderService,
    private snackbar:MatSnackBar,
    private router:Router) { }
@ViewChild('studentDetailForm') studentDetailForm?:NgForm;
  ngOnInit(): void {
   this.route.paramMap.subscribe(
     (params)=>{
          this.studentId = params.get('id');
          if(this.studentId)
          {
            if(this.studentId.toLowerCase()==='Add'.toLowerCase())
            {
              this.isNewStudent=true;
              this.header='Add New Student';
              this.setImage();
            }
            else
            {
              this.isNewStudent=false;
              this.header='Edit Student';
              this.studentService.getStudent(this.studentId).subscribe(
                (success)=>
                {
               this.student=success;
               this.setImage();
                },
                (error)=>
                {
                  this.setImage();
                }
              );
            }

            this.genderService.getGenderList().subscribe(
              (successResponse)=>
              {
               this.genderList=successResponse;
              }
            )
          }
     }
   )


  }

  onUpdate()
  {
    if(this.studentDetailForm.form.valid)
    {
    this.studentService.updateStudent(this.student.id,this.student)
    .subscribe(
      (successResponse)=>
      {
        this.snackbar.open('Student updated successfully',undefined,{
          duration:2000
        });
      },
      (error)=>
      {

      }
      );
    }

  }

  onDelete()
  {
    this.studentService.deleteStudent(this.student.id)
    .subscribe(
      ()=>{
        this.snackbar.open('Student deleted successfully',undefined,{
          duration:2000
        });
        setTimeout(() => {
         this.router.navigateByUrl('students');
        }, 2000);
      },
      (error)=>{

      }
    )
  }

  onAdd()
  {
    if(this.studentDetailForm.form.valid)
    {
      this.studentService.addStudent(this.student).subscribe(
        (successResponse)=>
       {
        this.snackbar.open('Student a successfully',undefined,{
          duration:2000
        });
       setTimeout(()=>{
         this.router.navigateByUrl(`students/${successResponse.id}`);
       },2000);
        } ,
        (errorResponse)=>
        {
            console.log(errorResponse);
        }   )
    }

  }

  private setImage()
  {
    if(this.student.profileImageUrl)
    {
      this.displayProfileImageUrl=this.studentService.getImagePath(this.student.profileImageUrl);
    }
    else
    {
      this.displayProfileImageUrl='/assets/image.png'
    }
  }
  uploadImage(event:any)
  {
   if(this.studentId)
   {
     const imageFile:File=event.target.files[0];
     console.log(event);
     console.log(event.target.files[0]);

     this.studentService.uploadImage(this.studentId,imageFile).subscribe(
       (successResponse)=>{
          this.student.profileImageUrl=successResponse;
          this.setImage();
          this.snackbar.open('Profile image updated',undefined,{
            duration:2000
          });
       },
       (errorResponse)=>
       {

       }
     )




     }
   }
  }


