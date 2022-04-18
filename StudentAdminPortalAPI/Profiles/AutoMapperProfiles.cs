using AutoMapper;
using StudentAdminPortal.Api.DataModels;
using StudentAdminPortal.Api.DomainModels;
using StudentAdminPortal.Api.Profiles.AfterMaps;

namespace StudentAdminPortal.Api.Profiles
{
    public class AutoMapperProfiles :Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Student, StudentDto>().ReverseMap();
            CreateMap<Gender, GenderDto>().ReverseMap();
            CreateMap<Address, AddressDto>().ReverseMap();
            CreateMap<UpdateStudentRequest, Student>()
               .AfterMap<UpdateStudentRequestAfterMaps>();
            CreateMap<AddStudentRequest, Student>()
                .AfterMap<AddStudentRequestAfterMap>();

        }
    }
}
