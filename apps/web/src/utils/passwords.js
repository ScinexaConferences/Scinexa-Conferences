export function getPasswordStrength(password) {
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  }

  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) {
    score += 1;
  }

  if (/\d/.test(password)) {
    score += 1;
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  }

  const levels = [
    { label: "Very weak", tone: "bg-[#f59aa8] text-[#8e2036]" },
    { label: "Weak", tone: "bg-[#ffcab0] text-[#92411b]" },
    { label: "Fair", tone: "bg-[#ffe39e] text-[#7b5b10]" },
    { label: "Strong", tone: "bg-[#b6f0cd] text-[#17693d]" },
    { label: "Excellent", tone: "bg-[#aee8ff] text-[#1d567a]" }
  ];

  return {
    score,
    progress: Math.min(score, 4),
    ...levels[score]
  };
}
