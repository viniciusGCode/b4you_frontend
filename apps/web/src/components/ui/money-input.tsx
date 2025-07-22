"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MoneyInputProps {
  value?: number;
  onChange?: (value: number) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export default function MoneyInput({
  value = 0,
  onChange,
  placeholder = "R$ 0,00",
  label = "Preço (R$)",
  disabled = false,
  className = "",
}: MoneyInputProps) {
  const [displayValue, setDisplayValue] = useState<string>(
    value ? new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value) : ""
  );

  const formatToCurrency = (num: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const parseFromCurrency = (str: string): number => {
    const cleanStr = str.replace(/[^\d,]/g, "").replace(",", ".");
    const num = parseFloat(cleanStr) || 0;
    return num;
  };

  useEffect(() => {
    setDisplayValue(value ? formatToCurrency(value) : "");
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === "") {
      setDisplayValue("");
      onChange?.(0);
      return;
    }

    const numbersOnly = inputValue.replace(/\D/g, "");
    if (numbersOnly === "") {
      setDisplayValue("");
      onChange?.(0);
      return;
    }

    const numericValue = parseInt(numbersOnly) / 100;
    const formatted = formatToCurrency(numericValue);
    setDisplayValue(formatted);
    onChange?.(numericValue);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <div className="space-y-1">
      {label && (
        <Label className="block text-sm font-medium text-foreground">
          {label}
        </Label>
      )}
      <Input
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full border-none outline-none bg-background text-foreground rounded-[var(--radius-sm)] px-3 py-2 ${className}`}
        inputMode="numeric"
        required
      />
    </div>
  );
}
