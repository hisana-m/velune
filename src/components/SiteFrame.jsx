
export default function SiteFrame({ children }) {
  return (
    <div className="w-full bg-[#491225]">

      {/* Top Frame */}
      <div className="h-8 md:h-10 w-full bg-[#491225]" />

      {/* Cream Content with Left and Right Frames */}
      <div className="w-full px-3 md:px-5 lg:px-7 bg-[#491225]">
        <div className="w-full bg-[#F5E8D5]">
          {children}
        </div>
      </div>

      {/* Bottom Frame */}
      <div className="h-8 md:h-10 w-full bg-[#491225]" />

    </div>
  );
}
