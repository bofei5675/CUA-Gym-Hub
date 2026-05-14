# DS-160 Mock — Data Model

This document defines all entity types, their fields, relationships, and realistic example values for the DS-160 mock application. The `createInitialData()` function in `AppContext.jsx` (or a separate `dataManager.js`) should initialize state matching this structure.

---

## Top-Level State Shape

```javascript
{
  ds160Application: { ... },   // Application metadata
  personalInfo: {
    personal1: { ... },        // Personal Information Part 1
    personal2: { ... },        // Personal Information Part 2
  },
  addressAndPhone: { ... },    // Address & Phone Information
  passport: { ... },           // Passport Information
  travel: { ... },             // Travel Information
  travelCompanions: { ... },   // Travel Companions
  previousUSTravel: { ... },   // Previous U.S. Travel
  usContact: { ... },          // U.S. Contact Information
  family: { ... },             // Family Information
  workEducation: { ... },      // Work / Education / Training
  security: {                  // Security and Background
    part1: { ... },
    part2: { ... },
    part3: { ... },
    part4: { ... },
    part5: { ... },
  },
  photo: { ... },              // Photo Upload
  signature: { ... },          // Sign & Submit
  meta: { ... },               // Application metadata
}
```

---

## Entity Definitions

### 1. ds160Application (Application Metadata)

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| applicationId | string | `"AA005P4IWT"` | Generated: `AA00` + 6 random alphanumeric chars |
| location | string | `"CHINA, BEIJING"` | Selected embassy/consulate location |
| locationCode | string | `"CHN"` | 3-letter location code |
| status | string | `"In Progress"` | `"Not Started"` / `"In Progress"` / `"Submitted"` |
| createdAt | string (ISO) | `"2026-03-09T10:30:00Z"` | |
| updatedAt | string (ISO) | `"2026-03-09T11:45:00Z"` | Updated on each save |
| currentSection | string | `"personal1"` | Tracks which section user is on |
| completedSections | string[] | `["personal1", "personal2"]` | Sections that passed validation |
| securityQuestion | string | `"What is your mother's maiden name?"` | Selected during setup |
| securityAnswer | string | `"SMITH"` | Answer for retrieval |

### 2. personalInfo.personal1 (Personal Information Part 1)

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| surname | string | `"WANG"` | Required. Uppercase. As in passport |
| givenName | string | `"XIAOMING"` | Required. Uppercase |
| nativeFullName | string | `"王小明"` | Native alphabet characters |
| nativeFullNameDoesNotApply | boolean | `false` | Disables nativeFullName if true |
| otherNamesUsed | string | `"No"` | `"Yes"` / `"No"` |
| otherNames | array | `[{surname: "WONG", givenName: "MING"}]` | If otherNamesUsed = "Yes" |
| telecodeName | string | `"No"` | `"Yes"` / `"No"` |
| telecodeNames | array | `[{surname: "7234", givenName: "1234"}]` | 4-digit telecode numbers |
| sex | string | `"Male"` | `"Male"` / `"Female"` |
| maritalStatus | string | `"SINGLE"` | `"MARRIED"` / `"SINGLE"` / `"WIDOWED"` / `"DIVORCED"` / `"LEGALLY SEPARATED"` / `"OTHER"` |
| dobDay | string | `"15"` | DD format |
| dobMonth | string | `"MAR"` | 3-letter month abbreviation: JAN-DEC |
| dobYear | string | `"1990"` | YYYY format |
| pobCity | string | `"BEIJING"` | City of birth |
| pobState | string | `""` | State/province of birth |
| pobStateDoesNotApply | boolean | `true` | Disables pobState if true |
| pobCountry | string | `"CHINA"` | Country dropdown selection |

### 3. personalInfo.personal2 (Personal Information Part 2)

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| nationality | string | `"CHINA"` | Country dropdown |
| otherNationalities | string | `"No"` | `"Yes"` / `"No"` |
| otherNationalityList | array | `["CANADA"]` | If otherNationalities = "Yes" |
| permanentResident | string | `"No"` | `"Yes"` / `"No"` — permanent resident of other country? |
| permanentResidentCountry | string | `""` | If permanentResident = "Yes" |
| nationalId | string | `"110101199003150011"` | National identification number |
| nationalIdDoesNotApply | boolean | `false` | |
| ssn | string | `""` | U.S. Social Security Number |
| ssnDoesNotApply | boolean | `true` | |
| itin | string | `""` | U.S. Taxpayer ID |
| itinDoesNotApply | boolean | `true` | |

### 4. addressAndPhone (Address & Phone Information)

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| homeAddress.street1 | string | `"123 MAIN STREET APT 4B"` | Required |
| homeAddress.street2 | string | `""` | Optional second line |
| homeAddress.city | string | `"BEIJING"` | Required |
| homeAddress.state | string | `"CHAOYANG"` | |
| homeAddress.stateDoesNotApply | boolean | `false` | |
| homeAddress.zip | string | `"100020"` | Postal code |
| homeAddress.zipDoesNotApply | boolean | `false` | |
| homeAddress.country | string | `"CHINA"` | Country dropdown |
| mailingSameAsHome | string | `"Yes"` | `"Yes"` / `"No"` |
| mailingAddress | object | `{...}` | Same structure as homeAddress; only if mailingSameAsHome = "No" |
| primaryPhone | string | `"+86-10-12345678"` | Required |
| secondaryPhone | string | `""` | Optional |
| secondaryPhoneDoesNotApply | boolean | `true` | |
| workPhone | string | `""` | Optional |
| workPhoneDoesNotApply | boolean | `true` | |
| primaryEmail | string | `"xiaoming.wang@email.com"` | Required |
| secondaryEmail | string | `""` | Optional |
| secondaryEmailDoesNotApply | boolean | `true` | |
| socialMedia | array | `[{platform: "LINKEDIN", handle: "xiaomingwang"}]` | Social media presence |
| additionalSocialMedia | string | `"No"` | `"Yes"` / `"No"` |
| additionalWebsite | string | `"No"` | `"Yes"` / `"No"` |

### 5. passport (Passport Information)

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| passportType | string | `"REGULAR"` | `"REGULAR"` / `"OFFICIAL"` / `"DIPLOMATIC"` / `"LAISSEZ-PASSER"` / `"OTHER"` |
| passportNumber | string | `"E12345678"` | Required |
| passportBookNumber | string | `""` | |
| passportBookNumberDoesNotApply | boolean | `true` | |
| issuingCountry | string | `"CHINA"` | Country dropdown |
| issuingCity | string | `"BEIJING"` | |
| issuingState | string | `""` | |
| issuingStateDoesNotApply | boolean | `true` | |
| issuingCountryRegion | string | `"CHINA"` | |
| issueDateDay | string | `"10"` | |
| issueDateMonth | string | `"JAN"` | |
| issueDateYear | string | `"2020"` | |
| expiryDateDay | string | `"09"` | |
| expiryDateMonth | string | `"JAN"` | |
| expiryDateYear | string | `"2030"` | |
| expiryDateDoesNotApply | boolean | `false` | |
| lostStolen | string | `"No"` | `"Yes"` / `"No"` — Have you ever lost a passport? |
| lostStolenDetails | array | `[]` | If lostStolen = "Yes": [{passportNumber, country, explanation}] |

### 6. travel (Travel Information)

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| purposeOfTrip | string | `"BUSINESS (B1)"` | Dropdown: BUSINESS (B1), TOURISM (B2), STUDENT (F1), etc. |
| specificTravelPlans | string | `"Yes"` | `"Yes"` / `"No"` |
| arrivalDateDay | string | `"15"` | If specificTravelPlans = "Yes" |
| arrivalDateMonth | string | `"JUN"` | |
| arrivalDateYear | string | `"2026"` | |
| arrivalFlight | string | `"CA981"` | |
| arrivalCity | string | `"NEW YORK"` | |
| departureDateDay | string | `"30"` | |
| departureDateMonth | string | `"JUN"` | |
| departureDateYear | string | `"2026"` | |
| lengthOfStay | string | `"15"` | Number |
| lengthOfStayUnit | string | `"DAYS"` | `"DAYS"` / `"WEEKS"` / `"MONTHS"` / `"YEARS"` |
| usAddress.street1 | string | `"100 BROADWAY"` | Address where staying in US |
| usAddress.city | string | `"NEW YORK"` | |
| usAddress.state | string | `"NEW YORK"` | US state dropdown |
| usAddress.zip | string | `"10005"` | |
| whoIsPaying | string | `"SELF"` | `"SELF"` / `"OTHER PERSON"` / `"OTHER COMPANY/ORG"` |
| payingPersonName | string | `""` | If whoIsPaying != "SELF" |
| payingPersonPhone | string | `""` | |
| payingPersonEmail | string | `""` | |
| payingPersonRelation | string | `""` | |

### 7. travelCompanions (Travel Companions)

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| travelingWithOthers | string | `"No"` | `"Yes"` / `"No"` |
| isPartOfGroup | string | `"No"` | `"Yes"` / `"No"` — part of travel group/org? |
| groupName | string | `""` | If isPartOfGroup = "Yes" |
| companions | array | `[]` | [{surname, givenName, relationship}] |

### 8. previousUSTravel (Previous U.S. Travel)

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| hasBeenToUS | string | `"No"` | `"Yes"` / `"No"` |
| previousVisits | array | `[]` | [{arrivalDate, lengthOfStay, lengthOfStayUnit}] |
| hasUSDriversLicense | string | `"No"` | `"Yes"` / `"No"` |
| driversLicenseNumber | string | `""` | |
| driversLicenseState | string | `""` | US state |
| hasUSVisaIssued | string | `"No"` | `"Yes"` / `"No"` — ever been issued a US visa? |
| lastVisaDate | string | `""` | |
| lastVisaNumber | string | `""` | |
| sameTypeVisa | string | `""` | `"Yes"` / `"No"` — applying for same type? |
| sameLocation | string | `""` | `"Yes"` / `"No"` — applying at same location? |
| tenPrinted | string | `""` | `"Yes"` / `"No"` — ten-printed (fingerprinted)? |
| visaLostStolen | string | `"No"` | `"Yes"` / `"No"` |
| visaRevoked | string | `"No"` | `"Yes"` / `"No"` |
| visaRefused | string | `"No"` | `"Yes"` / `"No"` — ever been refused a visa? |
| refusalExplanation | string | `""` | |
| immigrationPetition | string | `"No"` | `"Yes"` / `"No"` — anyone filed immigration petition? |
| petitionExplanation | string | `""` | |

### 9. usContact (U.S. Contact Information)

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| contactType | string | `"PERSON"` | `"PERSON"` / `"ORGANIZATION"` / `"HOTEL"` |
| surname | string | `"SMITH"` | If contactType = "PERSON" |
| givenName | string | `"JOHN"` | |
| organizationName | string | `""` | If contactType = "ORGANIZATION" or "HOTEL" |
| relationship | string | `"FRIEND"` | Dropdown: FRIEND, RELATIVE, BUSINESS ASSOCIATE, SCHOOL, EMPLOYER, OTHER |
| address.street1 | string | `"456 OAK AVENUE"` | |
| address.city | string | `"SAN FRANCISCO"` | |
| address.state | string | `"CALIFORNIA"` | US state dropdown |
| address.zip | string | `"94102"` | |
| phone | string | `"+1-415-555-0123"` | |
| email | string | `"john.smith@email.com"` | |
| emailDoesNotKnow | boolean | `false` | |

### 10. family (Family Information)

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| fatherSurname | string | `"WANG"` | |
| fatherGivenName | string | `"DAMING"` | |
| fatherDobDay | string | `"20"` | |
| fatherDobMonth | string | `"SEP"` | |
| fatherDobYear | string | `"1960"` | |
| fatherDobDoesNotKnow | boolean | `false` | |
| fatherInUS | string | `"No"` | `"Yes"` / `"No"` |
| fatherUSStatus | string | `""` | If fatherInUS = "Yes": visa type |
| motherSurname | string | `"LI"` | |
| motherGivenName | string | `"MEI"` | |
| motherDobDay | string | `"05"` | |
| motherDobMonth | string | `"MAR"` | |
| motherDobYear | string | `"1963"` | |
| motherDobDoesNotKnow | boolean | `false` | |
| motherInUS | string | `"No"` | `"Yes"` / `"No"` |
| motherUSStatus | string | `""` | |
| hasImmediateRelativesInUS | string | `"No"` | `"Yes"` / `"No"` — not including parents |
| immediateRelatives | array | `[]` | [{surname, givenName, relationship, usStatus}] |
| hasOtherRelativesInUS | string | `"No"` | `"Yes"` / `"No"` |
| spouseInfo | object | `null` | Only if maritalStatus is MARRIED/LEGALLY SEPARATED |
| spouseInfo.surname | string | `"CHEN"` | |
| spouseInfo.givenName | string | `"LILI"` | |
| spouseInfo.dob | string | `"15-MAR-1992"` | |
| spouseInfo.nationality | string | `"CHINA"` | |
| spouseInfo.cityOfBirth | string | `"SHANGHAI"` | |
| spouseInfo.countryOfBirth | string | `"CHINA"` | |
| spouseInfo.addressType | string | `"SAME AS HOME"` | `"SAME AS HOME"` / `"OTHER"` |
| spouseInfo.address | object | `{}` | Only if addressType = "OTHER" |

### 11. workEducation (Work / Education / Training)

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| primaryOccupation | string | `"COMPUTER SCIENCE"` | Dropdown with many options |
| occupationExplain | string | `"Software Engineer"` | Free text if needed |
| employerName | string | `"TECH COMPANY LTD"` | |
| employerAddress.street1 | string | `"789 TECH PARK ROAD"` | |
| employerAddress.city | string | `"BEIJING"` | |
| employerAddress.state | string | `"HAIDIAN"` | |
| employerAddress.stateDoesNotApply | boolean | `false` | |
| employerAddress.zip | string | `"100085"` | |
| employerAddress.country | string | `"CHINA"` | |
| employerPhone | string | `"+86-10-87654321"` | |
| monthlyIncome | string | `"25000"` | In local currency |
| monthlyIncomeDoesNotApply | boolean | `false` | |
| jobDuties | string | `"SOFTWARE DEVELOPMENT AND SYSTEM DESIGN"` | Brief description |
| startDateMonth | string | `"JUN"` | Employment start date |
| startDateYear | string | `"2015"` | |
| previousEmployers | array | `[{name, address, phone, jobTitle, supervisor, startDate, endDate}]` | Previous two employers |
| education | array | `[{institution, address, courseOfStudy, dateFrom, dateTo}]` | Schools attended |
| hasAttendedSchool | string | `"Yes"` | `"Yes"` / `"No"` |
| languagesSpoken | array | `["CHINESE", "ENGLISH"]` | |
| hasTraveledLast5Years | string | `"Yes"` | `"Yes"` / `"No"` — traveled to other countries in last 5 years? |
| countriesVisited | array | `["JAPAN", "SOUTH KOREA", "THAILAND"]` | |
| hasBelongedToOrg | string | `"No"` | `"Yes"` / `"No"` — belong to professional/social/charitable orgs? |
| organizations | array | `[]` | If "Yes": [{name}] |
| hasSpecializedSkills | string | `"No"` | `"Yes"` / `"No"` — specialized skills/training (firearms, explosives, nuclear, etc.) |
| specializedSkillsExplain | string | `""` | |
| hasMilitaryService | string | `"No"` | `"Yes"` / `"No"` |
| militaryDetails | object | `{}` | If "Yes": {branch, rank, specialty, startDate, endDate, country} |

### 12. security (Security and Background — Parts 1-5)

Each part contains Yes/No questions. All default to empty string (must select one).

#### Part 1: Disease / Disorder / Substance Abuse
| Field | Type | Notes |
|-------|------|-------|
| communicableDisease | string | Do you have a communicable disease of public health significance? |
| mentalDisorder | string | Do you have a mental or physical disorder that poses a threat? |
| drugAbuser | string | Are you or have you ever been a drug abuser or addict? |

#### Part 2: Criminal Activity
| Field | Type | Notes |
|-------|------|-------|
| arrestedOrConvicted | string | Have you ever been arrested or convicted? |
| controlledSubstances | string | Violated controlled substance laws? |
| prostitution | string | Engaged in prostitution or procurement? |
| moneyLaundering | string | Involved in money laundering? |
| humanTrafficking | string | Committed human trafficking? |
| aidedHumanTrafficking | string | Knowingly aided human trafficking? |
| humanTraffickingRelated | string | Are you the spouse/child of a person who committed trafficking? |

#### Part 3: National Security / Terrorism
| Field | Type | Notes |
|-------|------|-------|
| espionage | string | Engaged in espionage or sabotage? |
| terrorism | string | Engaged in terrorist activities? |
| financialSupportTerrorism | string | Provided financial assistance for terrorism? |
| terroristMember | string | Member of terrorist organization? |
| genocide | string | Committed or incited genocide? |
| torture | string | Committed torture? |
| extrajudicialKillings | string | Committed extrajudicial killings? |
| childSoldiers | string | Used child soldiers? |
| religiousFreedom | string | Violated religious freedom as government official? |

#### Part 4: Immigration Violations
| Field | Type | Notes |
|-------|------|-------|
| removalHearing | string | Subject to removal/exclusion hearing? |
| unlawfulPresence | string | Been unlawfully present in the US? |
| deportedOrRemoved | string | Been deported or removed from the US? |
| immigrationFraud | string | Used fraud to obtain visa or entry? |
| failedToAttend | string | Failed to attend removal hearing? |
| illegalEntrant | string | Been present in US without admission or parole? |

#### Part 5: Miscellaneous
| Field | Type | Notes |
|-------|------|-------|
| childCustody | string | Withheld custody of U.S. citizen child? |
| votingViolation | string | Voted in US in violation of law? |
| taxEvasion | string | Renounced US citizenship to avoid taxation? |

### 13. photo (Photo Upload)

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| photoUrl | string | `"/files/sid/photo.jpg"` | URL from upload endpoint |
| photoFileName | string | `"passport_photo.jpg"` | Original filename |
| photoUploaded | boolean | `false` | Whether photo has been uploaded |

### 14. signature (Sign & Submit)

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| eSigned | boolean | `false` | Checked the e-signature consent box |
| signedAt | string (ISO) | `null` | Timestamp of signing |
| submittedAt | string (ISO) | `null` | Timestamp of submission |
| confirmationNumber | string | `""` | Same as applicationId on confirmation |

### 15. meta (Application Meta)

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| lastSavedAt | string (ISO) | `null` | Last manual/auto save |
| sessionExpiresAt | string (ISO) | `null` | Timeout timestamp |
| tooltipLanguage | string | `"ENGLISH"` | Selected tooltip language |

---

## createInitialData() Structure

The initial state for a fresh application should have all fields set to their empty defaults. For agent training, a **pre-filled** application should be injectable via the `/post` endpoint. Here's the suggested pre-filled example for agent training:

```javascript
const PREFILLED_EXAMPLE = {
  ds160Application: {
    applicationId: 'AA005P4IWT',
    location: 'CHINA, BEIJING',
    locationCode: 'CHN',
    status: 'In Progress',
    createdAt: '2026-03-09T10:00:00Z',
    updatedAt: '2026-03-09T10:30:00Z',
    currentSection: 'personal1',
    completedSections: [],
    securityQuestion: 'What is your mother\'s maiden name?',
    securityAnswer: 'LI',
  },
  personalInfo: {
    personal1: {
      surname: 'WANG',
      givenName: 'XIAOMING',
      nativeFullName: '王小明',
      nativeFullNameDoesNotApply: false,
      otherNamesUsed: 'No',
      otherNames: [],
      telecodeName: 'No',
      telecodeNames: [],
      sex: 'Male',
      maritalStatus: 'SINGLE',
      dobDay: '15',
      dobMonth: 'MAR',
      dobYear: '1990',
      pobCity: 'BEIJING',
      pobState: '',
      pobStateDoesNotApply: true,
      pobCountry: 'CHINA',
    },
    personal2: {
      nationality: 'CHINA',
      otherNationalities: 'No',
      otherNationalityList: [],
      permanentResident: 'No',
      permanentResidentCountry: '',
      nationalId: '110101199003150011',
      nationalIdDoesNotApply: false,
      ssn: '',
      ssnDoesNotApply: true,
      itin: '',
      itinDoesNotApply: true,
    }
  },
  // ... remaining sections with empty defaults
};
```

---

## Country Dropdown Options (Shared)

Used in multiple fields (pobCountry, nationality, passport country, etc.). Include at minimum these 30 countries for realistic mock:

```
AFGHANISTAN, ARGENTINA, AUSTRALIA, BRAZIL, CANADA, CHINA, COLOMBIA, EGYPT, FRANCE,
GERMANY, INDIA, INDONESIA, IRAN, IRAQ, JAPAN, KENYA, MEXICO, NEPAL, NIGERIA,
PAKISTAN, PHILIPPINES, RUSSIA, SAUDI ARABIA, SOUTH KOREA, THAILAND, TURKEY,
UKRAINE, UNITED KINGDOM, UNITED STATES, VIETNAM
```

## U.S. States Dropdown (for US addresses)

```
ALABAMA, ALASKA, ARIZONA, ARKANSAS, CALIFORNIA, COLORADO, CONNECTICUT, DELAWARE,
DISTRICT OF COLUMBIA, FLORIDA, GEORGIA, HAWAII, IDAHO, ILLINOIS, INDIANA, IOWA,
KANSAS, KENTUCKY, LOUISIANA, MAINE, MARYLAND, MASSACHUSETTS, MICHIGAN, MINNESOTA,
MISSISSIPPI, MISSOURI, MONTANA, NEBRASKA, NEVADA, NEW HAMPSHIRE, NEW JERSEY,
NEW MEXICO, NEW YORK, NORTH CAROLINA, NORTH DAKOTA, OHIO, OKLAHOMA, OREGON,
PENNSYLVANIA, RHODE ISLAND, SOUTH CAROLINA, SOUTH DAKOTA, TENNESSEE, TEXAS,
UTAH, VERMONT, VIRGINIA, WASHINGTON, WEST VIRGINIA, WISCONSIN, WYOMING
```

## Month Dropdown Options

```
JAN, FEB, MAR, APR, MAY, JUN, JUL, AUG, SEP, OCT, NOV, DEC
```

## Visa Type / Purpose of Trip Options

```
BUSINESS/CONFERENCE (B1), TOURISM/MEDICAL TREATMENT (B2),
STUDENT - ACADEMIC (F1), STUDENT - VOCATIONAL (M1),
EXCHANGE VISITOR (J1), INTRACOMPANY TRANSFEREE (L1),
SPECIALTY OCCUPATION (H1B), TEMPORARY WORKER (H2B),
TREATY TRADER (E1), TREATY INVESTOR (E2),
TRANSIT (C1), CREW (D),
JOURNALIST/MEDIA (I),
FIANCÉ(E) (K1),
OTHER
```

## Occupation Options

```
AGRICULTURE, ARCHITECTURE, ART/CULTURE, BUSINESS, CLERGY, COMPUTER SCIENCE,
CULINARY/FOOD, EDUCATION, ENGINEERING, GOVERNMENT, HOMEMAKER,
LEGAL PROFESSION, MEDICAL/HEALTH, MILITARY, NATURAL SCIENCES,
NOT EMPLOYED, PHYSICAL SCIENCES, RETIRED, SOCIAL SCIENCES,
STUDENT, OTHER
```

## Relationship Options (for US Contact)

```
FRIEND, RELATIVE, BUSINESS ASSOCIATE, SCHOOL, EMPLOYER, OTHER
```
