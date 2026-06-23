"use client";

export default function AnnouncementBar() {
  const messages = [
    "FREE DELIVERY ON ORDERS ABOVE ₦50,000",
    "24-HOUR EXPRESS DELIVERY AVAILABLE",
    "NEW ARRIVALS: SUMMER COLLECTION IS HERE",
    "SHOP NOW — FIRST 50 ORDERS GET EXCLUSIVE GIFTS",
    "MOTHER & DAUGHTER MATCHING SETS NOW IN STOCK",
  ];

  return (
    <div className="bg-brand-primary text-white text-xs py-2 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...messages, ...messages].map((msg, i) => (
          <span key={i} className="mx-12 tracking-widest uppercase">
            {msg} &nbsp;✦
          </span>
        ))}
      </div>
    </div>
  );
}
