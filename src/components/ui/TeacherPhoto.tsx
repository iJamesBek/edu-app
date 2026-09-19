import Image from "next/image";
import { Avatar } from "./Avatar";

/** Real photo when there is one, generated avatar otherwise. Fills its (positioned) parent. */
export function TeacherPhoto({
  name,
  photo,
  sizes,
  priority,
  className = "",
  textClassName,
}: {
  name: string;
  photo?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  textClassName?: string;
}) {
  if (!photo) return <Avatar name={name} className={className} textClassName={textClassName} />;
  return (
    <div className={`relative overflow-hidden bg-ink-2 ${className}`}>
      <Image
        src={photo}
        alt={name}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover object-[50%_25%] transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/tilt:scale-105"
      />
    </div>
  );
}
