// Valsnack-märket: pratbubbla med riksdagspartiernas åtta färger — alla,
// alltid, samtidigt. Neutralitet genom inkludering, inte genom gråskala.
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M16 8 h32 a12 12 0 0 1 12 12 v16 a12 12 0 0 1 -12 12 h-22 l-10 10 v-10 h0 a12 12 0 0 1 -12 -12 v-16 a12 12 0 0 1 12 -12 z"
        className="fill-white stroke-gray-900 dark:fill-gray-950 dark:stroke-white"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <circle cx="17" cy="22" r="4.4" fill="#ED1B34" />
      <circle cx="27" cy="22" r="4.4" fill="#52BDEC" />
      <circle cx="37" cy="22" r="4.4" fill="#53A045" />
      <circle cx="47" cy="22" r="4.4" fill="#DDCC00" />
      <circle cx="17" cy="34" r="4.4" fill="#0069B4" />
      <circle cx="27" cy="34" r="4.4" fill="#AF0D0D" />
      <circle cx="37" cy="34" r="4.4" fill="#01683A" />
      <circle cx="47" cy="34" r="4.4" fill="#2B2E83" />
    </svg>
  );
}
