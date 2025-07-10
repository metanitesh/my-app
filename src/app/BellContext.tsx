import React, { createContext, useContext, useState } from "react";

interface BellEntry {
  id: number;
  name: string;
  subtitle: string;
  time: string;
}

interface BellContextType {
  bellEntries: BellEntry[];
  setBellEntries: React.Dispatch<React.SetStateAction<BellEntry[]>>;
}

const BellContext = createContext<BellContextType | undefined>(undefined);

export const BellProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [bellEntries, setBellEntries] = useState<BellEntry[]>([]);

  return (
    <BellContext.Provider value={{ bellEntries, setBellEntries }}>
      {children}
    </BellContext.Provider>
  );
};

export const useBellContext = () => {
  const context = useContext(BellContext);
  if (context === undefined) {
    throw new Error("useBellContext must be used within a BellProvider");
  }
  return context;
};
