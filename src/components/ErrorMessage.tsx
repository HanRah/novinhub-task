interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
        <h3 className="text-red-800 font-semibold mb-2">
          خطا در بارگذاری اطلاعات
        </h3>
        <p className="text-red-600 text-sm mb-4">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            تلاش مجدد
          </button>
        )}
      </div>
    </div>
  );
}