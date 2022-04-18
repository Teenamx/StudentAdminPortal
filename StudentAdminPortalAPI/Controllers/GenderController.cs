using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using StudentAdminPortal.Api.DomainModels;
using StudentAdminPortal.Api.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentAdminPortal.Api.Controllers
{
    [ApiController]
    public class GenderController : Controller
    {
        private readonly IStudentRepository studentRepository;
        private readonly IMapper mapper;

        public GenderController(IStudentRepository studentRepository ,IMapper mapper)
        {
            this.studentRepository = studentRepository;
            this.mapper = mapper;
        }
        [HttpGet]
        [Route("[controller]")]
        public async Task<IActionResult> GetAllGenders()
        {
         var genderList= await studentRepository.GetGendersAsync();
            if(genderList==null||!genderList.Any())
            {
                return NotFound();
            }
            return Ok(mapper.Map<List<GenderDto>>(genderList));
        }
      
    }
}
