import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(endTime: string): TimeLeft | null {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

interface Props {
  endTime: string;
  variant?: 'badge' | 'full';
}

export default function SaleCountdown({ endTime, variant = 'badge' }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => calcTimeLeft(endTime));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcTimeLeft(endTime)), 1000);
    return () => clearInterval(id);
  }, [endTime]);

  if (!timeLeft) return null;

  if (variant === 'badge') {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/15 border border-red-500/30 rounded-sm text-[9px] font-black tracking-wide text-red-400 leading-tight">
        <span className="text-[8px]">⏱</span>
        {timeLeft.days > 0 && <span>{timeLeft.days}d </span>}
        <span>{pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}</span>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <p className="text-[9px] tracking-[0.3em] uppercase text-red-400/80 font-black mb-2">Sale Ends In</p>
      <div className="flex items-center gap-2">
        {timeLeft.days > 0 && (
          <>
            <TimeBox value={timeLeft.days} label="Days" />
            <Colon />
          </>
        )}
        <TimeBox value={timeLeft.hours} label="Hours" />
        <Colon />
        <TimeBox value={timeLeft.minutes} label="Min" />
        <Colon />
        <TimeBox value={timeLeft.seconds} label="Sec" />
      </div>
    </div>
  );
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[52px]">
      <div className="w-full bg-[#1a0808] border border-red-500/25 rounded-sm py-2 text-center">
        <span className="text-xl font-black text-red-400 tabular-nums leading-none">{pad(value)}</span>
      </div>
      <span className="text-[8px] tracking-widest uppercase text-white/30 mt-1">{label}</span>
    </div>
  );
}

function Colon() {
  return <span className="text-red-400/50 font-black text-lg mb-4">:</span>;
}
