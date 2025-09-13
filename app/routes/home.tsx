import type { Route } from "./+types/home";
import AgeCalculatorForm from "../components/AgeCalculatorForm";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Calculadora de Idade" },
    { name: "description", content: "Calcule sua idade com dia, mês e ano." },
  ];
}

export default function Home() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 sm:p-12 rounded-3xl rounded-br-[100px] sm:rounded-br-[150px] shadow-lg max-w-3xl w-full">
        <AgeCalculatorForm />
      </div>
    </main>
  );
}
