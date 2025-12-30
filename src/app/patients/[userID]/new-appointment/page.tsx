import Image from "next/image";
import logo from "../../../../../public/assets/icons/logo-full.svg";
import appointment from "../../../../../public/assets/images/appointment-img.png";
import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";

const NewAppointment = async ({ params: { userID } }: SearchParamProps) => {
  const patient = await getPatient(userID);
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src={logo}
            alt="company-logo"
            height={1000}
            width={1000}
            className="mb-12 h-10 w-fit"
          />
          <AppointmentForm
            type="create"
            userID={userID}
            patientID={patient.$id}
          />
          <p className="py-12 copyright">© 2024 Appointly</p>
        </div>
      </section>
      <Image
        src={appointment}
        alt="appointment"
        height={1000}
        width={1000}
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
};

export default NewAppointment;
