// Section title with its datasheet number: "§1 Selected work".
export function SectionHeading({ id, n, children }: { id: string; n: number; children: string }) {
  return (
    <h2 id={id} className="font-condensed text-title font-bold uppercase">
      <span className="mr-2 align-middle font-mono text-label font-normal tracking-normal text-accent lg:mr-3 lg:text-data">
        §{n}
      </span>
      {children}
    </h2>
  );
}
