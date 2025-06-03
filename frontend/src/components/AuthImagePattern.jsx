const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <svg
            width="240"
            height="240"
            viewBox="0 0 240 240"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Steam animations - adjusted for larger cup */}
            <path
              d="M100,35 Q115,10 130,35"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-primary/60 animate-steam-1"
            />
            <path
              d="M75,45 Q90,15 105,45"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-primary/60 animate-steam-2"
            />
            <path
              d="M125,45 Q140,15 155,45"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-primary/60 animate-steam-3"
            />

            {/* Coffee cup - larger with curved edges */}
            <path
              d="M45,70 C45,70 45,150 45,150 C45,165 65,180 120,180 C175,180 195,165 195,150 C195,150 195,70 195,70 C195,70 45,70 45,70 Z"
              fill="currentColor"
              className="text-primary/20"
            />
            <path
              d="M55,80 C55,80 55,145 55,145 C55,155 70,170 120,170 C170,170 185,155 185,145 C185,145 185,80 185,80 C185,80 55,80 55,80 Z"
              fill="currentColor"
              className="text-primary/40"
            />

            {/* Cup handle - smoother, more curved */}
            <path
              d="M195,90 C215,90 225,100 225,120 C225,140 215,150 195,150"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              className="text-primary/80"
              strokeLinecap="round"
            />

            {/* Saucer - larger to match cup */}
            <ellipse
              cx="120"
              cy="190"
              rx="85"
              ry="18"
              fill="currentColor"
              className="text-primary/30"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
