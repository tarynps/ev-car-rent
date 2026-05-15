import { Check, X, Clock } from "lucide-react";
import type { ApprovalStep } from "@/lib/types";

export default function BookingTimeline({ steps }: { steps: ApprovalStep[] }) {
  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${
              step.status === "done" ? "bg-black border-black" :
              step.status === "current" ? "bg-white border-tertiary" :
              step.status === "rejected" ? "bg-red-500 border-red-500" :
              "bg-white border-gray-200"
            }`}>
              {step.status === "done" && <Check size={14} className="text-white" />}
              {step.status === "current" && <Clock size={14} className="text-tertiary" />}
              {step.status === "rejected" && <X size={14} className="text-white" />}
              {step.status === "pending" && <span className="w-2 h-2 rounded-full bg-gray-300" />}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-0.5 h-8 ${step.status === "done" ? "bg-black" : "bg-gray-200"}`} />
            )}
          </div>
          <div className="pb-6">
            <p className={`text-sm font-medium ${step.status === "pending" ? "text-gray-400" : "text-primary"}`}>
              {step.step}
            </p>
            {step.actorName && (
              <p className="text-xs text-secondary">{step.actorName}</p>
            )}
            {step.timestamp && (
              <p className="text-xs text-gray-400">{step.timestamp}</p>
            )}
            {step.reason && (
              <p className="text-xs text-red-500 mt-0.5">Reason: {step.reason}</p>
            )}
            {step.status === "current" && (
              <p className="text-xs text-tertiary font-medium mt-0.5">Awaiting approval</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
