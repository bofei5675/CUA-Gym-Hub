# visa_portal_ds160_mock Schema

**Deploy order**: 54 (alphabetical among all *_mock dirs, BASE_PORT=8000 -> port 8054)
**Base URL**: `http://172.17.46.46:8054/`
**Go Endpoint**: `GET /go?sid=<sid>` -> `{initial_state, current_state, state_diff}`
**Inject**: `POST /post?sid=<sid>` with body `{"action":"set","state":{...}}` (use `"merge":true` for partial update)
**Update current only**: `POST /post?sid=<sid>` with body `{"action":"set_current","state":{...}}` — updates only current state, preserves initial (used by golden_patch.py)
**Reset**: `POST /post?sid=<sid>` with body `{"action":"reset"}`
**Upload files**: `POST /upload?sid=<sid>` (multipart/form-data) -> `{success, files: [{original_name, stored_name, size, content_type, url}]}`
**Serve files**: `GET /files/<sid>/<filename>`

Note: `vite.config.js` uses `port: 0` (random). Actual port depends on deployment config. State is stored in localStorage under keys `ds160_state` / `ds160_initialState` (or `ds160_state_<sid>` / `ds160_initialState_<sid>` when a session ID is provided). The `/go` endpoint reads server-side state files written by `/post`; the React app separately reads from localStorage and syncs state to server-side files on every mutation via `updateState()`.

---

## Application Overview

This mock simulates the **U.S. Nonimmigrant Visa Application (DS-160)** form from the Consular Electronic Application Center (CEAC). It is a multi-step form wizard covering: personal information (2 parts), address/phone, passport, travel, travel companions, previous U.S. travel, U.S. contact, family, work/education, security background (5 parts), photo upload, review, sign/submit, and a confirmation page.

All form sections are fully implemented with two-way state binding. No placeholder pages remain.

---

## Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Landing` | Start page: select embassy location, enter captcha, start or retrieve application |
| `/retrieve` | `RetrieveApplication` | Retrieve a previously saved application by ID and security question |
| `/application/security-question` | `SecurityQuestion` | Choose and answer a security question (shown after starting a new application); does NOT persist answer to state |
| `/application/id-generation` | `AppIdDisplay` | Displays the generated Application ID; user records it before continuing |
| `/application/personal1` | `PersonalInfo1` | Personal Information Part 1 (name, DOB, birth place, sex, marital status) |
| `/application/personal2` | `PersonalInfo2` | Personal Information Part 2 (nationality, national ID, SSN, ITIN) |
| `/application/address` | `AddressPhone` | Home address, mailing address flag, phone numbers, email addresses |
| `/application/passport` | `Passport` | Passport type, number, book number, issuing country/city, dates, lost/stolen |
| `/application/travel` | `Travel` | Purpose of trip, specific travel plans, arrival/departure dates, accommodation, payment |
| `/application/travelCompanions` | `TravelCompanions` | Whether traveling with others, group name, companion list |
| `/application/previousTravel` | `PreviousTravel` | Previous U.S. presence, prior visa, visa refusal history, immigration petition |
| `/application/usContact` | `USContact` | U.S. point of contact: name, org, relationship, address, phone, email |
| `/application/family` | `Family` | Father, mother, and (if MARRIED) spouse information |
| `/application/work` | `WorkEducation` | Primary occupation, employer details, job title, duties, education level |
| `/application/security1` | `Security1` | Security Part 1: communicable disease, physical/mental disorder, drug abuse |
| `/application/security2` | `Security2` | Security Part 2: arrest/conviction, controlled substances, prostitution, money laundering, human trafficking |
| `/application/security3` | `Security3` | Security Part 3: espionage, terrorist activity, financial assistance to terrorists, member of terrorist org |
| `/application/security4` | `Security4` | Security Part 4: immigration fraud, removal/deportation, child custody violation, voting violation, tax evasion |
| `/application/security5` | `Security5` | Security Part 5: intent to engage in illegal activity, other immigration violations |
| `/application/photo` | `Photo` | Upload passport photo (reads file as base64 data URL, stores in `photo.photoUrl`) |
| `/application/review` | `Review` | Read-only summary of all sections; navigates to sign/submit |
| `/application/sign` | `SignSubmit` | Applicant name, passport number confirmation, e-signature checkbox; on submit sets status to `"Submitted"` |
| `/application/confirmation` | `Confirmation` | Final confirmation page with Application ID, submission date, next steps |
| `/application/security` | redirect | Legacy redirect: `/application/security` -> `/application/security1` |
| `/go` | `Go` | State inspector: shows `initial_state`, `current_state`, `state_diff` side-by-side |

Routes under `/application/*` (except `security-question` and `id-generation`) are rendered inside `ApplicationLayout`, which provides:
- A top info bar (selected embassy location, application ID, session countdown timer — 20-minute idle timeout)
- A `ProgressBar` component across all sections
- A `Sidebar` navigation panel linking to all form sections

---

## State Schema

The entire application state is a single flat object. All top-level keys and their defaults are listed below.

### Top-Level Keys

| Key | Type | Description |
|-----|------|-------------|
| `ds160Application` | object | Application metadata: ID, location, status, timestamps, current section |
| `personalInfo` | object | Contains `personal1` and `personal2` sub-objects |
| `addressAndPhone` | object | Home/mailing address, phone numbers, email addresses |
| `passport` | object | Passport document details |
| `travel` | object | Trip purpose, dates, accommodation, payment |
| `travelCompanions` | object | Whether traveling with others, companion list |
| `previousUSTravel` | object | Prior U.S. presence, previous visa, refusal/petition history |
| `usContact` | object | U.S. point of contact |
| `family` | object | Father, mother, and spouse information |
| `workEducation` | object | Employment and education details |
| `security` | object | Five security background sub-objects (`part1`–`part5`) |
| `photo` | object | Photo upload status and data URL |
| `signature` | object | E-signature fields, passport confirmation, submission flag |
| `completedSections` | array | List of `sectionId` strings that have been navigated past with "Next" |
| `securityQuestion` | string | Selected security question (set by SecurityQuestion page, not persisted to state) |
| `securityAnswer` | string | Answer to security question (set by SecurityQuestion page, not persisted to state) |
| `meta` | object | Session metadata: last saved time, session expiration |

---

### `ds160Application` subfields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `applicationId` | string | `""` | Auto-generated ID in format `AA00XXXXXX` (prefix `"AA00"` + 6 random chars from `A-Z0-9`). Set by `generateAppId()` on new application start. |
| `location` | string | `""` | Embassy/consulate location code. Values: `"CAN"` (Canada, Toronto), `"CHN"` (China, Beijing), `"FRA"` (France, Paris), `"GBR"` (United Kingdom, London), `"IND"` (India, New Delhi), `"MEX"` (Mexico, Mexico City) |
| `status` | string | `"Not Started"` | Application lifecycle status. Values: `"Not Started"`, `"Submitted"` (set on sign/submit) |
| `createdAt` | string\|null | `null` | ISO 8601 timestamp set when `generateAppId()` runs |
| `updatedAt` | string\|null | `null` | ISO 8601 timestamp; updated automatically on every `updateState()` call |
| `currentSection` | string | `"start"` | Tracks which section the user last navigated to. Updated by `FormPage.handleNext()` and `SignSubmit.handleSign()`. Possible values: `"start"`, `"personal1"`, `"personal2"`, `"address"`, `"passport"`, `"travel"`, `"travelCompanions"`, `"previousTravel"`, `"usContact"`, `"family"`, `"work"`, `"security1"`, `"security2"`, `"security3"`, `"security4"`, `"security5"`, `"photo"`, `"review"`, `"sign"`, `"confirmation"` |

---

### `personalInfo.personal1` subfields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `surname` | string | `""` | Family name(s) as in passport (entered uppercase) |
| `givenName` | string | `""` | Given/first name(s) as in passport (entered uppercase) |
| `nativeFullName` | string | `""` | Full name in native alphabet characters |
| `nativeFullNameDoesNotApply` | boolean | `false` | True if native alphabet is not applicable |
| `otherNamesUsed` | string | `"No"` | Whether applicant has used other names. Values: `"Yes"`, `"No"` |
| `otherNames` | array | `[]` | List of other names used (populated when `otherNamesUsed` is `"Yes"`) |
| `telecodeName` | string | `"No"` | Whether applicant has a telecode representation of their name. Values: `"Yes"`, `"No"` |
| `telecodeNames` | array | `[]` | List of telecode names |
| `sex` | string | `""` | Applicant sex. Values: `"Male"`, `"Female"`, `""` |
| `maritalStatus` | string | `""` | Marital status. Values: `"MARRIED"`, `"SINGLE"`, `"WIDOWED"`, `"DIVORCED"`, `""`. Controls whether spouse section appears in Family page. |
| `dobDay` | string | `""` | Day of birth (DD format, e.g. `"15"`) |
| `dobMonth` | string | `""` | Month of birth abbreviation (e.g. `"JAN"`, `"FEB"`, ..., `"DEC"`) |
| `dobYear` | string | `""` | Year of birth (YYYY format, e.g. `"1990"`) |
| `pobCity` | string | `""` | City of birth |
| `pobState` | string | `""` | State/province of birth |
| `pobStateDoesNotApply` | boolean | `false` | True if state/province of birth is not applicable |
| `pobCountry` | string | `""` | Country/region of birth |

---

### `personalInfo.personal2` subfields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `nationality` | string | `""` | Country of nationality (selected from COUNTRIES list) |
| `otherNationalities` | string | `"No"` | Whether applicant holds other nationalities. Values: `"Yes"`, `"No"` |
| `nationalId` | string | `""` | National identification number |
| `nationalIdDoesNotApply` | boolean | `false` | True if national ID is not applicable; also clears `nationalId` to `""` when checked |
| `ssn` | string | `""` | U.S. Social Security Number |
| `ssnDoesNotApply` | boolean | `false` | True if SSN is not applicable; also clears `ssn` to `""` when checked |
| `itin` | string | `""` | U.S. Taxpayer ID Number (ITIN) |
| `itinDoesNotApply` | boolean | `false` | True if ITIN is not applicable; also clears `itin` to `""` when checked |

---

### `addressAndPhone` subfields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `homeAddress` | object | `{street1:"", street2:"", city:"", state:"", zip:"", country:""}` | Home address object |
| `mailingSameAsHome` | string | `"Yes"` | Whether mailing address is same as home. Values: `"Yes"`, `"No"` |
| `mailingAddress` | object | `{}` | Mailing address (same shape as `homeAddress`) — only shown/filled when `mailingSameAsHome` is `"No"` |
| `primaryPhone` | string | `""` | Primary phone number |
| `secondaryPhone` | string | `""` | Secondary phone number |
| `workPhone` | string | `""` | Work phone number |
| `primaryEmail` | string | `""` | Primary email address |
| `secondaryEmail` | string | `""` | Secondary email address |

#### `homeAddress` / `mailingAddress` subfields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `street1` | string | `""` | Street address line 1 |
| `street2` | string | `""` | Street address line 2 |
| `city` | string | `""` | City |
| `state` | string | `""` | State/province |
| `zip` | string | `""` | Postal/ZIP code |
| `country` | string | `""` | Country (selected from COUNTRIES list) |

---

### `passport` subfields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `passportType` | string | `""` | Type of travel document. Values: `"REGULAR"`, `"OFFICIAL"`, `"DIPLOMATIC"`, `"LAISSEZ-PASSER"`, `"OTHER"`, `""` |
| `passportNumber` | string | `""` | Passport/travel document number (entered uppercase) |
| `passportBookNumber` | string | `""` | Passport book number |
| `passportBookNumberDoesNotApply` | boolean | `false` | True if passport book number is not applicable; clears `passportBookNumber` to `""` |
| `issuingCountry` | string | `""` | Country/authority that issued the passport (from COUNTRIES list) |
| `issuingCity` | string | `""` | City where passport was issued |
| `issuingState` | string | `""` | State/province where passport was issued (present in state but not rendered in current UI) |
| `issuingCountryRegion` | string | `""` | Issuing country region (present in state but not rendered in current UI) |
| `issuanceDate` | string | `""` | Date of passport issuance (format `DD-MMM-YYYY`, e.g. `"15-JAN-2020"`) |
| `expirationDate` | string | `""` | Passport expiration date (format `DD-MMM-YYYY`) |
| `expirationDateDoesNotApply` | boolean | `false` | True if passport has no expiration; clears `expirationDate` to `""` |
| `lostOrStolen` | string | `"No"` | Whether a passport has ever been lost or stolen. Values: `"Yes"`, `"No"` |
| `lostPassportNumber` | string | `""` | Number of the lost/stolen passport (shown when `lostOrStolen` is `"Yes"`) |
| `lostPassportCountry` | string | `""` | Country that issued the lost passport (shown when `lostOrStolen` is `"Yes"`) |

---

### `travel` subfields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `purposeOfTrip` | string | `""` | Purpose of trip (visa type). Populated from VISA_TYPES constant list (e.g. `"BUSINESS/PLEASURE - B1/B2"`, `"STUDENT - F"`, etc.) |
| `specificTravelPlans` | string | `"No"` | Whether the applicant has specific travel plans. Values: `"Yes"`, `"No"`. Controls conditional display of date fields vs. length-of-stay fields. |
| `arrivalDate` | string | `""` | Date of arrival in the U.S. (shown when `specificTravelPlans` is `"Yes"`; format `DD-MMM-YYYY`) |
| `arrivalCity` | string | `""` | City of arrival (shown when `specificTravelPlans` is `"Yes"`) |
| `departureDate` | string | `""` | Date of departure from the U.S. (shown when `specificTravelPlans` is `"Yes"`; format `DD-MMM-YYYY`) |
| `lengthOfStay` | string | `""` | Intended length of stay number (shown when `specificTravelPlans` is `"No"`) |
| `lengthOfStayUnit` | string | `"Days"` | Unit for length of stay. Values: `"Days"`, `"Weeks"`, `"Months"`, `"Years"` |
| `addressWhereStaying` | string | `""` | Full address of U.S. accommodation |
| `payingForTrip` | string | `""` | Who is paying for the trip. Values: `"SELF"`, `"OTHER PERSON"`, `"OTHER COMPANY/ORGANIZATION"`, `""` |

---

### `travelCompanions` subfields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `travelingWithOthers` | string | `"No"` | Whether traveling with other persons. Values: `"Yes"`, `"No"` |
| `companions` | array | `[]` | List of companion objects. Each object has shape: `{name: string, relationship: string}`. Populated when `travelingWithOthers` is `"Yes"`. |
| `groupName` | string | `""` | Name of group if traveling as part of an organized group (shown when `travelingWithOthers` is `"Yes"`) |

---

### `previousUSTravel` subfields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `previouslyInUS` | string | `"No"` | Whether applicant has ever been in the U.S. Values: `"Yes"`, `"No"` |
| `arrivalDate` | string | `""` | Date of last arrival in the U.S. (shown when `previouslyInUS` is `"Yes"`; format `DD-MMM-YYYY`) |
| `lengthOfStay` | string | `""` | Length of last stay in the U.S. (shown when `previouslyInUS` is `"Yes"`) |
| `previousVisaIssued` | string | `"No"` | Whether a U.S. visa was ever issued. Values: `"Yes"`, `"No"` |
| `previousVisaDate` | string | `""` | Date last visa was issued (shown when `previousVisaIssued` is `"Yes"`; format `DD-MMM-YYYY`) |
| `previousVisaNumber` | string | `""` | Previous visa number (shown when `previousVisaIssued` is `"Yes"`) |
| `sameTypeVisa` | string | `"Yes"` | Whether applying for the same type of visa as previously held (shown when `previousVisaIssued` is `"Yes"`). Values: `"Yes"`, `"No"` |
| `sameCountryVisa` | string | `"Yes"` | Whether applying from the same country as previous visa (present in state, not currently rendered) |
| `visaEverRefused` | string | `"No"` | Whether a U.S. visa was ever refused. Values: `"Yes"`, `"No"` |
| `visaRefusedDetails` | string | `""` | Explanation of visa refusal (shown when `visaEverRefused` is `"Yes"`) |
| `immigrationPetitionFiled` | string | `"No"` | Whether an immigration petition has ever been filed on behalf of the applicant. Values: `"Yes"`, `"No"` |

---

### `usContact` subfields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `contactName` | string | `""` | Name of U.S. contact person or organization |
| `organizationName` | string | `""` | Name of organization (optional) |
| `relationship` | string | `""` | Relationship to applicant. Values: `"RELATIVE"`, `"FRIEND"`, `"BUSINESS ASSOCIATE"`, `"EMPLOYER"`, `"SCHOOL"`, `"OTHER"`, `""` |
| `address` | string | `""` | U.S. street address of the contact |
| `city` | string | `""` | City of the U.S. contact |
| `state` | string | `""` | U.S. state (selected from US_STATES list) |
| `zip` | string | `""` | ZIP code of the contact |
| `phone` | string | `""` | Phone number of the contact |
| `email` | string | `""` | Email address of the contact (optional) |

---

### `family` subfields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `fatherSurname` | string | `""` | Father's surname (entered uppercase) |
| `fatherGivenName` | string | `""` | Father's given names (entered uppercase) |
| `fatherDOB` | string | `""` | Father's date of birth (format `DD-MMM-YYYY`) |
| `fatherInUS` | string | `"No"` | Whether father is currently in the U.S. Values: `"Yes"`, `"No"` |
| `fatherUSStatus` | string | `""` | Father's U.S. status (shown when `fatherInUS` is `"Yes"`). Values: `"U.S. CITIZEN"`, `"U.S. LPR"`, `"NONIMMIGRANT"`, `"OTHER"`, `""` |
| `motherSurname` | string | `""` | Mother's surname (entered uppercase) |
| `motherGivenName` | string | `""` | Mother's given names (entered uppercase) |
| `motherDOB` | string | `""` | Mother's date of birth (format `DD-MMM-YYYY`) |
| `motherInUS` | string | `"No"` | Whether mother is currently in the U.S. Values: `"Yes"`, `"No"` |
| `motherUSStatus` | string | `""` | Mother's U.S. status (shown when `motherInUS` is `"Yes"`). Values: `"U.S. CITIZEN"`, `"U.S. LPR"`, `"NONIMMIGRANT"`, `"OTHER"`, `""` |
| `spouseSurname` | string | `""` | Spouse's surname — section only shown when `personalInfo.personal1.maritalStatus` is `"MARRIED"` |
| `spouseGivenName` | string | `""` | Spouse's given names |
| `spouseDOB` | string | `""` | Spouse's date of birth (format `DD-MMM-YYYY`) |
| `spouseNationality` | string | `""` | Spouse's nationality (from COUNTRIES list) |
| `spouseCityOfBirth` | string | `""` | Spouse's city of birth (present in state, not currently rendered) |
| `spouseCountryOfBirth` | string | `""` | Spouse's country of birth (present in state, not currently rendered) |
| `spouseAddressType` | string | `""` | Spouse's address type (present in state, not currently rendered) |

---

### `workEducation` subfields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `primaryOccupation` | string | `""` | Primary occupation category. Values include: `"AGRICULTURE"`, `"ARTIST/PERFORMER"`, `"BUSINESS"`, `"COMMUNICATIONS"`, `"COMPUTER SCIENCE"`, `"CULINARY/FOOD"`, `"EDUCATION"`, `"ENGINEERING"`, `"GOVERNMENT"`, `"HOMEMAKER"`, `"LEGAL"`, `"MEDICAL"`, `"MILITARY"`, `"NATURAL SCIENCES"`, `"PHYSICAL SCIENCES"`, `"RELIGIOUS"`, `"RESEARCH"`, `"RETIRED"`, `"SOCIAL SCIENCE"`, `"STUDENT"`, `"UNEMPLOYED"`, `"OTHER"`, `""` |
| `presentEmployer` | string | `""` | Present employer or school name |
| `employerAddress` | string | `""` | Employer/school street address |
| `employerCity` | string | `""` | Employer/school city |
| `employerState` | string | `""` | Employer/school state/province (present in state, not a separate field in current UI) |
| `employerZip` | string | `""` | Employer/school ZIP/postal code (present in state, not rendered in current UI) |
| `employerCountry` | string | `""` | Employer/school country (from COUNTRIES list) |
| `employerPhone` | string | `""` | Employer/school phone number |
| `monthlyIncome` | string | `""` | Monthly income in local currency |
| `jobTitle` | string | `""` | Job title |
| `startDate` | string | `""` | Employment start date (present in state, not rendered in current UI) |
| `briefDescription` | string | `""` | Brief description of job duties |
| `previouslyEmployed` | string | `"No"` | Whether previously employed (present in state, not rendered in current UI) |
| `previousEmployers` | array | `[]` | List of previous employers (present in state, not rendered in current UI) |
| `educationLevel` | string | `""` | Highest level of education. Values: `"NO FORMAL EDUCATION"`, `"PRIMARY SCHOOL"`, `"HIGH SCHOOL"`, `"VOCATIONAL SCHOOL"`, `"SOME UNIVERSITY"`, `"BACHELORS"`, `"MASTERS"`, `"DOCTORATE"`, `"PROFESSIONAL"`, `"OTHER"`, `""` |
| `institutionName` | string | `""` | Name of educational institution |
| `institutionAddress` | string | `""` | Institution address (present in state, not rendered in current UI) |
| `institutionCity` | string | `""` | Institution city (present in state, not rendered in current UI) |
| `institutionState` | string | `""` | Institution state (present in state, not rendered in current UI) |
| `institutionCountry` | string | `""` | Institution country (present in state, not rendered in current UI) |
| `courseOfStudy` | string | `""` | Field/course of study |
| `attendedFrom` | string | `""` | Institution attendance start date (present in state, not rendered in current UI) |
| `attendedTo` | string | `""` | Institution attendance end date (present in state, not rendered in current UI) |

---

### `security` subfields

The security section is divided into 5 parts, each on its own page. All questions are Yes/No radio buttons. All default to `"No"`.

#### `security.part1`

| Field | Type | Default | Question Summary |
|-------|------|---------|-----------------|
| `communicableDiseaseDisorder` | string | `"No"` | Do you have a communicable disease of public health significance (e.g. TB)? |
| `physicalOrMentalDisorder` | string | `"No"` | Do you have a physical or mental disorder that poses a threat to the safety of yourself or others? |
| `drugAbuser` | string | `"No"` | Are you or have you ever been a drug abuser or addict? |

#### `security.part2`

| Field | Type | Default | Question Summary |
|-------|------|---------|-----------------|
| `arrestedOrConvicted` | string | `"No"` | Have you ever been arrested or convicted for any offense or crime? |
| `controlledSubstancesViolator` | string | `"No"` | Have you ever violated any law relating to controlled substances? |
| `prostitutionInvolved` | string | `"No"` | Are you coming to engage in or have you been involved in prostitution? |
| `moneyLaunderingInvolved` | string | `"No"` | Have you ever been involved in money laundering? |
| `humanTraffickingInvolved` | string | `"No"` | Have you ever committed or conspired to commit a human trafficking offense? |

#### `security.part3`

| Field | Type | Default | Question Summary |
|-------|------|---------|-----------------|
| `espionageInvolved` | string | `"No"` | Do you seek to engage in espionage, sabotage, or export control violations? |
| `terroristActivity` | string | `"No"` | Do you seek to engage in or have you ever engaged in terrorist activities? |
| `financialAssistanceTerrorism` | string | `"No"` | Have you ever provided financial assistance or other support to terrorists? |
| `memberTerroristOrg` | string | `"No"` | Are you a member or representative of a terrorist organization? |

#### `security.part4`

| Field | Type | Default | Question Summary |
|-------|------|---------|-----------------|
| `immigrationFraud` | string | `"No"` | Have you ever committed fraud or misrepresented yourself to obtain a visa or U.S. entry? |
| `removedFromUS` | string | `"No"` | Have you ever been removed or deported from any country? |
| `deportedFromUS` | string | `"No"` | Have you ever been deported from the United States? |
| `childCustodyViolation` | string | `"No"` | Have you ever withheld custody of a U.S. citizen child outside the U.S.? |
| `votingViolation` | string | `"No"` | Have you voted in the United States in violation of any law? |
| `taxEvader` | string | `"No"` | Have you ever renounced U.S. citizenship to avoid taxation? |

#### `security.part5`

| Field | Type | Default | Question Summary |
|-------|------|---------|-----------------|
| `seekIllegalEntry` | string | `"No"` | Do you intend to engage in any activity that would violate U.S. law? |
| `otherActivities` | string | `"No"` | Have you ever engaged in any activity in violation of immigration law or regulation? |

---

### `photo` subfields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `photoUploaded` | boolean | `false` | True once the applicant has successfully selected and uploaded a photo file |
| `photoUrl` | string | `""` | Base64 data URL of the uploaded photo (format: `"data:image/jpeg;base64,..."` or `"data:image/png;base64,..."`). Set by `FileReader.readAsDataURL()`. Maximum recommended size: 240 KB. |

Photo upload flow: User selects a `.jpg`, `.jpeg`, or `.png` file via file input. The file is read client-side with `FileReader` and stored as a base64 data URL in state. No server upload is made for the photo itself; it is stored in localStorage with the rest of state.

---

### `signature` subfields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `signedBy` | string | `""` | Applicant's full name as it appears on passport (entered in format `SURNAME, GIVEN NAME`, uppercase). Required to submit. |
| `signedDate` | string | `""` | ISO 8601 timestamp of when the application was signed/submitted. Set by `handleSign()` in `SignSubmit.jsx`. |
| `passportNumber` | string | `""` | Passport number re-entered for confirmation. Required to submit. |
| `eSigned` | boolean | `false` | Whether applicant has checked the e-signature certification checkbox. Required to submit. |

Submission validation in `SignSubmit.jsx`: `signedBy`, `passportNumber`, and `eSigned` must all be non-empty/truthy, otherwise validation errors are shown in red and an alert is raised. On successful submission:
1. `signature.signedDate` is set to current ISO timestamp
2. `ds160Application.status` is set to `"Submitted"`
3. `"sign"` is appended to `completedSections`
4. `ds160Application.currentSection` is set to `"confirmation"`
5. Navigation moves to `/application/confirmation`

---

### `completedSections`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `completedSections` | array | `[]` | Array of `sectionId` strings for every section the user has navigated past by clicking "Next". Populated by `FormPage.handleNext()`. Example: `["personal1", "personal2", "address", "passport", "travel", "travelCompanions", "previousTravel", "usContact", "family", "work", "security", "photo", "review", "sign"]`. Note: Security sections all share `sectionId` `"security"`, so only one `"security"` entry will appear in this array regardless of how many security sub-pages were completed. |

---

### `meta` subfields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `lastSavedAt` | string\|null | `null` | ISO 8601 timestamp of last explicit save. Set by `FormPage.handleSave()` and `SignSubmit.handleSave()` when user clicks the "Save" button. |
| `sessionExpiresAt` | string\|null | `null` | ISO 8601 timestamp of session expiration (not currently set programmatically; reserved for future use) |

---

## State Management Details

- **Pattern**: React Context (`AppContext.jsx`)
- **Provider**: `AppProvider` wraps the entire app in `App.jsx`
- **Context value**: `{ state, updateState, initialStateSnapshot, generateAppId }`
- **Update function**: `updateState(path, value)` — dot-notation path (e.g. `"personalInfo.personal1.surname"`). Every call also sets `ds160Application.updatedAt` to the current ISO timestamp.
- **Persistence**: Automatically saved to localStorage on every `state` change. Keys: `ds160_state` (current), `ds160_initialState` (snapshot). When a session ID (`sid`) is active, keys become `ds160_state_<sid>` and `ds160_initialState_<sid>`.
- **Session ID**: Read from URL query param `?sid=<value>` on first load. If found, stored in `sessionStorage` under key `mock_sid` and reused on subsequent navigation within the same browser session.
- **Server state injection**: On first load for a session (before the localStorage initial key exists), the app fetches `GET /state?sid=<sid>`. If the server returns `has_custom_state: true`, the stored state is deep-merged with defaults and used as both current and initial state.
- **Refresh detection**: If the `ds160_initialState_<sid>` key already exists in localStorage when the app loads, the app treats it as a page refresh and skips the server state fetch.
- **Initial state snapshot**: Captured once on first load into `initialStateSnapshot` (React state); also written to localStorage under the initial key. Used by the `/go` route for diff calculation.

---

## API Endpoints

All endpoints are served by the Vite dev server plugin defined in `vite.config.js`. They are available both in dev mode (`configureServer`) and preview mode (`configurePreviewServer`).

### `POST /post?sid=<sid>`

Manages server-side state files.

**Body**: JSON object with `action` field.

| Action | Behavior |
|--------|----------|
| `"set"` | Replaces entire server-side state with `data.state`. If `data.merge` is `true`, deep-merges `data.state` into current stored state instead. Also writes the same state to the `.initial.json` file (i.e., sets both current AND initial state). |
| `"set_current"` | Same as `"set"` but writes ONLY to the current state file (`.json`). Never touches the `.initial.json` file. Used by `golden_patch.py` to simulate correct task completion without altering what the agent started with. |
| `"reset"` | Deletes both the current state file and the initial state file for this session. On next browser load, app will fall back to INITIAL_STATE defaults. |

**Response**: `{ success: true, message: string, state?: object }` or `{ error: string }` with HTTP 400.

### `GET /state?sid=<sid>`

Returns the server-stored state for inspection or injection check.

**Response**: `{ stored_state: object|null, has_custom_state: boolean, sid: string|null }`

### `GET /go?sid=<sid>`

Returns the state diff for RL evaluation.

**Response**:
```json
{
  "initial_state": { ...state at injection time },
  "current_state": { ...latest stored state },
  "state_diff": {
    "<key>": { "added": <value> }    // key present in current but not initial
    "<key>": { "modified": <value> } // key changed between initial and current
  }
}
```

Note: The `/go` route in the React app (`src/pages/Go.jsx`) displays the same information client-side from the React context's `initialStateSnapshot` and current `state`.

### `POST /upload?sid=<sid>`

Accepts `multipart/form-data`. Stores uploaded files on disk under `.mock-files/<sid>/`.

**Response**: `{ success: true, files: [{ original_name, stored_name, size, content_type, url }] }`

File URLs take the form `/files/<sid>/<stored_name>` where `stored_name` = `<8-char-uuid>_<sanitized-filename>`.

### `GET /files/<sid>/<filename>`

Serves a previously uploaded file with correct `Content-Type` and `Content-Disposition: attachment` headers.

---

## Application Workflow / State Machine

```
Landing (/)
  |
  |-- [START AN APPLICATION] --> SecurityQuestion (/application/security-question)
  |                                  |
  |                                  v
  |                              AppIdDisplay (/application/id-generation)
  |                                  |
  |                                  v
  |-- [RETRIEVE APPLICATION] --> PersonalInfo1 (/application/personal1)
                                     |
                                     v
                                 PersonalInfo2 (/application/personal2)
                                     |
                                     v
                                 AddressPhone (/application/address)
                                     |
                                     v
                                 Passport (/application/passport)
                                     |
                                     v
                                 Travel (/application/travel)
                                     |
                                     v
                                 TravelCompanions (/application/travelCompanions)
                                     |
                                     v
                                 PreviousTravel (/application/previousTravel)
                                     |
                                     v
                                 USContact (/application/usContact)
                                     |
                                     v
                                 Family (/application/family)
                                     |
                                     v
                                 WorkEducation (/application/work)
                                     |
                                     v
                                 Security1 (/application/security1)
                                     |
                                     v
                                 Security2 (/application/security2)
                                     |
                                     v
                                 Security3 (/application/security3)
                                     |
                                     v
                                 Security4 (/application/security4)
                                     |
                                     v
                                 Security5 (/application/security5)
                                     |
                                     v
                                 Photo (/application/photo)
                                     |
                                     v
                                 Review (/application/review)
                                     |
                                     v
                                 SignSubmit (/application/sign)
                                     |
                            [Sign Application -- validation passes]
                                     |
                                     v
                                 Confirmation (/application/confirmation)
```

Key state transitions:
- Every "Next" click: appends `sectionId` to `completedSections`, sets `ds160Application.currentSection` to next section's ID
- Signing the application: sets `ds160Application.status` from `"Not Started"` to `"Submitted"`, sets `signature.signedDate`, sets `currentSection` to `"confirmation"`

---

## Sidebar Navigation Sections

The sidebar in `ApplicationLayout` links to all form sections. These correspond to `currentSection` values:

1. Getting Started (`start`) — links to `/`
2. Personal 1 (`personal1`) — `/application/personal1`
3. Personal 2 (`personal2`) — `/application/personal2`
4. Address & Phone (`address`) — `/application/address`
5. Passport (`passport`) — `/application/passport`
6. Travel (`travel`) — `/application/travel`
7. Travel Companions (`travelCompanions`) — `/application/travelCompanions`
8. Previous U.S. Travel (`previousTravel`) — `/application/previousTravel`
9. U.S. Contact (`usContact`) — `/application/usContact`
10. Family (`family`) — `/application/family`
11. Work / Education / Training (`work`) — `/application/work`
12. Security and Background (`security`) — `/application/security1` (entry point; sub-pages navigate sequentially)
13. Photo (`photo`) — `/application/photo`
14. Review (`review`) — `/application/review`
15. Sign and Submit (`sign`) — `/application/sign`

---

## Progress Bar Steps

The progress bar at the top of the `ApplicationLayout` displays steps in this order:
`Personal 1` | `Personal 2` | `Address & Phone` | `Passport` | `Travel` | `U.S. Contact` | `Family` | `Work / Education / Training` | `Security & Background` | `Photo` | `Review` | `Sign & Submit` | `Confirmation`

---

## Observable State Changes (for RL Agent Evaluation)

| User Action | State Field(s) Changed |
|-------------|------------------------|
| Select embassy location and click "START AN APPLICATION" | `ds160Application.location` set to location code (e.g. `"CHN"`), `ds160Application.applicationId` set to generated ID, `ds160Application.createdAt` set to ISO timestamp |
| Fill surname on Personal 1 | `personalInfo.personal1.surname` |
| Fill given name on Personal 1 | `personalInfo.personal1.givenName` |
| Check "Does Not Apply" for native name | `personalInfo.personal1.nativeFullNameDoesNotApply` -> `true` |
| Select sex | `personalInfo.personal1.sex` |
| Select marital status | `personalInfo.personal1.maritalStatus` |
| Fill DOB fields | `personalInfo.personal1.dobDay`, `dobMonth`, `dobYear` |
| Fill nationality on Personal 2 | `personalInfo.personal2.nationality` |
| Check SSN Does Not Apply | `personalInfo.personal2.ssnDoesNotApply` -> `true`, `personalInfo.personal2.ssn` -> `""` |
| Fill home address line 1 | `addressAndPhone.homeAddress.street1` |
| Set mailing same as home to No | `addressAndPhone.mailingSameAsHome` -> `"No"` |
| Fill primary phone | `addressAndPhone.primaryPhone` |
| Select passport type | `passport.passportType` |
| Fill passport number | `passport.passportNumber` |
| Check passport expiration Does Not Apply | `passport.expirationDateDoesNotApply` -> `true`, `passport.expirationDate` -> `""` |
| Select lost/stolen passport Yes | `passport.lostOrStolen` -> `"Yes"` |
| Select purpose of trip | `travel.purposeOfTrip` |
| Select specific travel plans Yes | `travel.specificTravelPlans` -> `"Yes"` (shows arrival/departure date fields) |
| Select specific travel plans No | `travel.specificTravelPlans` -> `"No"` (shows length of stay fields) |
| Select traveling with others Yes | `travelCompanions.travelingWithOthers` -> `"Yes"` |
| Add travel companion | `travelCompanions.companions` array gains new `{name, relationship}` object |
| Select previously in US Yes | `previousUSTravel.previouslyInUS` -> `"Yes"` |
| Select prior visa Yes | `previousUSTravel.previousVisaIssued` -> `"Yes"` |
| Select visa ever refused Yes | `previousUSTravel.visaEverRefused` -> `"Yes"` |
| Fill U.S. contact name | `usContact.contactName` |
| Fill father's surname | `family.fatherSurname` |
| Set marital status to MARRIED (triggers spouse fields) | `personalInfo.personal1.maritalStatus` -> `"MARRIED"` (causes spouse section to appear in Family page) |
| Fill spouse surname | `family.spouseSurname` |
| Select primary occupation | `workEducation.primaryOccupation` |
| Change any security question from No to Yes | e.g. `security.part1.drugAbuser` -> `"Yes"` |
| Upload passport photo | `photo.photoUploaded` -> `true`, `photo.photoUrl` -> base64 data URL string |
| Remove uploaded photo | `photo.photoUploaded` -> `false`, `photo.photoUrl` -> `""` |
| Click Next on any form section | `completedSections` gains section's `sectionId`, `ds160Application.currentSection` set to next section ID, `ds160Application.updatedAt` updated |
| Click Save on any form section | `meta.lastSavedAt` set to current ISO timestamp |
| Submit application (Sign Application button) | `signature.signedDate` set to ISO timestamp, `ds160Application.status` -> `"Submitted"`, `completedSections` gains `"sign"`, `ds160Application.currentSection` -> `"confirmation"` |
| Retrieve application with matching ID | Navigates to `/application/personal1`; validates entered ID against `ds160Application.applicationId` in localStorage |

---

## Minimal Inject Example

```json
{
  "action": "set",
  "state": {
    "ds160Application": {
      "applicationId": "AA00K7M2P9",
      "location": "CHN",
      "status": "Not Started",
      "createdAt": "2025-03-01T10:00:00Z",
      "updatedAt": null,
      "currentSection": "personal1"
    },
    "personalInfo": {
      "personal1": {
        "surname": "",
        "givenName": "",
        "nativeFullName": "",
        "nativeFullNameDoesNotApply": false,
        "otherNamesUsed": "No",
        "otherNames": [],
        "telecodeName": "No",
        "telecodeNames": [],
        "sex": "",
        "maritalStatus": "",
        "dobDay": "",
        "dobMonth": "",
        "dobYear": "",
        "pobCity": "",
        "pobState": "",
        "pobStateDoesNotApply": false,
        "pobCountry": ""
      },
      "personal2": {
        "nationality": "",
        "otherNationalities": "No",
        "nationalId": "",
        "nationalIdDoesNotApply": false,
        "ssn": "",
        "ssnDoesNotApply": false,
        "itin": "",
        "itinDoesNotApply": false
      }
    },
    "addressAndPhone": {
      "homeAddress": {
        "street1": "",
        "street2": "",
        "city": "",
        "state": "",
        "zip": "",
        "country": ""
      },
      "mailingSameAsHome": "Yes",
      "mailingAddress": {},
      "primaryPhone": "",
      "secondaryPhone": "",
      "workPhone": "",
      "primaryEmail": "",
      "secondaryEmail": ""
    },
    "passport": {
      "passportType": "",
      "passportNumber": "",
      "passportBookNumber": "",
      "passportBookNumberDoesNotApply": false,
      "issuingCountry": "",
      "issuingCity": "",
      "issuanceDate": "",
      "expirationDate": "",
      "expirationDateDoesNotApply": false,
      "lostOrStolen": "No",
      "lostPassportNumber": "",
      "lostPassportCountry": ""
    },
    "travel": {
      "purposeOfTrip": "",
      "specificTravelPlans": "No",
      "arrivalDate": "",
      "arrivalCity": "",
      "departureDate": "",
      "lengthOfStay": "",
      "lengthOfStayUnit": "Days",
      "addressWhereStaying": "",
      "payingForTrip": ""
    },
    "travelCompanions": {
      "travelingWithOthers": "No",
      "companions": [],
      "groupName": ""
    },
    "previousUSTravel": {
      "previouslyInUS": "No",
      "arrivalDate": "",
      "lengthOfStay": "",
      "previousVisaIssued": "No",
      "previousVisaDate": "",
      "previousVisaNumber": "",
      "sameTypeVisa": "Yes",
      "sameCountryVisa": "Yes",
      "visaEverRefused": "No",
      "visaRefusedDetails": "",
      "immigrationPetitionFiled": "No"
    },
    "usContact": {
      "contactName": "",
      "organizationName": "",
      "relationship": "",
      "address": "",
      "city": "",
      "state": "",
      "zip": "",
      "phone": "",
      "email": ""
    },
    "family": {
      "fatherSurname": "",
      "fatherGivenName": "",
      "fatherDOB": "",
      "fatherInUS": "No",
      "fatherUSStatus": "",
      "motherSurname": "",
      "motherGivenName": "",
      "motherDOB": "",
      "motherInUS": "No",
      "motherUSStatus": "",
      "spouseSurname": "",
      "spouseGivenName": "",
      "spouseDOB": "",
      "spouseNationality": "",
      "spouseCityOfBirth": "",
      "spouseCountryOfBirth": "",
      "spouseAddressType": ""
    },
    "workEducation": {
      "primaryOccupation": "",
      "presentEmployer": "",
      "employerAddress": "",
      "employerCity": "",
      "employerState": "",
      "employerZip": "",
      "employerCountry": "",
      "employerPhone": "",
      "monthlyIncome": "",
      "jobTitle": "",
      "startDate": "",
      "briefDescription": "",
      "previouslyEmployed": "No",
      "previousEmployers": [],
      "educationLevel": "",
      "institutionName": "",
      "institutionAddress": "",
      "institutionCity": "",
      "institutionState": "",
      "institutionCountry": "",
      "courseOfStudy": "",
      "attendedFrom": "",
      "attendedTo": ""
    },
    "security": {
      "part1": {
        "communicableDiseaseDisorder": "No",
        "physicalOrMentalDisorder": "No",
        "drugAbuser": "No"
      },
      "part2": {
        "arrestedOrConvicted": "No",
        "controlledSubstancesViolator": "No",
        "prostitutionInvolved": "No",
        "moneyLaunderingInvolved": "No",
        "humanTraffickingInvolved": "No"
      },
      "part3": {
        "espionageInvolved": "No",
        "terroristActivity": "No",
        "financialAssistanceTerrorism": "No",
        "memberTerroristOrg": "No"
      },
      "part4": {
        "immigrationFraud": "No",
        "removedFromUS": "No",
        "deportedFromUS": "No",
        "childCustodyViolation": "No",
        "votingViolation": "No",
        "taxEvader": "No"
      },
      "part5": {
        "seekIllegalEntry": "No",
        "otherActivities": "No"
      }
    },
    "photo": {
      "photoUploaded": false,
      "photoUrl": ""
    },
    "signature": {
      "signedBy": "",
      "signedDate": "",
      "passportNumber": "",
      "eSigned": false
    },
    "completedSections": [],
    "securityQuestion": "",
    "securityAnswer": "",
    "meta": {
      "lastSavedAt": null,
      "sessionExpiresAt": null
    }
  }
}
```

---

## Pre-filled State Example (application in progress, ready to review)

```json
{
  "action": "set",
  "state": {
    "ds160Application": {
      "applicationId": "AA00X3RQBN",
      "location": "CHN",
      "status": "Not Started",
      "createdAt": "2025-02-15T14:30:00Z",
      "updatedAt": "2025-02-15T15:30:00Z",
      "currentSection": "review"
    },
    "personalInfo": {
      "personal1": {
        "surname": "WANG",
        "givenName": "XIAOMING",
        "nativeFullName": "",
        "nativeFullNameDoesNotApply": true,
        "otherNamesUsed": "No",
        "otherNames": [],
        "telecodeName": "No",
        "telecodeNames": [],
        "sex": "Male",
        "maritalStatus": "SINGLE",
        "dobDay": "15",
        "dobMonth": "MAR",
        "dobYear": "1990",
        "pobCity": "BEIJING",
        "pobState": "BEIJING",
        "pobStateDoesNotApply": false,
        "pobCountry": "CHINA"
      },
      "personal2": {
        "nationality": "CHINA",
        "otherNationalities": "No",
        "nationalId": "110101199003150011",
        "nationalIdDoesNotApply": false,
        "ssn": "",
        "ssnDoesNotApply": true,
        "itin": "",
        "itinDoesNotApply": true
      }
    },
    "addressAndPhone": {
      "homeAddress": {
        "street1": "123 CHANGAN AVENUE",
        "street2": "APT 5B",
        "city": "BEIJING",
        "state": "BEIJING",
        "zip": "100000",
        "country": "CHINA"
      },
      "mailingSameAsHome": "Yes",
      "mailingAddress": {},
      "primaryPhone": "+86-10-12345678",
      "secondaryPhone": "",
      "workPhone": "+86-10-87654321",
      "primaryEmail": "xiaoming.wang@example.com",
      "secondaryEmail": ""
    },
    "passport": {
      "passportType": "REGULAR",
      "passportNumber": "E12345678",
      "passportBookNumber": "",
      "passportBookNumberDoesNotApply": true,
      "issuingCountry": "CHINA",
      "issuingCity": "BEIJING",
      "issuingState": "",
      "issuingCountryRegion": "",
      "issuanceDate": "01-JAN-2020",
      "expirationDate": "01-JAN-2030",
      "expirationDateDoesNotApply": false,
      "lostOrStolen": "No",
      "lostPassportNumber": "",
      "lostPassportCountry": ""
    },
    "travel": {
      "purposeOfTrip": "BUSINESS/PLEASURE - B1/B2",
      "specificTravelPlans": "Yes",
      "arrivalDate": "15-JUN-2025",
      "arrivalCity": "NEW YORK",
      "departureDate": "30-JUN-2025",
      "lengthOfStay": "",
      "lengthOfStayUnit": "Days",
      "addressWhereStaying": "123 HOTEL STREET, NEW YORK, NY 10001",
      "payingForTrip": "SELF"
    },
    "travelCompanions": {
      "travelingWithOthers": "No",
      "companions": [],
      "groupName": ""
    },
    "previousUSTravel": {
      "previouslyInUS": "No",
      "arrivalDate": "",
      "lengthOfStay": "",
      "previousVisaIssued": "No",
      "previousVisaDate": "",
      "previousVisaNumber": "",
      "sameTypeVisa": "Yes",
      "sameCountryVisa": "Yes",
      "visaEverRefused": "No",
      "visaRefusedDetails": "",
      "immigrationPetitionFiled": "No"
    },
    "usContact": {
      "contactName": "JOHN SMITH",
      "organizationName": "ACME CORP",
      "relationship": "BUSINESS ASSOCIATE",
      "address": "456 BUSINESS AVE",
      "city": "NEW YORK",
      "state": "NY",
      "zip": "10001",
      "phone": "212-555-0100",
      "email": "john.smith@acmecorp.com"
    },
    "family": {
      "fatherSurname": "WANG",
      "fatherGivenName": "GUOQIANG",
      "fatherDOB": "01-MAR-1960",
      "fatherInUS": "No",
      "fatherUSStatus": "",
      "motherSurname": "LI",
      "motherGivenName": "MEILAN",
      "motherDOB": "15-JUN-1963",
      "motherInUS": "No",
      "motherUSStatus": "",
      "spouseSurname": "",
      "spouseGivenName": "",
      "spouseDOB": "",
      "spouseNationality": "",
      "spouseCityOfBirth": "",
      "spouseCountryOfBirth": "",
      "spouseAddressType": ""
    },
    "workEducation": {
      "primaryOccupation": "COMPUTER SCIENCE",
      "presentEmployer": "TECH SOLUTIONS LTD",
      "employerAddress": "789 TECH ROAD",
      "employerCity": "BEIJING",
      "employerState": "",
      "employerZip": "",
      "employerCountry": "CHINA",
      "employerPhone": "+86-10-88888888",
      "monthlyIncome": "20000",
      "jobTitle": "SOFTWARE ENGINEER",
      "startDate": "",
      "briefDescription": "Develops enterprise software applications",
      "previouslyEmployed": "No",
      "previousEmployers": [],
      "educationLevel": "BACHELORS",
      "institutionName": "BEIJING UNIVERSITY",
      "institutionAddress": "",
      "institutionCity": "",
      "institutionState": "",
      "institutionCountry": "",
      "courseOfStudy": "COMPUTER SCIENCE",
      "attendedFrom": "",
      "attendedTo": ""
    },
    "security": {
      "part1": {
        "communicableDiseaseDisorder": "No",
        "physicalOrMentalDisorder": "No",
        "drugAbuser": "No"
      },
      "part2": {
        "arrestedOrConvicted": "No",
        "controlledSubstancesViolator": "No",
        "prostitutionInvolved": "No",
        "moneyLaunderingInvolved": "No",
        "humanTraffickingInvolved": "No"
      },
      "part3": {
        "espionageInvolved": "No",
        "terroristActivity": "No",
        "financialAssistanceTerrorism": "No",
        "memberTerroristOrg": "No"
      },
      "part4": {
        "immigrationFraud": "No",
        "removedFromUS": "No",
        "deportedFromUS": "No",
        "childCustodyViolation": "No",
        "votingViolation": "No",
        "taxEvader": "No"
      },
      "part5": {
        "seekIllegalEntry": "No",
        "otherActivities": "No"
      }
    },
    "photo": {
      "photoUploaded": false,
      "photoUrl": ""
    },
    "signature": {
      "signedBy": "",
      "signedDate": "",
      "passportNumber": "",
      "eSigned": false
    },
    "completedSections": [
      "personal1", "personal2", "address", "passport", "travel",
      "travelCompanions", "previousTravel", "usContact", "family", "work",
      "security", "photo"
    ],
    "securityQuestion": "",
    "securityAnswer": "",
    "meta": {
      "lastSavedAt": "2025-02-15T15:00:00Z",
      "sessionExpiresAt": null
    }
  }
}
```

---

## Notes

- The `SecurityQuestion` page collects a security question and answer for application retrieval, but does NOT persist these values to the application state (they are only used client-side for the retrieve flow).
- The `RetrieveApplication` page validates the entered Application ID against `state.ds160Application.applicationId` in localStorage. If they do not match, a red error banner is shown and navigation is blocked.
- `generateAppId()` creates IDs with prefix `"AA00"` followed by 6 random characters from the set `A-Z0-9`.
- All Security sub-pages (`security1` through `security5`) use the same `sectionId` value `"security"` when recording to `completedSections`. Only one `"security"` entry will appear in the array.
- The `FormPage` component's `handleNext()` derives the next `currentSection` value from the last path segment of `nextRoute` (e.g. `/application/travelCompanions` -> `"travelCompanions"`).
- Photo data is stored as a base64 data URL in localStorage. For large photos, this can significantly increase localStorage usage.
- The `ds160Application.updatedAt` field is set to the current ISO timestamp on EVERY call to `updateState()`, making it a reliable "last modified" indicator.
- The `ApplicationLayout` session timer resets to 20 minutes on every state change (i.e., on every user interaction that calls `updateState()`).
