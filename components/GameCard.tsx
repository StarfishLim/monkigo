import { PropsWithChildren } from "react";

type GameCardProps = PropsWithChildren<{
  className?: string;
}>;

export const GameCard = ({ className = "", children }: GameCardProps) => {
  return (
    <section
      className={
        "mh-card relative overflow-hidden rounded-4xl border-0 bg-white p-5 shadow-soft-lg " +
        className
      }
    >
      {children}
    </section>
  );
};

