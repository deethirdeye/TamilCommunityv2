import React, { createContext, useContext, useState, ReactNode } from 'react';

// Interfaces for each page's form data
interface PersonalDetails {
  fullName?: string;
  email?: string;
  mobileNumber?: string;
  dob?: string;
  currentLocation?: string;
}

interface NativePlaceDetails {
  nativeAddress?: string;
  nativeCountry?: string;
  nativeState?: string;
  nativeCity?: string;
  nativePinCode?: string;
  nativeContactPersonName?: string;
  nativeContactPersonPhone?: string;
}

interface MalaysiaResidenceDetails {
  MalaysiaAddress?: string;
  MalaysiaResidenceState?: string;
  MalaysiaResidenceCity?: string;
  MalaysiaResidencePinCode?: string;
  MalaysiaContactPersonName?: string;
  MalaysiaContactPersonPhone?: string;
}

interface MalaysiaWorkDetails {
  MalaysiaWorkAddress?: string;
  MalaysiaState?: string;
  MalaysiaCity?: string;
  MalaysiaPinCode?: string;
  MalaysiaWorkContactPersonName?: string;
  MalaysiaWorkContactPersonPhone?: string;
}

interface EmployerDetails {
  EmployerFullName?: string;
  CompanyName?: string;
  MobileNumber?: string;
  IDNumber?: string;
  EmployerAddress?: string;
  City?: string;
  State?: string;
  PinCode?: string;
  EmployerCountry: string;
}

interface EmergencyDetails {
  MalaysiaEmergencyContactPerson?: string;
  MalaysiaEmergencyPhone?: string;
  OtherEmergencyContactPerson?: string;
  OtherEmergencyPhone?: string;
}

interface PassportDetails {
  PassportNumber?: string;
  Surname?: string;
  GivenNames?: string;
  Nationality?: string;
  DateOfIssue?: string;
  DateOfExpiry?: string;
  PlaceOfIssue?: string;
}

// Consolidated FormData interface with sections
interface FormData {
  nonMemberDetails: any;
  basicDetails?: PersonalDetails;
  nativeDetails?: NativePlaceDetails;
  malaysiaResidenceDetails?: MalaysiaResidenceDetails;
  malaysiaWorkDetails?: MalaysiaWorkDetails;
  employerDetails?: EmployerDetails;
  emergencyDetails?: EmergencyDetails;
  passportDetails?: PassportDetails;
}

// Interface for the context
interface FormContextProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

// Create the context with an undefined default value
const FormContext = createContext<FormContextProps | undefined>(undefined);

// Create a provider component
export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize form data state with an empty object that matches the FormData interface
  const [formData, setFormData] = useState<FormData>({
    nonMemberDetails: {},
    basicDetails: undefined,
    nativeDetails: undefined,
    malaysiaResidenceDetails: undefined,
    malaysiaWorkDetails: undefined,
    employerDetails: undefined,
    emergencyDetails: undefined,
    passportDetails: undefined,
  });

  // Provide form data and setter function
  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};

// Custom hook to use the form context
export const useFormContext = (): FormContextProps => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
