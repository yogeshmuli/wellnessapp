import { Colors } from "../styles";

export function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) =>
      word.length > 0 ? word[0].toUpperCase() + word.slice(1) : ""
    )
    .join(" ");
}

export function getColorByFocusArea(focusArea) {
  if (focusArea?.color) {
    return focusArea.color;
  }
  return Colors.primary;
  // switch (focusArea) {
  //   case "health_vitality":
  //     return Colors.q1;
  //   case "inner_growth":
  //     return Colors.q2;
  //   case "relationships":
  //     return Colors.q3;
  //   case "wealth":
  //     return Colors.q4;
  //   default:
  //     return Colors.primary;
  // }
}

export function getIconByFocusArea(focusArea) {
  if (focusArea.icon) {
    return focusArea.icon;
  }
  return "star";
  // switch (focusArea) {
  //   case "health_vitality":
  //     return "heartbeat";
  //   case "inner_growth":
  //     return "brain";
  //   case "relationships":
  //     return "users";
  //   case "wealth":
  //     return "chart-line";
  //   default:
  //     return "star";
  // }
}

export const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};
