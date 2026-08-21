import LoginForm from "@/components/auth/LoginForm/login-form";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <LoginForm />
    </div>
  );
}
