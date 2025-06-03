export const isOverdue = (deadline: string): boolean => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const deadlineDate = new Date(deadline);
  const deadlineDateOnly = new Date(
    deadlineDate.getFullYear(),
    deadlineDate.getMonth(),
    deadlineDate.getDate()
  );
  return deadlineDateOnly < today;
};

export const isDueTodayOrTomorrow = (deadline: string): boolean => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const deadlineDate = new Date(deadline);
  const deadlineDateOnly = new Date(
    deadlineDate.getFullYear(),
    deadlineDate.getMonth(),
    deadlineDate.getDate()
  );

  return (
    deadlineDateOnly.getTime() === today.getTime() ||
    deadlineDateOnly.getTime() === tomorrow.getTime()
  );
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const targetDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  if (targetDate.getTime() === today.getTime()) {
    return "Hôm nay";
  } else if (targetDate.getTime() === tomorrow.getTime()) {
    return "Ngày mai";
  } else {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case "HIGH":
      return "text-red-600";
    case "MEDIUM":
      return "text-yellow-600";
    case "LOW":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
};

export const getPriorityText = (priority: string): string => {
  switch (priority) {
    case "HIGH":
      return "Cao";
    case "MEDIUM":
      return "Trung bình";
    case "LOW":
      return "Thấp";
    default:
      return priority;
  }
};
