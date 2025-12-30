"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser, registerPatient } from "@/lib/actions/patient.actions";
import { FormInputType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "./FileUploader";
import { toast } from "sonner";

type Props = {
  user: User;
};
const RegisterForm: React.FC<Props> = ({ user }) => {
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });

  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setLoading(true);
    try {
      let formData;
      //check whether we do have the files
      if (
        values.identificationDocument &&
        values.identificationDocument.length > 0
      ) {
        const blobFile = new Blob([values.identificationDocument[0]], {
          type: values.identificationDocument[0].type,
        });
        formData = new FormData();
        formData.append("blobFile", blobFile);
        formData.append("fileName", values.identificationDocument[0].name);
      }

      try {
        const patientData = {
          ...values,
          userID: user.$id,
          birthDate: new Date(values.birthDate),
          identificationDocument: formData,
        };
        const patient = await registerPatient(patientData);
        if (patient) {
          toast(
            "Patient registered successfully. Redirecting to the appointment form..."
          );
          router.push(`/patients/${user.$id}/new-appointment`);
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-12 flex-1"
        >
          <section className=" space-y-4">
            <h1 className="header">Welcome 👋</h1>
            <p className="text-dark-700">Let us know more about yourself.</p>
          </section>

          {/* Personal Information */}
          <section className=" space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="text-dark-700 sub-header">Personal Information</h2>
            </div>
          </section>
          <CustomFormField
            name="name"
            label="Full Name"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
            fieldType={FormInputType.INPUT}
            control={form.control}
          />
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              name="email"
              label="Email"
              placeholder="john@doe.com"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email"
              fieldType={FormInputType.INPUT}
              control={form.control}
            />
            <CustomFormField
              name="phone"
              label="Phone Number"
              placeholder="(555) 1234-5678"
              fieldType={FormInputType.PHONE_INPUT}
              control={form.control}
            />
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              name="birthDate"
              label="Date of Birth"
              iconAlt="dob"
              fieldType={FormInputType.DATE_PICKER}
              control={form.control}
            />
            <CustomFormField
              name="gender"
              label="Gender"
              fieldType={FormInputType.SKELETON}
              control={form.control}
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    defaultValue={field.value}
                    className="flex h-11 gap-6 xl:justify-between"
                    onValueChange={field.onChange}
                  >
                    {GenderOptions.map((gender) => (
                      <div key={gender} className="radio-group">
                        <RadioGroupItem value={gender} id={gender} />
                        <Label htmlFor={gender} className="cursor-pointer">
                          {gender}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              name="address"
              label="Address"
              placeholder="14th street, Delhi"
              fieldType={FormInputType.INPUT}
              control={form.control}
            />
            <CustomFormField
              name="occupation"
              label="Occupation"
              placeholder="Software Engineer"
              fieldType={FormInputType.INPUT}
              control={form.control}
            />
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              name="emergencyContactName"
              label="Emergency Contact Name"
              placeholder="Guardian's name"
              fieldType={FormInputType.INPUT}
              control={form.control}
            />
            <CustomFormField
              name="emergencyContactNumber"
              label="Emergency Contact Number"
              placeholder="Guardian's number"
              fieldType={FormInputType.PHONE_INPUT}
              control={form.control}
            />
          </div>

          <CustomFormField
            name="primaryPhysician"
            label="Primary Physician"
            placeholder="Select a Physician"
            fieldType={FormInputType.SELECT}
            control={form.control}
          >
            {Doctors.map((doctor) => (
              <SelectItem key={doctor.name} value={doctor.name}>
                <div className="flex items-center cursor-pointer gap-2">
                  <Image
                    src={doctor.image}
                    width={32}
                    height={32}
                    alt="doctor-image"
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>

          {/* Medical Information */}
          <section className=" space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="text-dark-700 sub-header">Medical Information</h2>
            </div>
          </section>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              name="insuranceProvider"
              label="Insurance Provider"
              placeholder="BlueCross BlueShield"
              fieldType={FormInputType.INPUT}
              control={form.control}
            />
            <CustomFormField
              name="insurancePolicyNumber"
              label="Insurance Policy Number"
              placeholder="ABC123456789"
              fieldType={FormInputType.INPUT}
              control={form.control}
            />
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              name="allergies"
              label="Allergies (if any)"
              placeholder="Peanuts, Penicillin, Pollen"
              fieldType={FormInputType.TEXTAREA}
              control={form.control}
            />
            <CustomFormField
              name="currentMedication"
              label="Current Medication (if any)"
              placeholder="Ibuprofen 200mg, Paracetamol 500mg"
              fieldType={FormInputType.TEXTAREA}
              control={form.control}
            />
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              name="familyMedicalHistory"
              label="Family Medical History"
              placeholder="Mother has heart disease"
              fieldType={FormInputType.TEXTAREA}
              control={form.control}
            />
            <CustomFormField
              name="pastMedicalHistory"
              label="Past Medical History"
              placeholder="Appendectomy, Tonsillectomy"
              fieldType={FormInputType.TEXTAREA}
              control={form.control}
            />
          </div>

          {/* Identification and verification */}
          <section className=" space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="text-dark-700 sub-header">
                Identification and Verification
              </h2>
            </div>
          </section>
          <CustomFormField
            name="identificationType"
            label="Identification Type"
            placeholder="Select a Identification Type"
            fieldType={FormInputType.SELECT}
            control={form.control}
          >
            {IdentificationTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            name="identificationNumber"
            label="Identification Number"
            placeholder="Identification Number"
            fieldType={FormInputType.INPUT}
            control={form.control}
          />
          <CustomFormField
            name="identificationDocument"
            label="Scanned copy of Identification Document"
            fieldType={FormInputType.SKELETON}
            control={form.control}
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            )}
          />

          {/* Consent and privacy */}
          <section className=" space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="text-dark-700 sub-header">Consent and Privacy</h2>
            </div>
          </section>
          <CustomFormField
            name="treatmentConsent"
            label="I consent to treatment"
            fieldType={FormInputType.CHECKBOX}
            control={form.control}
          />
          <CustomFormField
            name="disclosureConsent"
            label="I consent to disclosure of information"
            fieldType={FormInputType.CHECKBOX}
            control={form.control}
          />
          <CustomFormField
            name="privacyConsent"
            label="I consent to privacy policy"
            fieldType={FormInputType.CHECKBOX}
            control={form.control}
          />
          <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
