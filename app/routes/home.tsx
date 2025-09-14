import type { Route } from "./+types/home";
import AgeCalculatorForm from "../components/AgeCalculatorForm";
import alignLeft from "../../assets/images/align-left-svgrepo-com.svg";
import calendarBg from "../../assets/images/calendar-day-svgrepo-com.svg";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Calculadora de Idade" },
    { name: "description", content: "Calcule sua idade com dia, mês e ano." },
  ];
}

export default function Home() {
  return (
    <main className="relative overflow-hidden min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
      {/* Imagens do background */}
      <img
        src={alignLeft}
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute left-[-48px] bottom-[-32px] sm:left-[-100px] sm:bottom-[40px] w-40 sm:w-100 rotate-22 opacity-20"
      />
      <img
        src={calendarBg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute -top-1 -right-1 sm:-top30 sm:-right30 w-50 sm:w-50 opacity-20"
      />
      
      {/* Formulário */}
      <div className="relative z-10 bg-white p-8 sm:p-12 rounded-3xl rounded-br-[100px] sm:rounded-br-[150px] shadow-lg max-w-3xl w-full">
        <AgeCalculatorForm />
      </div>
    </main>
  );
}
