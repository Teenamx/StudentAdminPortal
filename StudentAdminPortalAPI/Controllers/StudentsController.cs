using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StudentAdminPortal.Api.DataModels;
using StudentAdminPortal.Api.DomainModels;
using StudentAdminPortal.Api.Repositories;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace StudentAdminPortal.Api.Controllers
{
    [ApiController]
    public class StudentsController : Controller
    {
        private readonly IStudentRepository studentRepository;
        private readonly IMapper mapper;
        private readonly IImageRepository imageRepository;

        public StudentsController(IStudentRepository studentRepository,IMapper mapper,IImageRepository imageRepository)
        {
            this.studentRepository = studentRepository;
            this.mapper = mapper;
            this.imageRepository = imageRepository;
        }
        [HttpGet]
        [Route("[controller]")]
        public async Task<IActionResult> GetAllStudents()
        { 
            var students= await studentRepository.GetStudentsAsync();



            //var domainModelStudents = new List<StudentDto>();
            //foreach(var student in students)
            //{

            //    domainModelStudents.Add(new StudentDto()
            //    {
            //        Id = student.Id,
            //        FirstName = student.FirstName,
            //        LastName = student.LastName,
            //        DateOfBirth = student.DateOfBirth,
            //        Email = student.Email,
            //        Mobile = student.Mobile,
            //        ProfileImageUrl = student.ProfileImageUrl,
            //        GenderId = student.GenderId,
            //        Address=new AddressDto()
            //        {
            //            Id=student.Id,
            //            PhysicalAddress=student.Address.PhysicalAddress,
            //            PostalAddress=student.Address.PostalAddress,

            //        },
            //        Gender=new GenderDto()
            //        {
            //            Id=student.Gender.Id
            //        }


            //    });
            //}
            //return Ok(domainModelStudents);
           return Ok(mapper.Map<List<StudentDto>>(students));



        }
        [HttpGet]
        [Route("[controller]/{studentId:guid}"),ActionName("GetStudentDetailAsync")]
        public async Task<IActionResult> GetStudentDetailAsync([FromRoute] Guid studentId)
        {
                var student = await studentRepository.GetStudentDetailAsync(studentId);
            if(student==null)
            {
                return NotFound();
            }

            return Ok(mapper.Map<StudentDto>(student));
        }
        [HttpPut]
        [Route("[Controller]/{studentId:guid}")]
        public async Task<IActionResult> UpdateStudentAsync([FromRoute] Guid studentId,[FromBody] UpdateStudentRequest request)
        {
            if(await studentRepository.Exists(studentId))
            {
             var updatedStudent= await studentRepository.updateStudent(studentId, mapper.Map<Student>(request));

                return Ok(mapper.Map<StudentDto>(updatedStudent));
            }            
            
            return NotFound();
            
            
        }
        [HttpDelete]
        [Route("[controller]/{studentId:guid}")]
        public async Task<IActionResult> DeleteStudentAsync([FromRoute] Guid studentId)
        {
            if(await studentRepository.Exists(studentId))
            {

                var student = await studentRepository.DeleteStudent(studentId);
                return Ok(mapper.Map<StudentDto>(student));
            }
            return NotFound();

        }
        [HttpPost]
        [Route("[controller]/Add")]
        public async Task<IActionResult> AddStudentAsync([FromBody] AddStudentRequest request) 
        {
          var student=  await studentRepository.AddStudent(mapper.Map<Student>(request));
          
         return CreatedAtAction(nameof(GetStudentDetailAsync), new {studentId=student.Id }, mapper.Map<StudentDto>(student));


        }
        [HttpPost]
        [Route("[controller]/{studentId:guid}/upload-image")]
        public async Task<IActionResult> UploadImage([FromRoute] Guid studentId,IFormFile profileImage)
        {
            var validExtensions = new List<string>
            {
                ".jpeg",
                ".png",
                ".gif",
                ".jpg"
            };
            if (profileImage != null)
            {
                var extension = Path.GetExtension(profileImage.FileName);
                if (validExtensions.Contains(extension))
                {
                    if (await studentRepository.Exists(studentId))
                    {
                        var fileName = Guid.NewGuid() + Path.GetExtension(profileImage.FileName);
                        var fileImagePath = await imageRepository.Upload(profileImage, fileName);
                        if (await studentRepository.UpdateProfileImage(studentId, fileImagePath))
                        {
                            return Ok(fileImagePath);
                        }
                        return StatusCode(StatusCodes.Status500InternalServerError, "Error uploading Image");
                    }
                }
                return BadRequest("This is not a valid Image format");
               
            }
            return NotFound();
        }
    }
}
