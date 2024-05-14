export default function Page() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">Bookings</h3>
            <div className="text-sm text-muted-foreground">
              <p>This is a Bookings page, all information about client spots bookings show up here</p>
            </div>
          </div>
        </div>
      );
}