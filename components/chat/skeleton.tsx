
export function Skeleton() {
    return (
        <div className="space-y-3 animate-pulse">
            {/* assistant */}
            <div className="flex">
                <div className="max-w-[70%] rounded-2xl bg-gray-200 px-4 py-3 h-6 w-48" />
            </div>

            {/* user */}
            <div className="flex justify-end">
                <div className="max-w-[70%] rounded-2xl bg-gray-300 px-4 py-3 h-6 w-40" />
            </div>

            {/* assistant */}
            <div className="flex">
                <div className="max-w-[70%] rounded-2xl bg-gray-200 px-4 py-3 h-6 w-56" />
            </div>
        </div>
    );
}