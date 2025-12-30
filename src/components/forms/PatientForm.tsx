"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";
import { toast } from "sonner";

export enum FormInputType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof UserFormValidation>) {
    const { name, email, phone } = values;
    setLoading(true);
    try {
      const userData = {
        name,
        email,
        phone,
      };
      console.log("user creds to be created: ", userData);
      const user = await createUser(userData);
      console.log("user: ", { user });
      if (user && user.$id) {
        toast(
          "Patient created successfully. Redirecting to the registration form..."
        );
        router.push(`/patients/${user.$id}/register`);
      } else {
        toast("Failed to create a patient. Please try again.");
        throw new Error("User creation failed, no user ID returned.");
      }
    } catch (error) {
      console.log("Error during user creation: ", error);
      alert("Failed to create user. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 flex-1"
        >
          <section className=" space-y-4">
            {/* <h1 className="header">Hi there 👋</h1> */}
            <p className="text-dark-700">Schedule your first appointment</p>
          </section>
          <CustomFormField
            name="name"
            label="Full name"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
            fieldType={FormInputType.INPUT}
            control={form.control}
          />
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
          <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
        </form>
      </Form>
    </div>
  );
};

export default PatientForm;
