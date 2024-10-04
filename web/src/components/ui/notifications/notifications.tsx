export const Notifications = () => {
  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-4">
      <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg">
        <p className="font-semibold">Success</p>
        <p>Your account has been created.</p>
      </div>
      <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg">
        <p className="font-semibold">Error</p>
        <p>Something went wrong.</p>
      </div>
    </div>
  );
};
