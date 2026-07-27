interface FooterProps {
  storeName: string;
}

export function Footer({ storeName }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-semibold text-foreground">{storeName}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Cash on Delivery available across Pakistan
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Powered by{' '}
            <span className="font-semibold text-primary">SHOPO</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
