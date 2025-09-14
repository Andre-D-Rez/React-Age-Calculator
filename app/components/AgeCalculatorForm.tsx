import React from "react";
import { useForm } from "react-hook-form";
import { diffYMD, getDaysInMonth, isValidDate } from "../utils/date";
import iconArrow from "../../assets/images/icon-arrow.svg";

type FormValues = {
  day: number | string;
  month: number | string;
  year: number | string;
};

/* Calculadora de eventos futuros (contagem regressiva)
  // type Mode = 'age' | 'countdown';
  // type AgeCalculatorFormProps = { mode?: Mode };
  // export default function AgeCalculatorForm({ mode = 'age' }: AgeCalculatorFormProps) {
  //   ...
  // }
  //
  // {...register('year', {
  //   ...regrasComuns,
  //   validate: (v) => {
  //     const y = Number(v), m = Number(watch('month')), d = Number(watch('day'));
  //     if (!isValidDate(d, m, y)) return 'Data inválida';
  //     const hoje = new Date();
  //     const evento = new Date(y, m - 1, d);
  //     if (mode === 'age' && evento > hoje) return 'Data não pode ser futura';
  //     if (mode === 'countdown' && evento < hoje) return 'Data do evento não pode ser passada';
  //     return true;
  //   }
  // })}
  //
  // const onSubmit = (data: FormValues) => {
  //   const day = Number(data.day); const month = Number(data.month); const year = Number(data.year);
  //   const now = new Date();
  //   if (mode === 'age') {
  //     setResult(diffYMD({ day, month, year }, now));
  //   } else {
  //     const to = new Date(year, month - 1, day);
  //     setResult(diffYMD({ day: now.getDate(), month: now.getMonth() + 1, year: now.getFullYear() }, to));
  //   }
  // };
*/

export default function AgeCalculatorForm() {
  const today = React.useMemo(() => new Date(), []);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: { day: "", month: "", year: "" },
  });

  // Acessibilidade: IDs únicos para inputs/labels
  const dayId = React.useId();
  const monthId = React.useId();
  const yearId = React.useId();

  const wMonth = Number(watch("month")) || 0;
  const wYear = Number(watch("year")) || today.getFullYear();
  const dayVal = watch("day");
  const monthVal = watch("month");
  const yearVal = watch("year");

  const [result, setResult] = React.useState<{
    years: number;
    months: number;
    days: number;
  } | null>(null);
  const lastSubmittedRef = React.useRef<{ day: number; month: number; year: number } | null>(null);

  const onSubmit = React.useCallback((data: FormValues) => {
    const day = Number(data.day);
    const month = Number(data.month);
    const year = Number(data.year);
    if (!isValidDate(day, month, year)) return;
    // Bloquear datas futuras
    const now = new Date();
    const nowY = now.getFullYear();
    const nowM = now.getMonth() + 1;
    const nowD = now.getDate();
    const isFuture =
      year > nowY ||
      (year === nowY && (month > nowM || (month === nowM && day > nowD)));
    if (isFuture) {
      setError("year", { type: "validate", message: "Data não pode ser no futuro" });
      return;
    }
    const diff = diffYMD({ day, month, year }, now);
    setResult(diff);
    lastSubmittedRef.current = { day, month, year };
  }, [setError]);

  const maxDay = React.useMemo(
    () => (wMonth >= 1 && wMonth <= 12 ? getDaysInMonth(wMonth, wYear) : 31),
    [wMonth, wYear]
  );

  const yearsVal = result?.years ?? "--";
  const monthsVal = result?.months ?? "--";
  const daysVal = result?.days ?? "--";

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-3 gap-4 sm:gap-6">
          <div className="flex-1">
            <label htmlFor={dayId} className="block text-xs tracking-[0.3em] text-gray-600 mb-1 uppercase">
              DAY
            </label>
            <input
              type="number"
              placeholder="DD"
              id={dayId}
              className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 text-gray-900 placeholder:text-gray-400 ${
                errors.day
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-purple-500"
              }`}
              {...register("day", {
                required: "Campo obrigatório",
                valueAsNumber: true,
                min: { value: 1, message: "Dia mínimo é 1" },
                max: {
                  value: maxDay,
                  message: `Dia máximo para este mês/ano é ${maxDay}`,
                },
                validate: (v: number | string) => {
                  const day = Number(v);
                  const month = Number(watch("month"));
                  const year = Number(watch("year"));
                  if (!month || !year) return true; // validar por campo quando outros faltam
                  if (!isValidDate(day, month, year)) {
                    return "Data inválida para este mês/ano";
                  }
                  // Checagem de futuro
                  const now = new Date();
                  const nowY = now.getFullYear();
                  const nowM = now.getMonth() + 1;
                  const nowD = now.getDate();
                  const isFuture =
                    year > nowY ||
                    (year === nowY && (month > nowM || (month === nowM && day > nowD)));
                  return isFuture ? "Data não pode ser no futuro" : true;
                },
              })}
            />
            {errors.day && (
              <p className="mt-1 text-xs text-red-500">
                {errors.day.message as string}
              </p>
            )}
          </div>
          <div className="flex-1">
            <label htmlFor={monthId} className="block text-xs tracking-[0.3em] text-gray-600 mb-1 uppercase">
              MONTH
            </label>
            <input
              type="number"
              placeholder="MM"
              id={monthId}
              className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 text-gray-900 placeholder:text-gray-400 ${
                errors.month
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-purple-500"
              }`}
              {...register("month", {
                required: "Campo obrigatório",
                valueAsNumber: true,
                min: { value: 1, message: "Mês mínimo é 1" },
                max: { value: 12, message: "Mês máximo é 12" },
              })}
            />
            {errors.month && (
              <p className="mt-1 text-xs text-red-500">
                {errors.month.message as string}
              </p>
            )}
          </div>
          <div className="flex-1">
            <label htmlFor={yearId} className="block text-xs tracking-[0.3em] text-gray-600 mb-1 uppercase">
              YEAR
            </label>
            <input
              type="number"
              placeholder="YYYY"
              id={yearId}
              className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 text-gray-900 placeholder:text-gray-400 ${
                errors.year
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-purple-500"
              }`}
              {...register("year", {
                required: "Campo obrigatório",
                valueAsNumber: true,
                min: {
                  value: -4540000000,
                  message: "Ano mínimo é -4540000000",
                },
                max: {
                  value: today.getFullYear(),
                  message: "Ano não pode ser no futuro",
                },
                validate: (v: number | string) => {
                  const year = Number(v);
                  const month = Number(watch("month"));
                  const day = Number(watch("day"));
                  if (!day || !month) return true;
                  if (!isValidDate(day, month, year)) return "Data inválida";
                  // Checagem de futuro
                  const now = new Date();
                  const nowY = now.getFullYear();
                  const nowM = now.getMonth() + 1;
                  const nowD = now.getDate();
                  const isFuture =
                    year > nowY ||
                    (year === nowY && (month > nowM || (month === nowM && day > nowD)));
                  return isFuture ? "Data não pode ser no futuro" : true;
                },
              })}
            />
            {errors.year && (
              <p className="mt-1 text-xs text-red-500">
                {errors.year.message as string}
              </p>
            )}
          </div>
        </div>

        <div className="relative mt-7 sm:mt-9 md:mt-10">
          <div className="border-t border-gray-300" />
          <button
            type="submit"
            aria-label="Calcular idade"
            className="absolute right-0 -translate-y-1/2 top-1/2 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <img src={iconArrow} alt="" className="w-6 h-6" />
          </button>
        </div>
      </form>

      <div className="mt-8 sm:mt-10">
        <p className="text-5xl sm:text-6xl md:text-7xl leading-tight">
          <span className="font-extrabold text-purple-600">{yearsVal}</span>{" "}
          <span className="font-extrabold italic text-gray-900">years</span>
        </p>
        <p className="text-5xl sm:text-6xl md:text-7xl leading-tight">
          <span className="font-extrabold text-purple-600">{monthsVal}</span>{" "}
          <span className="font-extrabold italic text-gray-900">months</span>
        </p>
        <p className="text-5xl sm:text-6xl md:text-7xl leading-tight">
          <span className="font-extrabold text-purple-600">{daysVal}</span>{" "}
          <span className="font-extrabold italic text-gray-900">days</span>
        </p>
      </div>
    </div>
  );
}
