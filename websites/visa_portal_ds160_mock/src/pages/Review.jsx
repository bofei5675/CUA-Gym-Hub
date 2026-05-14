import React from 'react';
import { useApp } from '../context/AppContext';
import FormPage from '../components/FormPage';

const ReviewSection = ({ title, fields }) => (
  <div className="mb-4">
    <h3 className="text-[#003366] font-bold text-[12px] border-b border-[#CCCCCC] pb-1 mb-2 bg-[#E8F0F8] px-2 py-1">
      {title}
    </h3>
    <div className="space-y-1 pl-2">
      {fields.map(({ label, value }) => (
        value !== undefined && value !== null && value !== '' ? (
          <div key={label} className="grid grid-cols-[40%_60%] gap-1 text-[11px]">
            <span className="font-bold text-[#333333] text-right pr-2">{label}:</span>
            <span className="text-black">{String(value)}</span>
          </div>
        ) : null
      ))}
    </div>
  </div>
);

const Review = () => {
  const { state } = useApp();
  const p1 = state.personalInfo?.personal1 || {};
  const p2 = state.personalInfo?.personal2 || {};
  const addr = state.addressAndPhone || {};
  const passport = state.passport || {};
  const travel = state.travel || {};
  const tc = state.travelCompanions || {};
  const prevTravel = state.previousUSTravel || {};
  const usContact = state.usContact || {};
  const family = state.family || {};
  const work = state.workEducation || {};

  return (
    <FormPage
      title="Review"
      sectionId="review"
      prevRoute="/application/photo"
      prevLabel="Photo"
      nextRoute="/application/sign"
      nextLabel="Sign and Submit"
    >
      <div className="space-y-2">
        <div className="bg-[#FFFFCC] p-2 mb-4 border border-[#CCCCCC] text-[11px]">
          <span className="font-bold text-[#990000]">Review your application carefully.</span> If any information is incorrect, please go back and make the necessary corrections before signing and submitting.
        </div>

        <ReviewSection
          title="Personal Information 1"
          fields={[
            { label: 'Surnames', value: p1.surname },
            { label: 'Given Names', value: p1.givenName },
            { label: 'Full Name in Native Alphabet', value: p1.nativeFullNameDoesNotApply ? 'Does Not Apply' : p1.nativeFullName },
            { label: 'Other Names Used', value: p1.otherNamesUsed },
            { label: 'Telecode Name', value: p1.telecodeName },
            { label: 'Sex', value: p1.sex },
            { label: 'Marital Status', value: p1.maritalStatus },
            { label: 'Date of Birth', value: p1.dobDay && p1.dobMonth && p1.dobYear ? `${p1.dobDay}-${p1.dobMonth}-${p1.dobYear}` : '' },
            { label: 'City of Birth', value: p1.pobCity },
            { label: 'State/Province of Birth', value: p1.pobStateDoesNotApply ? 'Does Not Apply' : p1.pobState },
            { label: 'Country of Birth', value: p1.pobCountry },
          ]}
        />

        <ReviewSection
          title="Personal Information 2"
          fields={[
            { label: 'Nationality', value: p2.nationality },
            { label: 'Other Nationalities', value: p2.otherNationalities },
            { label: 'National ID', value: p2.nationalIdDoesNotApply ? 'Does Not Apply' : p2.nationalId },
            { label: 'U.S. SSN', value: p2.ssnDoesNotApply ? 'Does Not Apply' : p2.ssn },
            { label: 'U.S. Taxpayer ID', value: p2.itinDoesNotApply ? 'Does Not Apply' : p2.itin },
          ]}
        />

        <ReviewSection
          title="Address and Phone"
          fields={[
            { label: 'Street Address', value: addr.homeAddress?.street1 },
            { label: 'City', value: addr.homeAddress?.city },
            { label: 'State/Province', value: addr.homeAddress?.state },
            { label: 'Postal Code', value: addr.homeAddress?.zip },
            { label: 'Country', value: addr.homeAddress?.country },
            { label: 'Primary Phone', value: addr.primaryPhone },
            { label: 'Email', value: addr.primaryEmail },
          ]}
        />

        <ReviewSection
          title="Passport"
          fields={[
            { label: 'Passport Type', value: passport.passportType },
            { label: 'Passport Number', value: passport.passportNumber },
            { label: 'Issuing Country', value: passport.issuingCountry },
            { label: 'City Issued', value: passport.issuingCity },
            { label: 'Issuance Date', value: passport.issuanceDate },
            { label: 'Expiration Date', value: passport.expirationDateDoesNotApply ? 'Does Not Apply' : passport.expirationDate },
            { label: 'Lost or Stolen', value: passport.lostOrStolen },
          ]}
        />

        <ReviewSection
          title="Travel"
          fields={[
            { label: 'Purpose of Trip', value: travel.purposeOfTrip },
            { label: 'Specific Travel Plans', value: travel.specificTravelPlans },
            { label: 'Arrival Date', value: travel.arrivalDate },
            { label: 'Arrival City', value: travel.arrivalCity },
            { label: 'Departure Date', value: travel.departureDate },
            { label: 'Address Where Staying', value: travel.addressWhereStaying },
            { label: 'Who is Paying', value: travel.payingForTrip },
          ]}
        />

        <ReviewSection
          title="Travel Companions"
          fields={[
            { label: 'Traveling with Others', value: tc.travelingWithOthers },
            { label: 'Group Name', value: tc.groupName },
          ]}
        />

        <ReviewSection
          title="Previous U.S. Travel"
          fields={[
            { label: 'Previously in U.S.', value: prevTravel.previouslyInUS },
            { label: 'Previous Visa Issued', value: prevTravel.previousVisaIssued },
            { label: 'Visa Ever Refused', value: prevTravel.visaEverRefused },
            { label: 'Immigration Petition Filed', value: prevTravel.immigrationPetitionFiled },
          ]}
        />

        <ReviewSection
          title="U.S. Contact"
          fields={[
            { label: 'Contact Name', value: usContact.contactName },
            { label: 'Organization', value: usContact.organizationName },
            { label: 'Relationship', value: usContact.relationship },
            { label: 'Address', value: usContact.address },
            { label: 'City', value: usContact.city },
            { label: 'State', value: usContact.state },
            { label: 'ZIP', value: usContact.zip },
            { label: 'Phone', value: usContact.phone },
          ]}
        />

        <ReviewSection
          title="Family Information"
          fields={[
            { label: "Father's Surname", value: family.fatherSurname },
            { label: "Father's Given Names", value: family.fatherGivenName },
            { label: "Father in U.S.", value: family.fatherInUS },
            { label: "Mother's Surname", value: family.motherSurname },
            { label: "Mother's Given Names", value: family.motherGivenName },
            { label: "Mother in U.S.", value: family.motherInUS },
          ]}
        />

        <ReviewSection
          title="Work / Education / Training"
          fields={[
            { label: 'Primary Occupation', value: work.primaryOccupation },
            { label: 'Employer/School', value: work.presentEmployer },
            { label: 'Job Title', value: work.jobTitle },
            { label: 'Education Level', value: work.educationLevel },
            { label: 'Institution Name', value: work.institutionName },
            { label: 'Course of Study', value: work.courseOfStudy },
          ]}
        />

        <div className="bg-[#E8F0F8] p-3 border border-[#99CCFF] text-[11px] mt-4">
          <span className="font-bold text-[#003366]">Security and Background:</span> All security questions have been answered. Review your answers in the Security sections (Parts 1-5) if you need to make corrections.
        </div>
      </div>
    </FormPage>
  );
};

export default Review;
