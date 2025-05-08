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
    <div className="staff-filter">
      {staff.map((staffMember) => {
        const isSelected = selectedStaff.includes(staffMember.id);

        return (
          <button
            key={staffMember.id}
            className={`staff-filter-item ${isSelected ? 'active' : ''}`}
            style={{
              backgroundColor: isSelected ? staffMember.color : "transparent",
              color: isSelected ? "white" : "inherit",
              border: isSelected ? "none" : `2px solid ${staffMember.color}`
            }}
            onClick={() => onChange(staffMember.id)}
          >
            <Avatar className="staff-filter-avatar">
              <AvatarImage src={staffMember.avatar} alt={staffMember.name} />
              <AvatarFallback style={{ backgroundColor: staffMember.color, color: "white" }}>
                {staffMember.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <span className="staff-filter-name">{staffMember.name}</span>
          </button>
        );
      })}
    </div>
  );
}
