import React from 'react';
import { useApp } from '../context/AppContext';
import FormPage from '../components/FormPage';
import { COUNTRIES } from '../utils/constants';

const WorkEducation = () => {
  const { state, updateState } = useApp();
  const data = state.workEducation || {};

  const handleChange = (field, value) => {
    updateState(`workEducation.${field}`, value);
  };

  return (
    <FormPage
      title="Work / Education / Training"
      sectionId="work"
      prevRoute="/application/family"
      prevLabel="Family"
      nextRoute="/application/security1"
      nextLabel="Security Part 1"
    >
      <div className="space-y-3">
        <h3 className="text-[#003366] font-bold text-[12px] border-b border-[#CCCCCC] pb-1">Present Work/Occupation</h3>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Primary Occupation <span className="text-[#CC0000]">*</span></label>
          </div>
          <select className="w-[250px] h-[20px] text-[11px] border-[#7F9DB9] bg-white"
            value={data.primaryOccupation || ''} onChange={(e) => handleChange('primaryOccupation', e.target.value)}>
            <option value="">- SELECT ONE -</option>
            <option value="AGRICULTURE">AGRICULTURE</option>
            <option value="ARTIST/PERFORMER">ARTIST/PERFORMER</option>
            <option value="BUSINESS">BUSINESS</option>
            <option value="COMMUNICATIONS">COMMUNICATIONS</option>
            <option value="COMPUTER SCIENCE">COMPUTER SCIENCE</option>
            <option value="CULINARY/FOOD">CULINARY/FOOD SERVICES</option>
            <option value="EDUCATION">EDUCATION</option>
            <option value="ENGINEERING">ENGINEERING</option>
            <option value="GOVERNMENT">GOVERNMENT</option>
            <option value="HOMEMAKER">HOMEMAKER</option>
            <option value="LEGAL">LEGAL PROFESSION</option>
            <option value="MEDICAL">MEDICAL/HEALTH</option>
            <option value="MILITARY">MILITARY</option>
            <option value="NATURAL SCIENCES">NATURAL SCIENCES</option>
            <option value="PHYSICAL SCIENCES">PHYSICAL SCIENCES</option>
            <option value="RELIGIOUS">RELIGIOUS</option>
            <option value="RESEARCH">RESEARCH</option>
            <option value="RETIRED">RETIRED</option>
            <option value="SOCIAL SCIENCE">SOCIAL SCIENCE</option>
            <option value="STUDENT">STUDENT</option>
            <option value="UNEMPLOYED">UNEMPLOYED</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Present Employer or School Name</label>
          </div>
          <input type="text" className="w-[300px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.presentEmployer || ''} onChange={(e) => handleChange('presentEmployer', e.target.value)} />
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Address</label>
          </div>
          <input type="text" className="w-[300px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.employerAddress || ''} onChange={(e) => handleChange('employerAddress', e.target.value)} />
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">City</label>
          </div>
          <input type="text" className="w-[200px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.employerCity || ''} onChange={(e) => handleChange('employerCity', e.target.value)} />
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Country</label>
          </div>
          <select className="w-[250px] h-[20px] text-[11px] border-[#7F9DB9] bg-white"
            value={data.employerCountry || ''} onChange={(e) => handleChange('employerCountry', e.target.value)}>
            <option value="">- SELECT ONE -</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Phone Number</label>
          </div>
          <input type="text" className="w-[200px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.employerPhone || ''} onChange={(e) => handleChange('employerPhone', e.target.value)} />
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Monthly Income (local currency)</label>
          </div>
          <input type="text" className="w-[120px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.monthlyIncome || ''} onChange={(e) => handleChange('monthlyIncome', e.target.value)} />
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Job Title</label>
          </div>
          <input type="text" className="w-[250px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.jobTitle || ''} onChange={(e) => handleChange('jobTitle', e.target.value)} />
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Briefly Describe Your Duties</label>
          </div>
          <textarea className="w-[300px] h-[60px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.briefDescription || ''} onChange={(e) => handleChange('briefDescription', e.target.value)} />
        </div>

        <h3 className="text-[#003366] font-bold text-[12px] border-b border-[#CCCCCC] pb-1 mt-4">Education</h3>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Highest Level of Education</label>
          </div>
          <select className="w-[250px] h-[20px] text-[11px] border-[#7F9DB9] bg-white"
            value={data.educationLevel || ''} onChange={(e) => handleChange('educationLevel', e.target.value)}>
            <option value="">- SELECT ONE -</option>
            <option value="NO FORMAL EDUCATION">NO FORMAL EDUCATION</option>
            <option value="PRIMARY SCHOOL">PRIMARY SCHOOL</option>
            <option value="HIGH SCHOOL">HIGH SCHOOL</option>
            <option value="VOCATIONAL SCHOOL">VOCATIONAL SCHOOL</option>
            <option value="SOME UNIVERSITY">SOME UNIVERSITY COURSES</option>
            <option value="BACHELORS">BACHELOR'S DEGREE</option>
            <option value="MASTERS">MASTER'S DEGREE</option>
            <option value="DOCTORATE">DOCTORATE</option>
            <option value="PROFESSIONAL">PROFESSIONAL DEGREE</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Name of Institution</label>
          </div>
          <input type="text" className="w-[300px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.institutionName || ''} onChange={(e) => handleChange('institutionName', e.target.value)} />
        </div>

        <div className="grid grid-cols-[35%_65%] gap-2 items-start">
          <div className="text-right pt-1">
            <label className="text-[12px] font-bold text-[#333333]">Course of Study</label>
          </div>
          <input type="text" className="w-[250px] h-[20px] border-[#7F9DB9] px-1 text-[11px]"
            value={data.courseOfStudy || ''} onChange={(e) => handleChange('courseOfStudy', e.target.value)} />
        </div>
      </div>
    </FormPage>
  );
};

export default WorkEducation;
