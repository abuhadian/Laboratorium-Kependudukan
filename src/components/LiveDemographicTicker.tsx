import React from 'react';
import { DemographicEvent } from '../types';
import { Baby, UserMinus, UserPlus, GraduationCap, Briefcase, Bell } from 'lucide-react';

interface LiveDemographicTickerProps {
  events: DemographicEvent[];
}

export const LiveDemographicTicker: React.FC<LiveDemographicTickerProps> = ({ events }) => {
  const getIcon = (type: DemographicEvent['type']) => {
    switch (type) {
      case 'birth':
        return <Baby className="w-3.5 h-3.5 text-emerald-400" />;
      case 'death':
        return <UserMinus className="w-3.5 h-3.5 text-rose-400" />;
      case 'in_migration':
        return <UserPlus className="w-3.5 h-3.5 text-cyan-400" />;
      case 'out_migration':
        return <UserMinus className="w-3.5 h-3.5 text-amber-400" />;
      case 'graduation':
        return <GraduationCap className="w-3.5 h-3.5 text-violet-400" />;
      case 'job_hired':
        return <Briefcase className="w-3.5 h-3.5 text-teal-400" />;
    }
  };

  return (
    <div className="bg-slate-900/60 border-y border-slate-800 px-4 py-2 text-xs overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold flex-shrink-0">
          <Bell className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden sm:inline">Feed Real-time Berau:</span>
        </div>

        <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-4">
          {events.slice(0, 5).map((evt) => (
            <div
              key={evt.id}
              className="inline-flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/60 whitespace-nowrap animate-fadeIn"
            >
              {getIcon(evt.type)}
              <span className="font-semibold text-slate-200">[{evt.kecamatan}]</span>
              <span className="text-slate-300">{evt.description}</span>
              <span className="text-[10px] text-slate-500">{evt.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
