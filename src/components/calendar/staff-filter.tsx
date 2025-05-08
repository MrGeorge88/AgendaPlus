import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "../../lib/utils";

interface Staff {
  id: number;
  name: string;
  color: string;
  avatar: string;
}

interface StaffFilterProps {
  staff: Staff[];
  selectedStaff: number[];
  onChange: (staffId: number) => void;
}

export function StaffFilter({ staff, selectedStaff, onChange }: StaffFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {staff.map((staffMember) => {
        const isSelected = selectedStaff.includes(staffMember.id);
        
        return (
          <button
            key={staffMember.id}
            className={cn(
              "flex items-center space-x-2 rounded-full p-1 transition-all duration-150 ease-in",
              isSelected ? "ring-2 ring-offset-2" : "opacity-70 hover:opacity-100"
            )}
            style={{ 
              backgroundColor: isSelected ? staffMember.color : "transparent",
              color: isSelected ? "white" : "inherit",
              ringColor: staffMember.color
            }}
            onClick={() => onChange(staffMember.id)}
          >
            <Avatar>
              <AvatarImage src={staffMember.avatar} alt={staffMember.name} />
              <AvatarFallback style={{ backgroundColor: staffMember.color, color: "white" }}>
                {staffMember.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <span className="hidden pr-2 md:inline">{staffMember.name}</span>
          </button>
        );
      })}
    </div>
  );
}
