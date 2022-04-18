using StudentAdminPortal.Api.DataModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentAdminPortal.Api.Repositories
{
   public interface IStudentRepository
    {
      Task<List<Student>> GetStudentsAsync();
      Task<Student> GetStudentDetailAsync(Guid studentId);
       Task<List<Gender>> GetGendersAsync();

       Task<bool> Exists(Guid studentId);

        Task<Student> updateStudent(Guid studentId, Student request);
        Task<Student> DeleteStudent(Guid studentId);

        Task<Student> AddStudent(Student request);

        Task<bool> UpdateProfileImage(Guid studentId, string profileImageUrl);

    }
}
