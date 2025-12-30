import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import spinner from "../../public/assets/icons/loader.svg";

interface buttonProps {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
}

const SubmitButton: React.FC<buttonProps> = ({
  isLoading,
  className,
  children,
}) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={className ?? "shad-primary-btn w-full"}
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src={spinner}
            alt="loading..."
            height={24}
            width={24}
            className="animate-spin"
          />
          loading...
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
