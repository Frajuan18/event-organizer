import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  className?: string;
}

// Simple cn utility right in the component if you don't have it elsewhere
const cn = (...classes: (string | boolean | undefined | null)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default function StatsCard({ title, value, icon: Icon, subtitle, className }: StatsCardProps) {
  return (
    <div className={cn(
      "bg-white border-4 border-black rounded-2xl p-5 transition-all hover:shadow-[8px_8px_0px_0px_rgba(46,139,87,1)]",
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-1">
            {title}
          </p>
          <p className="text-3xl font-black text-black">
            {value}
          </p>
        </div>
        <div className="bg-[#2e8b57]/10 p-3 rounded-xl border-4 border-black">
          <Icon className="h-5 w-5 text-[#2e8b57]" />
        </div>
      </div>
      
      {subtitle && (
        <div className="border-t-4 border-black pt-3 mt-1">
          <p className="text-xs font-black uppercase tracking-wider text-zinc-500">
            {subtitle}
          </p>
        </div>
      )}
    </div>
  );
}