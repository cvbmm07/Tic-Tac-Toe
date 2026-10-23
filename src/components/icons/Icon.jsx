function Icon({ name, size = 16 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (name === "undo") {
    return (
      <svg {...common}>
        <path d="M9 14 4 9l5-5" />
        <path d="M4 9h10a6 6 0 0 1 0 12h-2" />
      </svg>
    );
  }

  if (name === "reset") {
    return (
      <svg {...common}>
        <path d="M20 7v5h-5" />
        <path d="M19 12a8 8 0 1 1-2.3-5.7L20 9" />
      </svg>
    );
  }

  throw new Error(`Unknown icon: ${name}`);
}

export default Icon;
