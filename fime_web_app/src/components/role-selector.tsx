"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

// Define the available user roles
export type UserRole = "ADMIN" | "MANAGER" | "MEMBER" | "FORMER_MEMBER";

interface RoleSelectorProps {
  onChange: (roles: UserRole[]) => void;
  defaultValue?: UserRole[];
}

export function RoleSelector({
  onChange,
  defaultValue = [],
}: RoleSelectorProps) {
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(defaultValue);

  const availableRoles: {
    value: UserRole;
    label: string;
    description: string;
  }[] = [
    {
      value: "ADMIN",
      label: "Quản trị viên",
      description:
        "Quyền truy cập đầy đủ vào tất cả các tính năng và cài đặt hệ thống",
    },
    {
      value: "MANAGER",
      label: "Quản lý",
      description:
        "Quản lý người dùng và dự án, nhưng không có quyền cài đặt hệ thống",
    },
    {
      value: "MEMBER",
      label: "Thành viên",
      description: "Truy cập tiêu chuẩn vào các tính năng của hệ thống",
    },
    {
      value: "FORMER_MEMBER",
      label: "Cựu thành viên",
      description: "Không được chương trình gợi ý trong quá trình làm việc",
    },
  ];

  const toggleRole = (role: UserRole) => {
    let updatedRoles: UserRole[];

    if (selectedRoles.includes(role)) {
      updatedRoles = selectedRoles.filter((r) => r !== role);
    } else {
      updatedRoles = [...selectedRoles, role];
    }

    setSelectedRoles(updatedRoles);
    onChange(updatedRoles);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {availableRoles.map((role) => (
        <div
          key={role.value}
          onClick={() => toggleRole(role.value)}
          className={`
                relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ease-in-out
                ${
                  selectedRoles.includes(role.value)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }
              `}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-foreground">{role.label}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {role.description}
              </p>
            </div>
            {selectedRoles.includes(role.value) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-primary text-primary-foreground rounded-full p-1"
              >
                <Check className="h-4 w-4" />
              </motion.div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
