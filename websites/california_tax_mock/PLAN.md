# California Tax Filing System Mock - Architecture Plan

## Summary

Architecture design for a California state income tax filing mock application (Form 540 / CalFile).

## What was done

1. **Researched** the real California FTB CalFile system and Form 540 structure
2. **Studied** 3 existing mock applications (visa_portal_mock, visa_portal_ds160_mock, personal_profile_form_mock) for patterns
3. **Designed** flat, normalized data structure covering all Form 540 sections
4. **Divided** into 4 modules with no circular dependencies

## Architecture Highlights

- **9 routes**: Welcome, Personal Info, Dependents, Income, Deductions, Credits, Tax Summary, Review, Confirmation + /go
- **10 core features** prioritized from high to low
- **Flat data**: personalInfo, dependents, income, deductions, credits, calculations, payment, formProgress, ui
- **Tax engine**: Pure functions in taxCalculator.js with 9 CA tax brackets (1%-12.3%)
- **Tech stack**: React Context + useReducer, Tailwind CSS, react-router-dom v6

## Module Division

| Module | Owner | Components | Data Domain |
|--------|-------|------------|-------------|
| A: Personal Info | Implementer-1 | PersonalInfoForm, SpouseInfo, DependentsList | personalInfo, dependents |
| B: Income & Deductions | Implementer-2 | W2Form, IncomeForm, DeductionsForm | income, deductions |
| C: Credits & Review | Implementer-3 | CreditsForm, TaxSummaryView, ReviewPage, ConfirmationPage | credits, payment, taxReturn |
| D: Integration + Data | Implementer-4 | App, Layout, StepSidebar, TaxContext, initialState, taxCalculator, validators, Go | All (state management, routing, calculations) |

## Output

ARCHITECTURE.md written to: `~/Projects/openrlvr-mock/california_tax_mock/ARCHITECTURE.md`
