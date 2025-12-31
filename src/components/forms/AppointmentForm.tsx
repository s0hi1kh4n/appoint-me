"use client";

import type { CreateAppointmentParams } from "@/types";
import {
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPE,
} from "@/types/enums";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { date, string, z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import {
  CreateAppointmentSchema,
  getAppointmentSchema,
  UserFormValidation,
} from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";
import { FormInputType } from "./PatientForm";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import {
  createAppointment,
  // updateAppointment,
} from "@/lib/actions/appointment.actions";
import { toast } from "sonner";
import { Appointment } from "../../types/appwrite.types";
type Props = {
  type: "create" | "cancel" | "schedule";
  userID: string;
  patientID: string;
  appointment?: Appointment;
  setOpen?: (open: boolean) => void;
};
const AppointmentForm: React.FC<Props> = ({
  type,
  userID,
  patientID,
  appointment,
  setOpen,
}) => {
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(false);
  const AppointmentFormValidation = getAppointmentSchema(type);
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment?.primaryPhysician : "",
      schedule: appointment
        ? new Date(appointment?.schedule!)
        : new Date(Date.now()),
      reason: appointment ? appointment.reason : "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "create":
      buttonLabel = "Create Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
  }

  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    console.log("submittt");
    setLoading(true);

    try {
      if (type === "create") {
        const appointmentData:CreateAppointmentParams  = {
            patientID,                         
            userID,                                 
            doctor: values.primaryPhysician,
            appointmentDate: values.schedule,
            appointmentTime: values.schedule.toLocaleTimeString(),
            reason: values.reason,
            notes: values.note,
            status: APPOINTMENT_STATUS.PENDING,
            type: APPOINTMENT_TYPE.CONSULTATION,
        };
        const appointment = await createAppointment(appointmentData);
        if (appointment) {
          toast("Appointment created successfully!");
          form.reset();
          router.push(
            `/patients/${userID}/new-appointment/success?appointmentId=${appointment.$id}`
          );
        }
        return;
      }
      
      if (type === "schedule") {
      // later: update appointment
      return;
    }

    if (type === "cancel") {
      // later: cancel appointment
      return;
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
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
          {type === "create" && (
            <section className=" space-y-4">
              <h1 className="header">New Appointment 👋</h1>
              <p className="text-dark-700">Schedule a new appointment</p>
            </section>
          )}

          {type !== "cancel" && (
            <>
              <CustomFormField
                name="primaryPhysician"
                label="Doctor"
                placeholder="Select a Doctor"
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

              <CustomFormField
                fieldType={FormInputType.DATE_PICKER}
                control={form.control}
                name="schedule"
                label="Expected appointment date"
                showTimeSelect
                dateFormat="MM/dd/yy - h:mm aa"
              />
              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                  fieldType={FormInputType.TEXTAREA}
                  control={form.control}
                  name="reason"
                  label="Reason for appointment"
                  placeholder="Enter reason for appointment"
                />

                <CustomFormField
                  fieldType={FormInputType.TEXTAREA}
                  control={form.control}
                  name="note"
                  label="Notes"
                  placeholder="Enter notes"
                />
              </div>
            </>
          )}
          {type == "cancel" && (
            <>
              <CustomFormField
                fieldType={FormInputType.TEXTAREA}
                control={form.control}
                name="cancellationReason"
                label="reason for cancellation"
                placeholder="Enter reason for cancellation"
              />
            </>
          )}
          <SubmitButton
            isLoading={isLoading}
            className={`${
              type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
            } w-full`}
          >
            {buttonLabel}
          </SubmitButton>
        </form>
      </Form>
    </div>
  );
};

export default AppointmentForm;
