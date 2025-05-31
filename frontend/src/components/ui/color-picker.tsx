import { useState } from 'react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Check } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}

const predefinedColors = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F43F5E', // Rose
  '#8B5A2B', // Brown
  '#6B7280', // Gray
  '#1F2937', // Dark Gray
  '#059669', // Emerald
];

export function ColorPicker({ value, onChange, disabled = false }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleColorSelect = (color: string) => {
    onChange(color);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className="w-full justify-start text-left font-normal"
        >
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded border border-gray-300"
              style={{ backgroundColor: value }}
            />
            <span>{value}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Selecciona un color</h4>
          
          {/* Predefined colors grid */}
          <div className="grid grid-cols-8 gap-2">
            {predefinedColors.map((color) => (
              <button
                key={color}
                className="relative h-8 w-8 rounded border border-gray-300 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
              >
                {value === color && (
                  <Check className="h-4 w-4 text-white absolute inset-0 m-auto drop-shadow-sm" />
                )}
              </button>
            ))}
          </div>

          {/* Custom color input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Color personalizado</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={value}
                onChange={(e) => handleColorSelect(e.target.value)}
                className="h-8 w-16 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => {
                  const color = e.target.value;
                  if (/^#[0-9A-F]{6}$/i.test(color)) {
                    handleColorSelect(color);
                  }
                }}
                placeholder="#000000"
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
