import React, { useEffect, useRef } from "react";

export const TerminalOutput: React.FC<{ output: string[] }> = ({ output }) => {
    const outputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output]);

    return (
        <div className="flex-1 overflow-y-auto pr-2 mb-4 custom-scrollbar text-[11px] leading-relaxed" ref={outputRef}>
            {output.length === 0 && <p className="text-cyan-800 italic">Awaiting telemetry data...</p>}
            {output.map((line, index) => {
                let colorClass = "text-cyan-600";
                if (line.includes("[SYS]") || line.includes("[UPLINK]")) colorClass = "text-purple-400";
                if (line.includes("Logic Triggered")) colorClass = "text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.4)]";
                if (line.includes("[ERR]")) colorClass = "text-red-400";

                return <p key={index} className={`${colorClass} break-words font-medium`}>{line}</p>;
            })}
        </div>
    );
};