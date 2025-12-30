"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { Appointment } from "../../types/appwrite.types";
import AppointmentForm from "./forms/AppointmentForm";

const AppointmentModal = ({
  type,
  userID,
  appointment,
  patientId,
}: {
  type: "schedule" | "cancel";
  userID: string;
  appointment?: Appointment;
  patientId: string;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className={`capitalize ${type === "schedule" && "text-green-500"}`}
          >
            {type}
          </Button>
        </DialogTrigger>
        <DialogContent className="shad-dialog sm:max-w-md">
          <DialogHeader className="mb-4  space-y-3">
            <DialogTitle className="capitalize">{type} Appointment</DialogTitle>
            <DialogDescription>
              Please fill in the following details to {type} an appointment
            </DialogDescription>
          </DialogHeader>
          <AppointmentForm
            type={type}
            userID={userID}
            appointment={appointment!}
            patientID={patientId}
            setOpen={setOpen}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentModal;
