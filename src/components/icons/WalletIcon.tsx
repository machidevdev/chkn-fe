const WalletIcon = ({ className }: { className: string }) => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="48" height="48" fill="#8834D8" fillOpacity="0.4" />
      <g clipPath="url(#clip0_56_326)">
        <path
          d="M13 14.9998V30.9998C13 31.5302 13.2107 32.0389 13.5858 32.414C13.9609 32.789 14.4696 32.9998 15 32.9998H35C35.2652 32.9998 35.5196 32.8944 35.7071 32.7069C35.8946 32.5193 36 32.265 36 31.9998V17.9998C36 17.7345 35.8946 17.4802 35.7071 17.2926C35.5196 17.1051 35.2652 16.9998 35 16.9998H15C14.4696 16.9998 13.9609 16.789 13.5858 16.414C13.2107 16.0389 13 15.5302 13 14.9998ZM13 14.9998C13 14.4693 13.2107 13.9606 13.5858 13.5855C13.9609 13.2105 14.4696 12.9998 15 12.9998H32"
          stroke="#EEAADD"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M30.5 25.9998C31.3284 25.9998 32 25.3282 32 24.4998C32 23.6713 31.3284 22.9998 30.5 22.9998C29.6716 22.9998 29 23.6713 29 24.4998C29 25.3282 29.6716 25.9998 30.5 25.9998Z"
          fill="#EEAADD"
        />
      </g>
      <defs>
        <clipPath id="clip0_56_326">
          <rect
            width="32"
            height="32"
            fill="white"
            transform="translate(8 8)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default WalletIcon;
