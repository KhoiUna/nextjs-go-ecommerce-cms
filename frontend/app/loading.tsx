import Loader from "@/components/ui/Loader";

export default function Loading() {
    return (
        <div className="bg-[#FFFFE6] min-h-[150vh] absolute top-0 left-0 right-0 w-full overflow-hidden">
            <Loader />
        </div>
    )
}