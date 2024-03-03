import Image from "next/image";

export default function Loader() {
    return (
        <div className="bg-secondary min-h-[150vh] absolute top-0 left-0 right-0 w-full overflow-hidden">
            <Image
                priority
                className="drop-shadow-lg animate-bounce w-auto h-auto m-auto pt-[40vh]"
                src={'/images/logo.png'}
                width={100}
                height={100}
                alt="Loader" />
            <p className="pt-5 text-xl font-bold text-center">Loading...</p>
        </div>
    )
}
