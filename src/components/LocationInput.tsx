"use client";

// ----------------------------------------
// Imports
// ----------------------------------------
import { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import {
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
  Path,
} from "react-hook-form";

// components
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

// ----------------------------------------
// Types
// ----------------------------------------
interface LocationSuggestion {
  label: string;
}

interface LocationInputProps<T extends Record<string, any>> {
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  errors: FieldErrors<T>;
  suggestions: LocationSuggestion[];
  setSuggestions: Dispatch<SetStateAction<LocationSuggestion[]>>;
  name: Path<T>; // ✅ REQUIRED
}

interface GeoapifyFeature {
  properties: {
    city?: string;
    name?: string;
    state?: string;
    country?: string;
  };
}

interface GeoapifyResponse {
  features: GeoapifyFeature[];
}

// ----------------------------------------
// Main component
// ----------------------------------------
export function LocationInput<T extends Record<string, any>>({
  register,
  setValue,
  errors,
  suggestions,
  setSuggestions,
  name,
}: LocationInputProps<T>) {
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSuggestions]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Add shouldDirty: true here
    setValue(name, value as any, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      abortControllerRef.current?.abort();
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        setLoading(true);

        const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
        if (!apiKey) return;

        const res = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
            value,
          )}&limit=5&apiKey=${apiKey}`,
          { signal: abortController.signal },
        );

        const data: GeoapifyResponse = await res.json();

        const formattedSuggestions = data.features
          .map((feature) => {
            const { city, name, state, country } = feature.properties;
            const parts = [city || name, state, country].filter(Boolean);
            return parts.length ? { label: parts.join(", ") } : null;
          })
          .filter((s): s is LocationSuggestion => s !== null);

        setSuggestions(formattedSuggestions);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleSelectSuggestion = (label: string) => {
    // Add shouldDirty: true here too
    setValue(name, label as any, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setSuggestions([]);
  };

  return (
    <Field className="relative" ref={dropdownRef}>
      <FieldLabel htmlFor={name}>Location</FieldLabel>

      <Input
        id={name}
        autoComplete="off"
        {...register(name)}
        placeholder="Enter country or city"
        onChange={handleLocationChange}
        role="combobox"
        aria-expanded={suggestions.length > 0}
        aria-autocomplete="list"
        aria-controls="location-listbox"
      />

      {errors[name] && (
        <FieldError>{(errors[name] as any)?.message}</FieldError>
      )}

      {loading && (
        <p className="absolute top-full mt-1 left-3 text-xs">
          Loading suggestions...
        </p>
      )}

      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-card border rounded-lg mt-1 z-10">
          {suggestions.map((s, i) => (
            <button
              key={`${s.label}-${i}`}
              type="button"
              onClick={() => handleSelectSuggestion(s.label)}
              className="w-full text-left px-3 py-2 hover:bg-muted text-sm"
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </Field>
  );
}
