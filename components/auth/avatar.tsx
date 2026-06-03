import clsx from "clsx";
import Image from "next/image";

type UserCardProps = {
  name: string;
  email: string;
  isOnline: boolean;
  image?: string | null;
  onClick?: () => void;
  avatar?: boolean | null;
  lastReadAt?: string | null;
};

export default function UserCard({
  name,
  email,
  isOnline,
  image,
  onClick,
  avatar = false,

}: UserCardProps) {

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        avatar ? "w-auto" : "w-full ",
        "group flex  items-center gap-4 rounded-3xl border border-slate-200 bg-card p-4 text-left transition hover:border-sky-300 hover:bg-sky-50 dark:border-slate-800 dark:hover:border-sky-500 dark:hover:bg-sky-500",
      )}
    >
      <div className="relative h-14 w-14">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="rounded-3xl object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-3xl bg-sky-500 text-lg font-semibold text-white">
            {name.slice(0, 1).toUpperCase()}
          </div>
        )}

        <span
          className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
            isOnline ? "bg-emerald-400" : "bg-slate-400"
          } dark:border-slate-950`}
        />
      </div>

      {!avatar && (
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-foreground">{name}</h3>

            <span
              className={`text-xs font-medium ${
                isOnline ? "text-emerald-500" : "text-slate-700"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-700 dark:text-slate-600">
            {email}
          </p>
        </div>
      )}
    </button>
  );
}
